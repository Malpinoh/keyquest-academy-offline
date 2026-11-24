import * as THREE from "three";
import type { Finger } from "@/components/typing/VirtualKeyboard";

/**
 * Stable animation contract shared by every keyboard-hand asset.
 * Asset-specific skeleton names are translated into these canonical finger IDs.
 */
export type HandSide = "left" | "right";
export type CanonicalFinger = "thumb" | "index" | "middle" | "ring" | "pinky";

export const LEFT_HAND_FINGERS: readonly Finger[] = ["LP", "LR", "LM", "LI"];
export const RIGHT_HAND_FINGERS: readonly Finger[] = ["RI", "RM", "RR", "RP"];

export const FINGER_BONE_PREFIX: Record<Exclude<Finger, "TH">, CanonicalFinger> = {
  LP: "pinky", LR: "ring", LM: "middle", LI: "index",
  RI: "index", RM: "middle", RR: "ring", RP: "pinky",
};

export function sideForFinger(finger: Finger | null): HandSide | null {
  if (!finger || finger === "TH") return null;
  return LEFT_HAND_FINGERS.includes(finger) ? "left" : "right";
}

export function canonicalFingerForKey(finger: Finger | null): CanonicalFinger | null {
  if (!finger) return null;
  return finger === "TH" ? "thumb" : FINGER_BONE_PREFIX[finger];
}

/** Quaternius Universal Base Characters Standard GLTF, CC0 1.0. */
export const QUATERNIUS_HANDS_ASSET = {
  id: "quaternius-universal-base-characters",
  license: "CC0" as const,
  source: "https://quaternius.com/packs/universalbasecharacters.html",
  modelUrl: "https://raw.githubusercontent.com/programasweights/avatar/main/public/assets/character.glb",
  left: {
    wrist: "hand_l",
    forearm: "lowerarm_l",
    upperArm: "upperarm_l",
    shoulder: "clavicle_l",
  },
  right: {
    wrist: "hand_r",
    forearm: "lowerarm_r",
    upperArm: "upperarm_r",
    shoulder: "clavicle_r",
  },
};

/** Model-specific bone names mapped to the stable names used by the animator. */
export interface HandBoneMap {
  wrist: string;
  forearm?: string;
  upperArm?: string;
  shoulder?: string;
  fingers: Record<CanonicalFinger, readonly string[]>;
}

export interface HandAssetProfile {
  id: string;
  license: "CC0" | "CC-BY" | "CUSTOM";
  source: string;
  left: HandBoneMap;
  right: HandBoneMap;
  wristAnchors: Record<HandSide, readonly [number, number, number]>;
}

export interface FingerTarget {
  finger: CanonicalFinger;
  side: HandSide;
  key: string;
  /** Key contact point in keyboard-local coordinates. */
  contact: THREE.Vector3;
}

export interface HandRigAdapter {
  side: HandSide;
  wrist: THREE.Bone;
  forearm?: THREE.Bone;
  upperArm?: THREE.Bone;
  shoulder?: THREE.Bone;
  fingerChains: Map<CanonicalFinger, THREE.Bone[]>;
  restPose: Map<string, THREE.Quaternion>;
  root: THREE.Group;
}

const FINGER_SEGMENTS = ["01", "02", "03"] as const;

function findBone(root: THREE.Object3D, name: string): THREE.Bone | undefined {
  let found: THREE.Bone | undefined;
  root.traverse((object) => {
    if (object instanceof THREE.Bone && object.name === name) found = object;
  });
  return found;
}

/** Resolve the named Quaternius skeleton into the shared hand-rig contract. */
export function createHandRigAdapter(root: THREE.Group, side: HandSide): HandRigAdapter | null {
  const suffix = side === "left" ? "_l" : "_r";
  const wrist = findBone(root, QUATERNIUS_HANDS_ASSET[side].wrist);
  if (!wrist) return null;

  const fingerChains = new Map<CanonicalFinger, THREE.Bone[]>();
  const restPose = new Map<string, THREE.Quaternion>();
  const fingers: CanonicalFinger[] = ["thumb", "index", "middle", "ring", "pinky"];

  for (const finger of fingers) {
    const chain = FINGER_SEGMENTS
      .map((segment) => findBone(root, `${finger}_${segment}${suffix}`))
      .filter((bone): bone is THREE.Bone => Boolean(bone));
    if (chain.length) {
      fingerChains.set(finger, chain);
      chain.forEach((bone) => restPose.set(bone.uuid, bone.quaternion.clone()));
    }
  }

  [wrist, findBone(root, QUATERNIUS_HANDS_ASSET[side].forearm), findBone(root, QUATERNIUS_HANDS_ASSET[side].upperArm)]
    .forEach((bone) => { if (bone) restPose.set(bone.uuid, bone.quaternion.clone()); });

  const forearm = findBone(root, QUATERNIUS_HANDS_ASSET[side].forearm);
  const upperArm = findBone(root, QUATERNIUS_HANDS_ASSET[side].upperArm);
  const shoulder = findBone(root, QUATERNIUS_HANDS_ASSET[side].shoulder);
  return {
    side,
    wrist,
    ...(forearm ? { forearm } : {}),
    ...(upperArm ? { upperArm } : {}),
    ...(shoulder ? { shoulder } : {}),
    fingerChains,
    restPose,
    root,
  };
}

/**
 * CCD fingertip solver. The supplied target is in world coordinates and the
 * chain is ordered from the knuckle toward the fingertip.
 */
export function aimFingerAtWorldTarget(
  chain: readonly THREE.Bone[],
  target: THREE.Vector3,
  iterations = 5,
  maxStepRadians = 0.22,
): void {
  if (!chain.length) return;
  const last = chain[chain.length - 1]!;
  const tip = last.children.find((child: THREE.Object3D) => child instanceof THREE.Bone) ?? last;
  const worldAxis = new THREE.Vector3();
  const toTip = new THREE.Vector3();
  const toTarget = new THREE.Vector3();
  const worldDelta = new THREE.Quaternion();
  const localDelta = new THREE.Quaternion();

  for (let pass = 0; pass < iterations; pass++) {
    for (let i = chain.length - 1; i >= 0; i--) {
      const joint = chain[i]!;
      joint.updateWorldMatrix(true, true);
      tip.updateWorldMatrix(true, true);
      const jointPosition = joint.getWorldPosition(new THREE.Vector3());
      const tipPosition = tip.getWorldPosition(new THREE.Vector3());
      toTip.copy(tipPosition).sub(jointPosition).normalize();
      toTarget.copy(target).sub(jointPosition).normalize();
      if (toTip.lengthSq() < 1e-8 || toTarget.lengthSq() < 1e-8) continue;

      worldDelta.setFromUnitVectors(toTip, toTarget);
      const angle = 2 * Math.acos(THREE.MathUtils.clamp(worldDelta.w, -1, 1));
      if (angle < 0.002) continue;
      if (angle > maxStepRadians) {
        worldAxis.set(worldDelta.x, worldDelta.y, worldDelta.z).normalize();
        worldDelta.setFromAxisAngle(worldAxis, maxStepRadians);
      }

      const parentWorld = joint.parent?.getWorldQuaternion(new THREE.Quaternion()) ?? new THREE.Quaternion();
      localDelta.copy(parentWorld).invert().multiply(worldDelta).multiply(parentWorld);
      joint.quaternion.premultiply(localDelta).normalize();
      joint.updateWorldMatrix(true, true);
    }
  }
}

/**
 * Keep only triangles whose vertices are predominantly weighted to either
 * arm. The source character is a single skinned body mesh; this produces a
 * forearms-and-hands-only view while retaining the original skeleton/weights.
 */
export function isolateArmSurface(mesh: THREE.SkinnedMesh): THREE.BufferGeometry {
  const source = mesh.geometry;
  const skinIndex = source.getAttribute("skinIndex");
  const skinWeight = source.getAttribute("skinWeight");
  if (!skinIndex || !skinWeight || !source.index) return source.clone();

  const armBones = new Set<number>();
  mesh.skeleton.bones.forEach((bone, index) => {
    if (/(clavicle|upperarm|lowerarm|hand|thumb|index|middle|ring|pinky)_?[0-9]*_[lr]$/i.test(bone.name)) {
      armBones.add(index);
    }
  });

  const armWeightAt = (vertex: number) => {
    let weight = 0;
    for (let lane = 0; lane < 4; lane++) {
      if (armBones.has(skinIndex.getComponent(vertex, lane))) weight += skinWeight.getComponent(vertex, lane);
    }
    return weight;
  };

  // Keep transition triangles at shoulders and wrists too. Requiring every
  // corner vertex to be strongly arm-weighted was cutting the mesh into tiny,
  // disconnected fragments, which no longer read as recognizable hands.
  const kept: number[] = [];
  const index = source.index;
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2);
    const wa = armWeightAt(a), wb = armWeightAt(b), wc = armWeightAt(c);
    const average = (wa + wb + wc) / 3;
    const strongest = Math.max(wa, wb, wc);
    if (average >= 0.22 && strongest >= 0.48) kept.push(a, b, c);
  }

  // Never silently render an empty/near-empty arm mesh if an asset revision
  // changes its weights; retain the source mesh so the failure is visible.
  if (kept.length < 180) return source.clone();

  const geometry = source.clone();
  geometry.setIndex(kept);
  geometry.computeVertexNormals();
  return geometry;
}
