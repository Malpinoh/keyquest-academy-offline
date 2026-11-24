import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { targetWord: string; score: number; active: boolean; damageCount?: number; shields?: number; gameOver?: boolean; onObstacleHit?: () => void };

type SceneState = {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  ship?: THREE.Group;
  enemies: THREE.Group[];
  asteroids: THREE.Group[];
  beams: THREE.Mesh[];
  effects: THREE.Group[];
  enemyMaterial?: THREE.MeshStandardMaterial;
};

function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.12, "rgba(113,238,255,.95)");
    g.addColorStop(0.38, "rgba(28,145,255,.35)");
    g.addColorStop(1, "rgba(0,20,70,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

function makePlanetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const base = ctx.createLinearGradient(0, 0, 1024, 512);
    base.addColorStop(0, "#172b55");
    base.addColorStop(0.48, "#315f8c");
    base.addColorStop(1, "#101d43");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = 8 + Math.random() * 48;
      const g = ctx.createRadialGradient(x, y, 1, x, y, radius);
      g.addColorStop(0, i % 3 === 0 ? "rgba(126,179,174,.62)" : "rgba(27,58,91,.58)");
      g.addColorStop(1, "rgba(13,29,60,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#b6e9ff";
    ctx.lineWidth = 3;
    for (let y = 30; y < 512; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(280, y - 28, 650, y + 34, 1024, y - 12);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function addGlow(parent: THREE.Object3D, color: number, size: number, position: THREE.Vector3, texture: THREE.Texture) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  sprite.position.copy(position);
  sprite.scale.set(size, size, 1);
  parent.add(sprite);
  return sprite;
}

function createPlayerShip(glowTexture: THREE.Texture) {
  const ship = new THREE.Group();
  const hull = new THREE.MeshStandardMaterial({ color: 0x8eabc9, metalness: 0.88, roughness: 0.24 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x17263d, metalness: 0.82, roughness: 0.32 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x43d8f2, metalness: 0.55, roughness: 0.2, emissive: 0x087b9c, emissiveIntensity: 1.2 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x1a719c, metalness: 0.48, roughness: 0.08, transmission: 0.12, transparent: true, opacity: 0.9, emissive: 0x06364d, emissiveIntensity: 0.6 });
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number], rotation?: [number, number, number], scale?: [number, number, number]) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (rotation) mesh.rotation.set(...rotation);
    if (scale) mesh.scale.set(...scale);
    ship.add(mesh);
    return mesh;
  };

  // Armoured central fuselage, nose and cockpit.
  add(new THREE.CylinderGeometry(0.22, 0.38, 2.45, 10), hull, [0, 0, -0.05], [Math.PI / 2, 0, 0]);
  add(new THREE.ConeGeometry(0.28, 1.15, 10), hull, [0, 0, -1.78], [Math.PI / 2, 0, 0]);
  add(new THREE.BoxGeometry(0.72, 0.28, 1.18), dark, [0, -0.12, 0.28], [0.08, 0, 0]);
  add(new THREE.SphereGeometry(0.43, 24, 16), glass, [0, 0.3, -0.18], undefined, [0.78, 0.56, 1.12]);
  add(new THREE.BoxGeometry(0.05, 0.025, 0.85), trim, [0, 0.55, -0.18]);

  // Swept delta wings and segmented armour panels.
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(2.25, 0.12);
  wingShape.lineTo(1.18, -0.34);
  wingShape.lineTo(0.34, -0.56);
  wingShape.closePath();
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.045, bevelThickness: 0.04 });
  const leftWing = new THREE.Mesh(wingGeo, hull);
  leftWing.rotation.x = Math.PI / 2;
  leftWing.position.set(-0.2, -0.12, 0.05);
  ship.add(leftWing);
  const rightWing = leftWing.clone();
  rightWing.scale.x = -1;
  rightWing.position.x = 0.2;
  ship.add(rightWing);
  for (const side of [-1, 1]) {
    add(new THREE.BoxGeometry(0.72, 0.08, 0.42), dark, [side * 1.05, -0.12, 0.06], [0, 0, side * -0.12]);
    add(new THREE.BoxGeometry(0.88, 0.035, 0.055), trim, [side * 1.18, -0.035, 0.12]);
    add(new THREE.CylinderGeometry(0.16, 0.22, 0.95, 12), dark, [side * 0.78, -0.16, 0.92], [Math.PI / 2, 0, 0]);
    add(new THREE.CylinderGeometry(0.11, 0.13, 0.12, 16), trim, [side * 0.78, -0.16, 1.42], [Math.PI / 2, 0, 0]);
    addGlow(ship, 0x46dfff, 1.05, new THREE.Vector3(side * 0.78, -0.16, 1.53), glowTexture);
    add(new THREE.BoxGeometry(0.16, 0.12, 0.7), hull, [side * 0.33, -0.3, 0.72]);
  }
  add(new THREE.BoxGeometry(0.18, 0.46, 0.55), dark, [0, -0.38, 0.82]);
  add(new THREE.ConeGeometry(0.12, 0.52, 8), trim, [0, -0.4, 1.16], [Math.PI / 2, 0, 0]);
  add(new THREE.TorusGeometry(0.5, 0.035, 8, 28), trim, [0, 0.3, -0.18], [Math.PI / 2, 0, 0]);
  ship.scale.setScalar(1.18);
  ship.position.set(0, -1.2, 4.1);
  return ship;
}

function createEnemyShip(glowTexture: THREE.Texture, color: number, position: THREE.Vector3) {
  const enemy = new THREE.Group();
  const armour = new THREE.MeshStandardMaterial({ color: 0x3e526e, metalness: 0.86, roughness: 0.28 });
  const accent = new THREE.MeshStandardMaterial({ color, metalness: 0.52, roughness: 0.2, emissive: color, emissiveIntensity: 1.4 });
  const canopy = new THREE.MeshPhysicalMaterial({ color: 0x10263e, metalness: 0.6, roughness: 0.08, emissive: color, emissiveIntensity: 0.25 });
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, p: [number, number, number], r?: [number, number, number], s?: [number, number, number]) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...p);
    if (r) mesh.rotation.set(...r);
    if (s) mesh.scale.set(...s);
    enemy.add(mesh);
  };
  add(new THREE.ConeGeometry(0.38, 1.5, 6), armour, [0, 0, -0.18], [Math.PI / 2, 0, 0]);
  add(new THREE.SphereGeometry(0.32, 16, 12), canopy, [0, 0.22, 0.18], undefined, [1, 0.62, 1.2]);
  for (const side of [-1, 1]) {
    add(new THREE.BoxGeometry(1.25, 0.11, 0.42), armour, [side * 0.68, -0.05, 0.25], [0, 0, side * 0.2]);
    add(new THREE.BoxGeometry(0.65, 0.04, 0.06), accent, [side * 0.78, 0.02, 0.12]);
    add(new THREE.CylinderGeometry(0.1, 0.15, 0.55, 10), armour, [side * 0.55, -0.1, 0.72], [Math.PI / 2, 0, 0]);
    addGlow(enemy, color, 0.65, new THREE.Vector3(side * 0.55, -0.1, 1.02), glowTexture);
  }
  enemy.position.copy(position);
  enemy.userData = { baseX: position.x, baseY: position.y, phase: Math.random() * 6, destroyed: false };
  return enemy;
}

export function SpaceFlightScene({ targetWord, score, active, damageCount = 0, shields = 5, gameOver = false, onObstacleHit }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState>({ enemies: [], asteroids: [], beams: [], effects: [] });
  const scoreRef = useRef(score);
  const damageRef = useRef(damageCount);
  const activeRef = useRef(active);
  const hitRef = useRef(onObstacleHit);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { hitRef.current = onObstacleHit; }, [onObstacleHit]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    renderer.domElement.setAttribute("aria-label", "Original 3D space combat simulation");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020611);
    scene.fog = new THREE.FogExp2(0x050a19, 0.009);
    const camera = new THREE.PerspectiveCamera(49, host.clientWidth / Math.max(1, host.clientHeight), 0.1, 260);
    camera.position.set(0, 1.65, 13.6);
    camera.lookAt(0, 0, -5);

    scene.add(new THREE.HemisphereLight(0x9fc8ff, 0x080c1d, 1.25));
    const sun = new THREE.DirectionalLight(0xffd7ad, 2.7);
    sun.position.set(-9, 8, 7);
    scene.add(sun);
    const blueRim = new THREE.PointLight(0x2b8cff, 95, 65);
    blueRim.position.set(7, 2, -8);
    scene.add(blueRim);
    const violetRim = new THREE.PointLight(0x884cff, 65, 55);
    violetRim.position.set(-8, -2, -10);
    scene.add(violetRim);

    const glowTexture = makeGlowTexture();
    const planetTexture = makePlanetTexture();

    // Dense starfield at multiple depths creates strong parallax during flight.
    const starLayers: THREE.Points[] = [];
    for (let layer = 0; layer < 3; layer++) {
      const count = layer === 0 ? 2600 : 1100;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 125;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 78;
        positions[i * 3 + 2] = -Math.random() * (layer === 0 ? 180 : 100) - layer * 24;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const points = new THREE.Points(geometry, new THREE.PointsMaterial({
        color: layer === 0 ? 0xc8dcff : layer === 1 ? 0x7eacff : 0xffd8bd,
        size: layer === 0 ? 0.075 : 0.12 + layer * 0.035,
        transparent: true,
        opacity: layer === 0 ? 0.9 : 0.68,
        sizeAttenuation: true,
      }));
      scene.add(points);
      starLayers.push(points);
    }

    // Procedural nebula clouds: locally generated, no external image or asset dependency.
    const nebulaCanvas = document.createElement("canvas");
    nebulaCanvas.width = 1024;
    nebulaCanvas.height = 512;
    const nctx = nebulaCanvas.getContext("2d");
    if (nctx) {
      const wash = nctx.createLinearGradient(0, 0, 1024, 512);
      wash.addColorStop(0, "rgba(20,40,100,.02)");
      wash.addColorStop(0.45, "rgba(44,25,106,.38)");
      wash.addColorStop(1, "rgba(6,65,105,.16)");
      nctx.fillStyle = wash;
      nctx.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 34; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = 80 + Math.random() * 190;
        const g = nctx.createRadialGradient(x, y, 2, x, y, radius);
        g.addColorStop(0, i % 2 ? "rgba(52,95,226,.22)" : "rgba(172,51,190,.2)");
        g.addColorStop(0.55, i % 2 ? "rgba(30,68,150,.1)" : "rgba(95,37,140,.1)");
        g.addColorStop(1, "rgba(2,6,17,0)");
        nctx.fillStyle = g;
        nctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
    }
    const nebulaTexture = new THREE.CanvasTexture(nebulaCanvas);
    const nebula = new THREE.Mesh(new THREE.PlaneGeometry(110, 58), new THREE.MeshBasicMaterial({ map: nebulaTexture, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }));
    nebula.position.set(0, 1.5, -42);
    scene.add(nebula);

    // Large blue planet with atmospheric rim and ring system.
    const planetGroup = new THREE.Group();
    planetGroup.position.set(12.5, 4.5, -28);
    const planet = new THREE.Mesh(new THREE.SphereGeometry(7.2, 64, 48), new THREE.MeshStandardMaterial({ map: planetTexture, roughness: 0.92, metalness: 0.03 }));
    planetGroup.add(planet);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(7.42, 64, 48), new THREE.MeshBasicMaterial({ color: 0x4daaff, transparent: true, opacity: 0.18, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
    planetGroup.add(atmosphere);
    const planetRing = new THREE.Mesh(new THREE.TorusGeometry(9.6, 0.12, 8, 160), new THREE.MeshBasicMaterial({ color: 0x9bcfff, transparent: true, opacity: 0.48 }));
    planetRing.rotation.set(1.18, 0.25, -0.25);
    planetGroup.add(planetRing);
    scene.add(planetGroup);

    // Distant mining station silhouette adds scale and a sense of a lived-in sector.
    const station = new THREE.Group();
    station.position.set(-13, 5.5, -31);
    const stationCore = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 7.5, 16), new THREE.MeshStandardMaterial({ color: 0x46536e, metalness: 0.85, roughness: 0.42 }));
    stationCore.rotation.z = Math.PI / 2;
    station.add(stationCore);
    const stationRing = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.22, 10, 72), new THREE.MeshStandardMaterial({ color: 0x596c88, metalness: 0.78, roughness: 0.4 }));
    stationRing.rotation.y = Math.PI / 2.8;
    station.add(stationRing);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 2.1), new THREE.MeshStandardMaterial({ color: 0x64738d, metalness: 0.8 }));
      pylon.position.set(Math.cos(angle) * 3.9, Math.sin(angle) * 3.9, 0);
      pylon.rotation.z = angle;
      station.add(pylon);
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x54dfff : 0xffa96a }));
      light.position.set(Math.cos(angle) * 4.2, Math.sin(angle) * 4.2, 0.2);
      station.add(light);
    }
    scene.add(station);

    // Cinematic asteroid belt: layered boulders, fractured plates and mineral seams.
    const asteroids: THREE.Group[] = [];
    const rockMaterials = [0x626b7e, 0x777b8a, 0x454f68, 0x8a786b, 0x39475e].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.94, metalness: 0.16, flatShading: true }));
    const oreMaterial = new THREE.MeshStandardMaterial({ color: 0x287f9e, metalness: 0.72, roughness: 0.28, emissive: 0x07364e, emissiveIntensity: 0.8 });
    for (let i = 0; i < 42; i++) {
      const group = new THREE.Group();
      const radius = 0.28 + Math.random() * 1.05;
      const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 2), rockMaterials[i % rockMaterials.length].clone());
      rock.scale.set(0.72 + Math.random() * 0.75, 0.62 + Math.random() * 0.8, 0.72 + Math.random() * 0.8);
      rock.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      group.add(rock);

      // Broken fragments make each silhouette less like a repeated low-poly ball.
      const fragmentCount = 2 + Math.floor(Math.random() * 4);
      for (let j = 0; j < fragmentCount; j++) {
        const fragment = new THREE.Mesh(
          new THREE.DodecahedronGeometry(radius * (0.12 + Math.random() * 0.2), 0),
          rockMaterials[(i + j + 2) % rockMaterials.length],
        );
        fragment.position.set((Math.random() - 0.5) * radius * 1.9, (Math.random() - 0.5) * radius * 1.8, (Math.random() - 0.5) * radius * 1.8);
        fragment.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        group.add(fragment);
      }

      // A few exposed blue mineral deposits catch the distant starlight.
      if (i % 3 === 0) {
        for (let j = 0; j < 2; j++) {
          const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(radius * 0.12, 0), oreMaterial);
          crystal.position.set((Math.random() - 0.5) * radius * 1.2, (Math.random() - 0.5) * radius * 1.2, (Math.random() - 0.5) * radius * 1.2);
          crystal.rotation.set(Math.random(), Math.random(), Math.random());
          group.add(crystal);
        }
      }

      group.position.set((Math.random() - 0.5) * 11.5, (Math.random() - 0.5) * 6.2, -15 - Math.random() * 27);
      group.userData = { speed: 2.0 + Math.random() * 1.8, spin: (Math.random() - 0.5) * 0.5, drift: (Math.random() - 0.5) * 0.16, impactReady: true };
      scene.add(group);
      asteroids.push(group);
    }

    // Distant star flare and drifting wreckage give the sector cinematic scale.
    const distantSun = new THREE.Group();
    const sunCore = new THREE.Mesh(new THREE.SphereGeometry(2.4, 32, 24), new THREE.MeshBasicMaterial({ color: 0xffd7a0 }));
    distantSun.add(sunCore);
    const sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, color: 0xffb66d, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    sunHalo.scale.set(20, 20, 1);
    distantSun.add(sunHalo);
    distantSun.position.set(-20, 12, -62);
    scene.add(distantSun);

    const wreckage = new THREE.Group();
    wreckage.position.set(-15, -4, -19);
    wreckage.rotation.set(0.2, -0.35, 0.3);
    const wreckMetal = new THREE.MeshStandardMaterial({ color: 0x34465d, metalness: 0.86, roughness: 0.48 });
    const wreckTrim = new THREE.MeshStandardMaterial({ color: 0x2a9db5, metalness: 0.58, roughness: 0.3, emissive: 0x063747, emissiveIntensity: 0.65 });
    const wreckCore = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.8, 5.5, 8), wreckMetal);
    wreckCore.rotation.z = Math.PI / 2;
    wreckage.add(wreckCore);
    for (let i = 0; i < 5; i++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 1.15), i % 2 ? wreckMetal : wreckTrim);
      panel.position.set((i - 2) * 0.72, Math.sin(i * 1.4) * 0.85, (i % 2 ? 1 : -1) * 0.9);
      panel.rotation.set(i * 0.13, i * 0.2, (i - 2) * 0.24);
      wreckage.add(panel);
    }
    scene.add(wreckage);

    const ship = createPlayerShip(glowTexture);
    scene.add(ship);

    const enemyColors = [0xff6b64, 0xf4a34e, 0xa978ff, 0x4de1d2];
    const enemies: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const enemy = createEnemyShip(glowTexture, enemyColors[i], new THREE.Vector3((i - 1.5) * 2.65, (Math.random() - 0.5) * 2.4, -9 - i * 4.2));
      enemy.scale.setScalar(0.85 + Math.random() * 0.25);
      scene.add(enemy);
      enemies.push(enemy);
    }

    // A subtle cockpit-style reticle and sector beacon in the 3D world.
    const reticle = new THREE.Group();
    const reticleMat = new THREE.MeshBasicMaterial({ color: 0x6deaff, transparent: true, opacity: 0.55 });
    const reticleRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.012, 6, 64), reticleMat);
    reticle.add(reticleRing);
    for (let i = 0; i < 4; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.018, 0.018), reticleMat);
      const a = i * Math.PI / 2;
      tick.position.set(Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0);
      tick.rotation.z = a;
      reticle.add(tick);
    }
    reticle.position.set(0, 0.35, -7.8);
    scene.add(reticle);

    const beams: THREE.Mesh[] = [];
    const effects: THREE.Group[] = [];
    state.current = { scene, camera, ship, enemies, asteroids, beams, effects };

    const clock = new THREE.Clock();
    let raf = 0;
    let wasActive = false;
    let combatStartedAt: number | null = null;
    let attacksEnabledPreviously = false;
    const LAUNCH_GRACE_MS = 15000;
    const animate = () => {
      raf = window.requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.04);
      const t = clock.elapsedTime;
      const now = performance.now();
      const isActive = activeRef.current;
      if (isActive && !wasActive) {
        combatStartedAt = now;
        attacksEnabledPreviously = false;
      } else if (!isActive) {
        combatStartedAt = null;
        attacksEnabledPreviously = false;
      }
      wasActive = isActive;
      const attacksEnabled = isActive && combatStartedAt !== null && now - combatStartedAt >= LAUNCH_GRACE_MS;
      if (attacksEnabled && !attacksEnabledPreviously) {
        // Give the player a clean approach lane when the launch grace period ends.
        asteroids.forEach((rock) => {
          rock.position.set((Math.random() - 0.5) * 12.5, (Math.random() - 0.5) * 6.8, -20 - Math.random() * 20);
          rock.userData.impactReady = true;
        });
      }
      attacksEnabledPreviously = attacksEnabled;
      starLayers.forEach((stars, i) => {
        stars.rotation.y = t * (0.0015 + i * 0.001);
        stars.position.z = (t * (0.45 + i * 0.55)) % 12;
      });
      planet.rotation.y = t * 0.018;
      planetRing.rotation.z = -0.25 + Math.sin(t * 0.12) * 0.025;
      station.rotation.z = Math.sin(t * 0.08) * 0.025;
      ship.position.y = -1.2 + Math.sin(t * 1.5) * 0.055;
      ship.rotation.z = Math.sin(t * 0.48) * 0.018;
      ship.rotation.x = Math.sin(t * 0.35) * 0.012;
      if (damageRef.current > 0) {
        const pulse = Math.max(0, ((ship.userData.damagePulseUntil || 0) - performance.now()) / 450);
        ship.position.x = Math.sin(t * 44) * 0.035 * pulse;
      }
      asteroids.forEach((rock) => {
        if (!rock.visible) {
          if (performance.now() >= rock.userData.respawnAt) {
            rock.position.set((Math.random() - 0.5) * 12.5, (Math.random() - 0.5) * 6.8, -20 - Math.random() * 20);
            rock.userData.impactReady = true;
            rock.visible = true;
          }
          return;
        }
        rock.rotation.x += dt * rock.userData.spin;
        rock.rotation.y += dt * rock.userData.speed * 0.18;
        rock.position.z += dt * rock.userData.speed * (attacksEnabled ? 1 : isActive ? 0.12 : 0.18);
        rock.position.x += dt * rock.userData.drift;
        if (rock.position.z > 1.7 && rock.userData.impactReady && attacksEnabled) {
          rock.userData.impactReady = false;
          const bomb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), new THREE.MeshBasicMaterial({ color: 0xff4b45, transparent: true, opacity: 1 }));
          bomb.position.copy(rock.position);
          const trail = new THREE.PointLight(0xff382f, 8, 5);
          bomb.add(trail);
          scene.add(bomb);
          const bombStart = performance.now();
          const bombTimer = window.setInterval(() => {
            const elapsed = (performance.now() - bombStart) / 1000;
            bomb.position.lerp(ship.position.clone().add(new THREE.Vector3(0, 0, -0.5)), Math.min(1, elapsed * 2.5));
            if (elapsed >= 0.4) {
              window.clearInterval(bombTimer);
              scene.remove(bomb);
              bomb.geometry.dispose();
              (bomb.material as THREE.Material).dispose();
              hitRef.current?.();
            }
          }, 30);
          rock.position.set((Math.random() - 0.5) * 12.5, (Math.random() - 0.5) * 6.8, -20 - Math.random() * 20);
          rock.userData.impactReady = true;
        }
      });
      enemies.forEach((enemy, i) => {
        if (enemy.userData.destroyed) return;
        enemy.position.x = enemy.userData.baseX + Math.sin(t * 0.7 + enemy.userData.phase) * 0.72;
        enemy.position.y = enemy.userData.baseY + Math.cos(t * 0.95 + enemy.userData.phase) * 0.42;
        enemy.rotation.z = Math.sin(t * 0.7 + i) * 0.08;
        enemy.rotation.y = Math.sin(t * 0.4 + i) * 0.1;
        enemy.position.z += dt * (activeRef.current ? 0.18 : 0.045);
        if (enemy.position.z > -5.2) {
          enemy.position.z = -20 - Math.random() * 13;
          enemy.userData.baseX = (Math.random() - 0.5) * 9;
          enemy.userData.baseY = (Math.random() - 0.5) * 4;
        }
      });
      beams.forEach((beam) => {
        beam.userData.age += dt;
        (beam.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - beam.userData.age / 0.34);
      });
      for (let i = beams.length - 1; i >= 0; i--) {
        if (beams[i].userData.age > 0.34) {
          scene.remove(beams[i]);
          beams[i].geometry.dispose();
          (beams[i].material as THREE.Material).dispose();
          beams.splice(i, 1);
        }
      }
      effects.forEach((effect) => {
        effect.userData.age += dt;
        const age = effect.userData.age;
        effect.children.forEach((part, index) => {
          if (part instanceof THREE.Mesh) {
            part.position.addScaledVector(part.userData.velocity || new THREE.Vector3(), dt);
            if (part.userData.spin) {
              part.rotation.x += part.userData.spin.x * dt;
              part.rotation.y += part.userData.spin.y * dt;
              part.rotation.z += part.userData.spin.z * dt;
            }
            if (part.geometry instanceof THREE.SphereGeometry) part.scale.multiplyScalar(1.13);
            else if (part.geometry instanceof THREE.TorusGeometry) part.scale.multiplyScalar(1.11);
            else part.scale.multiplyScalar(1.012);
            const material = part.material as THREE.Material & { opacity?: number };
            if (material.opacity !== undefined) material.opacity = Math.max(0, 1 - age / 1.25);
          }
        });
      });
      for (let i = effects.length - 1; i >= 0; i--) {
        if (effects[i].userData.age > 1.25) {
          scene.remove(effects[i]);
          effects[i].traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              (object.material as THREE.Material).dispose();
            }
          });
          effects.splice(i, 1);
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) object.geometry.dispose();
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Sprite) {
          const material = object.material;
          if (material) (Array.isArray(material) ? material : [material]).forEach((m) => m.dispose());
        }
      });
      glowTexture.dispose();
      planetTexture.dispose();
      nebulaTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    const current = state.current;
    const scene = current.scene;
    const camera = current.camera;
    const ship = current.ship;
    if (!scene || !camera || !ship) return;
    ship.visible = !gameOver;
    if (gameOver) {
      const wreck = new THREE.Group();
      wreck.position.copy(ship.position);
      wreck.userData.age = 0;
      const burst = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 16), new THREE.MeshBasicMaterial({ color: 0xff613d, transparent: true, opacity: 1, blending: THREE.AdditiveBlending }));
      wreck.add(burst);
      const shockwave = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.08, 8, 36), new THREE.MeshBasicMaterial({ color: 0xffb36b, transparent: true, opacity: 1 }));
      wreck.add(shockwave);
      for (let i = 0; i < 54; i++) {
        const shard = new THREE.Mesh(new THREE.TetrahedronGeometry(0.06 + Math.random() * 0.12), new THREE.MeshBasicMaterial({ color: i % 3 ? 0xff7b42 : 0x7cecff, transparent: true, opacity: 1 }));
        shard.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 8);
        wreck.add(shard);
      }
      scene.add(wreck);
      current.effects.push(wreck);
    }
    if (score > scoreRef.current) {
      // Select a real, on-screen asteroid near the central gunsight.
      // This prevents the weapon from snapping to distant rocks outside the visible flight lane.
      ship.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      const start = ship.localToWorld(new THREE.Vector3(0, -0.08, -2.65));
      const candidates = current.asteroids
        .filter((rock) => rock.visible && rock.position.z < start.z)
        .map((rock) => {
          const projected = rock.position.clone().project(camera);
          const onScreen = projected.z > -1 && projected.z < 1 &&
            Math.abs(projected.x) < 0.995 && Math.abs(projected.y) < 0.995;
          const centerError = projected.x * projected.x + projected.y * projected.y;
          const distance = rock.position.distanceTo(start);
          return { rock, onScreen, centerError, distance };
        })
        .filter((item) => item.onScreen)
        .sort((a, b) => a.centerError - b.centerError || a.distance - b.distance);
      const target = candidates[0]?.rock;
      const end = target ? target.position.clone() : start.clone().add(new THREE.Vector3(0, 0, -18));
      const direction = end.clone().sub(start);
      const length = direction.length();

      // Bright, tapered energy bolt travels from the fighter's forward gun to the selected rock.
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.025, length, 10),
        new THREE.MeshBasicMaterial({ color: 0x8ffaff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending })
      );
      beam.position.copy(start).add(end).multiplyScalar(0.5);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
      beam.userData.age = 0;
      scene.add(beam);
      current.beams.push(beam);

      if (target) {
        // Remove the actual asteroid immediately, then show its rock body breaking into
        // large, independently moving chunks. This is deliberately more than a light flash.
        target.visible = false;
        target.userData.respawnAt = performance.now() + 6500;

        const explosion = new THREE.Group();
        explosion.position.copy(end);
        explosion.userData.age = 0;

        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.72, 20, 16),
          new THREE.MeshBasicMaterial({ color: 0xffd39a, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        explosion.add(core);

        const shockwave = new THREE.Mesh(
          new THREE.TorusGeometry(0.72, 0.075, 8, 48),
          new THREE.MeshBasicMaterial({ color: 0x9cefff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        shockwave.userData.expandRing = true;
        explosion.add(shockwave);

        // Large dark fragments make it unmistakable that the asteroid itself has shattered.
        const shardMaterials = [0x777b8a, 0x626b7e, 0x454f68, 0x8a786b].map((color) =>
          new THREE.MeshStandardMaterial({ color, roughness: 0.95, flatShading: true })
        );
        for (let i = 0; i < 16; i++) {
          const size = 0.16 + Math.random() * 0.28;
          const shard = new THREE.Mesh(
            new THREE.DodecahedronGeometry(size, 0),
            shardMaterials[i % shardMaterials.length].clone()
          );
          const direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 1.5
          ).normalize();
          shard.position.copy(direction.clone().multiplyScalar(0.18 + Math.random() * 0.32));
          shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          shard.userData.velocity = direction.multiplyScalar(2.8 + Math.random() * 4.2);
          shard.userData.spin = new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
          );
          explosion.add(shard);
        }

        // Bright sparks trail behind the larger rock chunks.
        for (let i = 0; i < 30; i++) {
          const spark = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.035 + Math.random() * 0.045, 0),
            new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffa35c : 0x72edff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending })
          );
          const direction = new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.5).normalize();
          spark.position.copy(direction.clone().multiplyScalar(0.25));
          spark.userData.velocity = direction.multiplyScalar(3.5 + Math.random() * 5);
          explosion.add(spark);
        }

        scene.add(explosion);
        current.effects.push(explosion);
      }
    }
    if (damageCount > damageRef.current) {
      ship.userData.damagePulseUntil = performance.now() + 450;
      const flash = new THREE.PointLight(0xff334f, 70, 9);
      flash.position.set(0, 0, 1);
      ship.add(flash);
      window.setTimeout(() => ship.remove(flash), 180);
    }
    scoreRef.current = score;
    damageRef.current = damageCount;
  }, [score, damageCount, gameOver]);

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden" aria-label="3D space combat environment">
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(1,5,17,.55)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-[#030713] via-[#030713]/45 to-transparent" />
      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl border border-cyan-200/25 bg-[#061326]/75 px-3 py-2 shadow-[0_0_24px_rgba(30,180,255,.12)] backdrop-blur-md">
        <p className="text-[9px] font-bold uppercase tracking-[.22em] text-cyan-300">Incoming target</p>
        <p className="mt-1 font-mono text-xl font-black tracking-[.22em] text-white sm:text-2xl">{targetWord.toUpperCase()}</p>
      </div>
      <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-xl border border-violet-200/25 bg-[#100c28]/75 px-3 py-2 text-right shadow-[0_0_24px_rgba(132,80,255,.12)] backdrop-blur-md">
        <p className="text-[9px] font-bold uppercase tracking-[.22em] text-violet-200">Combat score</p>
        <p className="mt-1 font-mono text-xl font-black tabular-nums text-white sm:text-2xl">{score.toLocaleString()}</p>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-[#061326]/65 px-3 py-2 backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
        <span className="text-[9px] font-bold uppercase tracking-[.18em] text-cyan-100">{active ? "Combat systems online" : "Sector scan standby"}</span>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-lg border border-white/10 bg-[#061326]/65 px-3 py-2 text-right backdrop-blur-md">
        <p className="text-[9px] font-bold uppercase tracking-[.18em] text-white/55">Hull shield</p>
        <div className="mt-1 flex gap-1">{Array.from({ length: 5 }, (_, i) => <span key={i} className={"h-1.5 w-4 rounded-sm " + (i < shields ? "bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,.75)]" : "bg-white/15")} />)}</div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[46%] z-[3] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/25">
        <span className="absolute -left-2 top-1/2 h-px w-4 bg-cyan-200/60" />
        <span className="absolute -right-2 top-1/2 h-px w-4 bg-cyan-200/60" />
        <span className="absolute left-1/2 -top-2 h-4 w-px bg-cyan-200/60" />
        <span className="absolute left-1/2 -bottom-2 h-4 w-px bg-cyan-200/60" />
      </div>
    </div>
  );
}
