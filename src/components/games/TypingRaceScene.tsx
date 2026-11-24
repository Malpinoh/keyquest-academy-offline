import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = { progress: number; rivalProgress: number; speed: number; errorSignal: number; active: boolean };

// Small procedural textures keep the scene self-contained and avoid network asset downloads.
function makeAsphaltTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#292d30"; ctx.fillRect(0, 0, 512, 512);
  let seed = 17;
  const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < 18000; i++) {
    const shade = Math.floor(28 + random() * 34);
    ctx.fillStyle = `rgba(${shade},${shade + 3},${shade + 5},${0.12 + random() * 0.22})`;
    const size = 0.5 + random() * 1.8;
    ctx.fillRect(random() * 512, random() * 512, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}


function makeSkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const sky = ctx.createLinearGradient(0, 0, 0, 512);
  sky.addColorStop(0, "#3979b8"); sky.addColorStop(0.48, "#83b5d8"); sky.addColorStop(1, "#d7e2e6");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 1024, 512);
  let seed = 2401;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let bank = 0; bank < 34; bank++) {
    const cx = random() * 1150 - 60, cy = 80 + random() * 235, spread = 34 + random() * 95;
    const puffs = 9 + Math.floor(random() * 15);
    ctx.save(); ctx.filter = `blur(${3 + random() * 7}px)`;
    for (let j = 0; j < puffs; j++) {
      const x = cx + (random() - 0.5) * spread * 2.5, y = cy + (random() - 0.5) * spread * 0.72;
      const rx = 15 + random() * spread * 0.62, ry = 8 + random() * spread * 0.24, alpha = 0.12 + random() * 0.22;
      const cloud = ctx.createRadialGradient(x - rx * 0.2, y - ry * 0.35, 1, x, y, rx);
      cloud.addColorStop(0, `rgba(255,255,255,${alpha})`);
      cloud.addColorStop(0.58, `rgba(246,250,252,${alpha * 0.72})`);
      cloud.addColorStop(1, "rgba(235,243,248,0)");
      ctx.fillStyle = cloud; ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, (random() - 0.5) * 0.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  ctx.save(); ctx.filter = "blur(5px)";
  for (let i = 0; i < 70; i++) {
    const x = random() * 1024, y = 25 + random() * 170;
    ctx.fillStyle = `rgba(255,255,255,${0.025 + random() * 0.06})`;
    ctx.beginPath(); ctx.ellipse(x, y, 18 + random() * 65, 2 + random() * 5, (random() - 0.5) * 0.08, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeGrassTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#526b45"; ctx.fillRect(0, 0, 512, 512);
  let seed = 91;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 26000; i++) {
    const shade = Math.floor(55 + random() * 55);
    ctx.fillStyle = `rgba(${shade - 10},${shade},${shade - 20},${0.08 + random() * 0.18})`;
    const w = 0.5 + random() * 2.2;
    const h = 1 + random() * 4;
    ctx.fillRect(random() * 512, random() * 512, w, h);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 18);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeCar(color: number, accent: number) {
  const car = new THREE.Group();
  const bodyMat = new THREE.MeshPhysicalMaterial({ color, metalness: 0.42, roughness: 0.31, clearcoat: 0.9, clearcoatRoughness: 0.16 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x101722, metalness: 0.45, roughness: 0.42 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x173447, metalness: 0.38, roughness: 0.12, transparent: true, opacity: 0.9, clearcoat: 1, clearcoatRoughness: 0.08 });
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x101214, roughness: 0.94 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xaebbc3, metalness: 0.92, roughness: 0.2 });
  const trimMat = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.6, roughness: 0.22, emissive: accent, emissiveIntensity: 0.3 });
  const roundedBox = (w: number, h: number, d: number, r: number) => {
    const radius = Math.min(r, w / 4, h / 4, d / 4);
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + radius, -h / 2);
    shape.lineTo(w / 2 - radius, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
    shape.lineTo(w / 2, h / 2 - radius);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
    shape.lineTo(-w / 2 + radius, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius);
    shape.lineTo(-w / 2, -h / 2 + radius);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);
    const depth = Math.max(0.05, d - radius * 2);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: radius * 0.42, bevelThickness: radius * 0.42, curveSegments: 6 });
    geometry.translate(0, 0, -depth / 2);
    return geometry;
  };
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, p: [number, number, number], s?: [number, number, number]) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(...p); if (s) m.scale.set(...s); car.add(m); return m;
  };
  // Low, wide performance coupe with a bonnet, sloped cabin and sculpted rear deck.
  add(roundedBox(2.05, 0.48, 4.25, 0.16), bodyMat, [0, 0.68, 0]);
  add(roundedBox(1.94, 0.22, 1.28, 0.08), bodyMat, [0, 0.91, -1.38]);
  add(roundedBox(1.9, 0.2, 1.02, 0.07), bodyMat, [0, 0.88, 1.48]);
  const cabin = add(roundedBox(1.52, 0.7, 1.92, 0.12), darkMat, [0, 1.16, -0.2]);
  cabin.rotation.x = -0.04;
  add(roundedBox(1.39, 0.52, 0.08, 0.035), glassMat, [0, 1.25, -1.13]);
  add(roundedBox(1.36, 0.48, 0.08, 0.035), glassMat, [0, 1.24, 0.73]);
  for (const x of [-0.77, 0.77]) {
    add(roundedBox(0.06, 0.42, 0.86, 0.025), glassMat, [x, 1.23, -0.18]);
    add(roundedBox(0.22, 0.12, 0.32, 0.04), bodyMat, [x * 1.25, 1.08, -0.65]);
  }
  add(new THREE.BoxGeometry(1.25, 0.1, 0.12), darkMat, [0, 0.68, -2.14]);
  add(new THREE.BoxGeometry(1.22, 0.16, 0.08), chromeMat, [0, 0.57, -2.16]);
  add(new THREE.BoxGeometry(1.55, 0.13, 0.08), darkMat, [0, 0.56, 2.13]);
  for (const x of [-0.82, 0.82]) add(new THREE.BoxGeometry(0.12, 0.12, 0.12), chromeMat, [x, 0.48, 2.12]);
  add(new THREE.BoxGeometry(2.12, 0.18, 1.05), bodyMat, [0, 0.48, -1.48]);
  add(new THREE.BoxGeometry(2.08, 0.16, 0.82), bodyMat, [0, 0.48, 1.55]);
  add(new THREE.BoxGeometry(2.18, 0.12, 0.12), trimMat, [0, 0.83, -2.08]);
  add(new THREE.BoxGeometry(1.8, 0.1, 0.12), trimMat, [0, 0.95, 2.08]);
  const headlightMat = new THREE.MeshStandardMaterial({ color: 0xe8fbff, emissive: 0x9ceaff, emissiveIntensity: 1.8, roughness: 0.18 });
  const brakeMat = new THREE.MeshStandardMaterial({ color: 0xff352b, emissive: 0xff160d, emissiveIntensity: 1.1 });
  for (const x of [-0.72, 0.72]) {
    add(new THREE.BoxGeometry(0.42, 0.16, 0.08), headlightMat, [x, 0.78, -2.14]);
    add(new THREE.BoxGeometry(0.42, 0.16, 0.08), brakeMat, [x, 0.76, 2.12]);
    add(new THREE.BoxGeometry(0.16, 0.22, 3.1), darkMat, [x * 1.25, 0.42, 0]);
  }
  add(new THREE.BoxGeometry(1.35, 0.08, 0.72), darkMat, [0, 0.42, -1.9]);
  car.userData.bodyMaterial = bodyMat;
  for (const x of [-1, 1]) for (const z of [-1.35, 1.35]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.32, 28), rubberMat);
    wheel.rotation.z = Math.PI / 2; wheel.position.set(x * 1.02, 0.42, z); car.add(wheel);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.34, 24), chromeMat);
    rim.rotation.z = Math.PI / 2; rim.position.copy(wheel.position); car.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.36, 16), trimMat);
    hub.rotation.z = Math.PI / 2; hub.position.copy(wheel.position); car.add(hub);
    const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.345, 20), darkMat);
    brakeDisc.rotation.z = Math.PI / 2; brakeDisc.position.copy(wheel.position); car.add(brakeDisc);
  }
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.12, 0.42), darkMat);
  spoiler.position.set(0, 1.2, 1.85); car.add(spoiler);
  car.userData.wheels = car.children.filter((o) => o instanceof THREE.Mesh && (o.geometry as THREE.BufferGeometry).type === "CylinderGeometry");
  return car;
}

export function TypingRaceScene({ progress, rivalProgress, speed, errorSignal, active }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const values = useRef({ progress, rivalProgress, speed, errorSignal, active });
  useEffect(() => { values.current = { progress, rivalProgress, speed, errorSignal, active }; }, [progress, rivalProgress, speed, errorSignal, active]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x83aeca);
    scene.fog = new THREE.Fog(0xb5c5cc, 125, 285);
    const skyTexture = makeSkyTexture();
    const skyDome = new THREE.Mesh(
      new THREE.SphereGeometry(240, 48, 32),
      new THREE.MeshBasicMaterial({ map: skyTexture ?? undefined, side: THREE.BackSide, depthWrite: false, fog: false })
    );
    scene.add(skyDome);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    pmrem.dispose();
    const camera = new THREE.PerspectiveCamera(58, host.clientWidth / Math.max(1, host.clientHeight), 0.1, 260);
    scene.add(new THREE.HemisphereLight(0xdce8f0, 0x45483f, 1.25));
    const sun = new THREE.DirectionalLight(0xfff1df, 2.4); sun.position.set(-25, 42, 18); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -95; sun.shadow.camera.right = 95; sun.shadow.camera.top = 95; sun.shadow.camera.bottom = -95; sun.shadow.bias = -0.00018; scene.add(sun);
    const fill = new THREE.DirectionalLight(0xc3d3df, 0.55); fill.position.set(24, 15, -30); scene.add(fill);

    const grassTexture = makeGrassTexture();
    if (grassTexture) {
      grassTexture.repeat.set(16, 12);
      grassTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(900, 700), new THREE.MeshStandardMaterial({ color: 0x9ca18e, map: grassTexture ?? undefined, roughness: 1 }));
    grass.rotation.x = -Math.PI / 2; grass.position.y = -0.2; grass.receiveShadow = true; scene.add(grass);

    // Low, irregular terrain forms a natural horizon instead of repeated decorative props.
    let terrainSeed = 739;
    const terrainRandom = () => { terrainSeed = (terrainSeed * 16807) % 2147483647; return terrainSeed / 2147483647; };
    for (let i = 0; i < 14; i++) {
      const radius = 30 + terrainRandom() * 34;
      const height = 7 + terrainRandom() * 16;
      const hill = new THREE.Mesh(
        new THREE.SphereGeometry(1, 18, 12),
        new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.27 + terrainRandom() * 0.035, 0.12, 0.25 + terrainRandom() * 0.1), roughness: 1 })
      );
      const angle = i / 14 * Math.PI * 2;
      hill.scale.set(radius, height, radius * (0.72 + terrainRandom() * 0.45));
      hill.position.set(Math.cos(angle) * 112, height * 0.55 - 3, Math.sin(angle) * 82);
      scene.add(hill);
    }

    const rx = 47, rz = 29, roadHalf = 6.2;
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 160 }, (_, i) => {
      const a = i / 160 * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * rx, 0, Math.sin(a) * rz);
    }), true, "catmullrom", 0.12);
    const roadPositions: number[] = [], roadIndices: number[] = [], uv: number[] = [];
    const segments = 420;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments, p = curve.getPointAt(t), tangent = curve.getTangentAt(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      for (const offset of [-roadHalf, roadHalf]) {
        const v = p.clone().addScaledVector(side, offset);
        roadPositions.push(v.x, 0.02, v.z); uv.push(t * 30, offset > 0 ? 1 : 0);
      }
      if (i < segments) { const a = i * 2; roadIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute("position", new THREE.Float32BufferAttribute(roadPositions, 3));
    roadGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); roadGeo.setIndex(roadIndices); roadGeo.computeVertexNormals();
    const asphaltTexture = makeAsphaltTexture();
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, map: asphaltTexture ?? undefined, roughness: 0.98, metalness: 0, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeo, roadMaterial);
    scene.add(road);
    // Pale concrete runoff shoulders give the circuit a more believable edge.
    const shoulder = new THREE.Mesh(new THREE.TubeGeometry(curve, 420, 0.16, 6, true), new THREE.MeshStandardMaterial({ color: 0xb9b8ad, roughness: 1 }));
    shoulder.position.y = -0.035; scene.add(shoulder);

    // Shared kerb geometry and materials keep the detailed circuit lightweight.
    const kerbGeometry = new THREE.BoxGeometry(1.35, 0.16, 0.8);
    const kerbMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xb8b9b4, roughness: 0.92 }),
      new THREE.MeshStandardMaterial({ color: 0x873c37, roughness: 0.92 }),
    ];
    // Instanced kerbs preserve the detailed red-white track edge with only two draw calls.
    const kerbInstances = kerbMaterials.map((material) => new THREE.InstancedMesh(kerbGeometry, material, 160));
    const kerbDummy = new THREE.Object3D();
    for (const [edgeIndex, edge] of [-1, 1].entries()) {
      for (let i = 0; i < 160; i++) {
        const t = i / 160, p = curve.getPointAt(t), tangent = curve.getTangentAt(t).normalize();
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        kerbDummy.position.copy(p).addScaledVector(side, edge * (roadHalf + 0.42));
        kerbDummy.position.y = 0.1;
        kerbDummy.rotation.set(0, Math.atan2(tangent.x, tangent.z), 0);
        kerbDummy.updateMatrix();
        kerbInstances[i % 2].setMatrixAt(edgeIndex * 80 + Math.floor(i / 2), kerbDummy.matrix);
      }
    }
    kerbInstances.forEach((instances) => { instances.instanceMatrix.needsUpdate = true; scene.add(instances); });

    // Dashed lane separators and a bold start/finish stripe.
    for (let i = 0; i < 80; i++) {
      const t = i / 80, p = curve.getPointAt(t), tangent = curve.getTangentAt(t);
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.035, 1.05), new THREE.MeshBasicMaterial({ color: 0xe9e9dc }));
      dash.position.copy(p); dash.position.y = 0.055; dash.rotation.y = Math.atan2(tangent.x, tangent.z); scene.add(dash);
    }
    const startP = curve.getPointAt(0);
    const startLine = new THREE.Mesh(new THREE.BoxGeometry(roadHalf * 2, 0.045, 0.8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    startLine.position.copy(startP); startLine.position.y = 0.07; scene.add(startLine);

    // Continuous safety barriers: instancing keeps the additional scenery inexpensive.
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x737d82, metalness: 0.78, roughness: 0.34, envMapIntensity: 1.2 });
    const postMaterial = new THREE.MeshStandardMaterial({ color: 0x596267, metalness: 0.72, roughness: 0.42 });
    const postGeometry = new THREE.CylinderGeometry(0.055, 0.075, 0.82, 8);
    const posts = new THREE.InstancedMesh(postGeometry, postMaterial, 320);
    const postDummy = new THREE.Object3D();
    for (const edge of [-1, 1]) {
      const railPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 240; i++) {
        const t = i / 240, p = curve.getPointAt(t), tangent = curve.getTangentAt(t).normalize();
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const railPoint = p.clone().addScaledVector(side, edge * (roadHalf + 2.05));
        railPoint.y = 0.88; railPoints.push(railPoint);
      }
      const railPath = new THREE.CatmullRomCurve3(railPoints, true, "centripetal");
      scene.add(new THREE.Mesh(new THREE.TubeGeometry(railPath, 480, 0.105, 10, true), railMaterial));
      for (let i = 0; i < 160; i++) {
        const p = curve.getPointAt(i / 160), tangent = curve.getTangentAt(i / 160).normalize();
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        postDummy.position.copy(p).addScaledVector(side, edge * (roadHalf + 2.05));
        postDummy.position.y = 0.42; postDummy.updateMatrix();
        posts.setMatrixAt((edge === -1 ? 0 : 160) + i, postDummy.matrix);
      }
    }
    posts.instanceMatrix.needsUpdate = true; scene.add(posts);

    // Grandstands and repeated cone-shaped trees removed: the open circuit and natural terrain establish scale.
    /* for (let i = 0; i < 18; i++) {
      const t = i / 18, p = curve.getPointAt(t), tangent = curve.getTangentAt(t);
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const stand = new THREE.Mesh(new THREE.BoxGeometry(10, 2.6, 3.5), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x52677b : 0x394d61, roughness: 0.9 }));
      stand.position.copy(p).addScaledVector(side, 11); stand.position.y = 1.1; stand.rotation.y = Math.atan2(tangent.x, tangent.z); scene.add(stand);
      for (let j = 0; j < 3; j++) {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.16, 0.3), new THREE.MeshStandardMaterial({ color: [0xd84b43, 0xe6e0c9, 0x426b9a][j] }));
        seat.position.copy(stand.position); seat.position.y = 0.55 + j * 0.62; seat.position.z += -0.9 + j * 0.55; seat.rotation.y = stand.rotation.y; scene.add(seat);
      }
    } */

    const cars = [makeCar(0x087fb5, 0x9df5ff), makeCar(0xb92f24, 0xffd08a), makeCar(0xb28a20, 0xffffff), makeCar(0x7445b6, 0xcab6ff)];
    const carShadows: THREE.Mesh[] = [];
    const addCarShadow = () => {
      const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.65, 32), new THREE.MeshBasicMaterial({ color: 0x101820, transparent: true, opacity: 0.22, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.025; scene.add(shadow); carShadows.push(shadow);
    };
    cars.forEach((car) => {
      car.traverse((object) => { if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; } });
      scene.add(car); addCarShadow();
    });

    // Load a detailed production car model; keep the local car mesh as an offline fallback.
    let modelLoadCancelled = false;
    const carLoader = new GLTFLoader();
    carLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/r180/examples/models/gltf/ferrari.glb",
      (gltf) => {
        if (modelLoadCancelled) return;
        const source = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(source);
        const size = bounds.getSize(new THREE.Vector3());
        const scale = 4.25 / Math.max(size.z, size.x, 0.001);
        source.scale.setScalar(scale);
        const scaledBounds = new THREE.Box3().setFromObject(source);
        source.position.x -= (scaledBounds.min.x + scaledBounds.max.x) / 2;
        source.position.y -= scaledBounds.min.y;
        source.position.z -= (scaledBounds.min.z + scaledBounds.max.z) / 2;
        cars.forEach((oldCar) => scene.remove(oldCar));
        carShadows.forEach((shadow) => scene.remove(shadow));
        cars.length = 0; carShadows.length = 0;
        const tints = [0x087fb5, 0xb92f24, 0xb28a20, 0x7445b6];
        for (let i = 0; i < 4; i++) {
          const model = source.clone(true);
          model.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.castShadow = true; object.receiveShadow = true;
              if (Array.isArray(object.material)) {
                object.material = object.material.map((material) => {
                  const copy = material.clone();
                  if ("color" in copy && (copy as THREE.MeshStandardMaterial).color) {
                    (copy as THREE.MeshStandardMaterial).color.lerp(new THREE.Color(tints[i]), i === 0 ? 0.16 : 0.32);
                  }
                  return copy;
                });
              } else {
                const copy = object.material.clone();
                if ("color" in copy && (copy as THREE.MeshStandardMaterial).color) {
                  (copy as THREE.MeshStandardMaterial).color.lerp(new THREE.Color(tints[i]), i === 0 ? 0.16 : 0.32);
                }
                object.material = copy;
              }
            }
          });
          scene.add(model); cars.push(model); addCarShadow();
        }
      },
      undefined,
      (error) => console.warn("Detailed race car model could not be loaded; using the built-in fallback.", error)
    );
    const clock = new THREE.Clock();
    let raf = 0;
    let previousErrorSignal = 0;
    let errorPulseUntil = 0;
    const playerLaneRef = { current: -3.2 };
    const animate = () => {
      raf = requestAnimationFrame(animate);
      clock.getDelta();
      const v = values.current;
      const playerT = (v.progress / 100) % 1;
      if (v.errorSignal !== previousErrorSignal) { previousErrorSignal = v.errorSignal; errorPulseUntil = clock.elapsedTime + 0.42; }
      const rivalT = (v.rivalProgress / 100) % 1;
      const positions = [playerT, rivalT, (rivalT + 0.39) % 1, (rivalT + 0.63) % 1];
      // Three usable racing lines. Check every opponent, not just the first
      // rival: a second car can occupy the first passing lane.
      const laneOffsets = [-3.2, 0, 3.2];
      const opponentLanes = [-3.2, -3.2, 3.2];
      const trackScale = 2 * Math.PI * Math.sqrt((rx * rx + rz * rz) / 2);
      const signedGapFor = (otherT: number) => ((otherT - playerT + 0.5 + 1) % 1) - 0.5;
      const nearbyOpponents = positions.slice(1).map((t, index) => ({
        distance: signedGapFor(t) * trackScale,
        lane: opponentLanes[index],
      }));
      const playerLaneNow = playerLaneRef.current;
      // Only initiate a pass for a car ahead in our current lane. Keep the
      // chosen passing lane until the car is fully behind us.
      const blockingOpponent = nearbyOpponents
        .filter((opponent) => opponent.distance > 0 && opponent.distance < 22 && Math.abs(opponent.lane - playerLaneNow) < 0.8)
        .sort((a, b) => a.distance - b.distance)[0];
      let targetPlayerLane = -3.2;
      if (blockingOpponent) {
        const clearLanes = laneOffsets
          .filter((lane) => lane !== playerLaneNow)
          .map((lane) => ({
            lane,
            clearance: Math.min(...nearbyOpponents.map((opponent) =>
              Math.abs(opponent.lane - lane) < 0.8 ? Math.abs(opponent.distance) : 999
            )),
          }))
          .filter((candidate) => candidate.clearance > 22)
          .sort((a, b) => Math.abs(a.lane - playerLaneNow) - Math.abs(b.lane - playerLaneNow));
        // If both passing lanes are occupied, wait in the current lane rather
        // than driving through another car.
        if (clearLanes.length) targetPlayerLane = clearLanes[0].lane;
        else targetPlayerLane = playerLaneNow;
      } else {
        // Return only after the original lane has a safe gap in both directions.
        const returnLaneClear = nearbyOpponents.every((opponent) =>
          Math.abs(opponent.lane + 3.2) > 0.8 ||
          (opponent.distance <= 0 ? Math.abs(opponent.distance) > 13 : opponent.distance > 22)
        );
        if (!returnLaneClear && Math.abs(playerLaneNow + 3.2) > 0.8) targetPlayerLane = playerLaneNow;
      }
      playerLaneRef.current = THREE.MathUtils.lerp(playerLaneNow, targetPlayerLane, 0.055);
      cars.forEach((car, i) => {
        const t = positions[i], p = curve.getPointAt(t), tangent = curve.getTangentAt(t).normalize();
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const lane = i === 0 ? playerLaneRef.current : opponentLanes[i - 1];
        p.addScaledVector(side, lane);
        const targetY = 0.08 + (v.active ? Math.sin(clock.elapsedTime * (8 + v.speed * 0.12) + i) * (0.012 + v.speed * 0.00022) : 0);
        p.y = targetY;
        car.position.lerp(p, i === 0 ? 0.12 : 0.075);
        car.rotation.y = Math.atan2(tangent.x, tangent.z);
        carShadows[i].position.x = car.position.x;
        carShadows[i].position.z = car.position.z;
        car.rotation.z = v.active && i === 0 ? Math.sin(clock.elapsedTime * 2.8) * (0.012 + v.speed * 0.00018) : 0;
        if (v.active && i === 0) {
          // Preserve the imported model scale; the error pulse is shown by a brief camera shake below.
          if (clock.elapsedTime < errorPulseUntil) car.position.x += Math.sin(clock.elapsedTime * 65) * 0.055;
        }
      });
      if (cars.length) {
        const player = cars[0], forward = curve.getTangentAt(playerT).normalize();
        const camTarget = player.position.clone().addScaledVector(forward, 2.4).add(new THREE.Vector3(0, 1.15, 0));
        const camPos = player.position.clone().addScaledVector(forward, -11.8).add(new THREE.Vector3(0, 5.6, 0));
        camera.fov = THREE.MathUtils.lerp(camera.fov, 56 + v.speed * 0.045, 0.08);
        camera.updateProjectionMatrix();
        camera.position.lerp(camPos, 0.085); camera.lookAt(camTarget);
      }
      renderer.render(scene, camera);
    };
    animate();
    const resize = () => { const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight); camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); };
    const observer = new ResizeObserver(resize); observer.observe(host);
    return () => { modelLoadCancelled = true; cancelAnimationFrame(raf); observer.disconnect(); scene.environment?.dispose(); skyTexture?.dispose(); grassTexture?.dispose(); asphaltTexture?.dispose(); scene.traverse((o) => { if (o instanceof THREE.Mesh || o instanceof THREE.InstancedMesh) { o.geometry.dispose(); const mats = Array.isArray(o.material) ? o.material : [o.material]; mats.forEach((m) => m.dispose()); } }); renderer.dispose(); renderer.domElement.remove(); };
  }, []);

  return <div ref={hostRef} className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-sky-200 sm:h-[580px] lg:h-[660px] [section:fullscreen_&]:h-[70vh] [section:fullscreen_&]:min-h-[420px]" aria-label="Original 3D racing circuit with player car and rival racers"><div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-white/30 bg-slate-950/65 px-3 py-2 text-[10px] font-black uppercase tracking-[.18em] text-white shadow-lg">KeyQuest Grand Prix · 3D Circuit</div><div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-lg bg-slate-950/65 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white">Blue car: You</div></div>;
}
