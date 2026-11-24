import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { target: string; hitSignal: number; missSignal: number; active: boolean };

function labelTexture(value: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = color;
    ctx.font = "900 112px Arial";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(value.toUpperCase(), 128, 132);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function KeyChallengeScene({ target, hitSignal, missSignal, active }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef({ target, hitSignal, missSignal, active });
  useEffect(() => { state.current = { target, hitSignal, missSignal, active }; }, [target, hitSignal, missSignal, active]);

  useEffect(() => {
    const el = host.current; if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07101d);
    scene.fog = new THREE.Fog(0x07101d, 18, 38);
    const camera = new THREE.PerspectiveCamera(43, el.clientWidth / Math.max(1, el.clientHeight), 0.1, 100);
    camera.position.set(0, 8.8, 15.8); camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xb8d8ff, 0x101827, 2));
    const keyLight = new THREE.PointLight(0x31d7ff, 95, 35); keyLight.position.set(-5, 10, 8); scene.add(keyLight);
    const purple = new THREE.PointLight(0x8b5cf6, 65, 30); purple.position.set(7, 4, -4); scene.add(purple);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0x0b1728, metalness: .35, roughness: .65 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -1.25; scene.add(floor);
    const grid = new THREE.GridHelper(50, 45, 0x16445b, 0x14253b); grid.position.y = -1.22; scene.add(grid);

    const keys = new Map<string, { group: THREE.Group; top: THREE.Mesh; baseY: number }>();
    const rows = ["1234567890", "qwertyuiop", "asdfghjkl;", "zxcvbnm,./"];
    const rowOffsets = [0, -.35, .05, .55];
    const rowZ = [-3.7, -1.75, .2, 2.15];
    rows.forEach((row, ri) => {
      [...row].forEach((ch, ci) => {
        const group = new THREE.Group();
        const x = (ci - (row.length - 1) / 2) * 1.22 + rowOffsets[ri];
        group.position.set(x, 0, rowZ[ri]);
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.08, .32, 1.08), new THREE.MeshStandardMaterial({ color: 0x17283d, metalness: .62, roughness: .28 }));
        base.position.y = -.18; group.add(base);
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.02, .22, 1.02), new THREE.MeshStandardMaterial({ color: 0x263b54, metalness: .42, roughness: .3, emissive: 0x06101d }));
        top.position.y = .08; group.add(top);
        const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture(ch, "#ffffff"), transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: true }));
        label.scale.set(.58, .58, 1); label.position.set(0, .36, 0); label.renderOrder = 5; group.add(label);
        scene.add(group); keys.set(ch, { group, top, baseY: .08 });
      });
    });
    const space = new THREE.Group(); space.position.set(0, 0, 4.15);
    const spaceBase = new THREE.Mesh(new THREE.BoxGeometry(5.5, .32, 1.05), new THREE.MeshStandardMaterial({ color: 0x17283d, metalness: .62, roughness: .28 })); spaceBase.position.y = -.18; space.add(spaceBase);
    const spaceTop = new THREE.Mesh(new THREE.BoxGeometry(5.42, .22, .98), new THREE.MeshStandardMaterial({ color: 0x263b54, metalness: .42, roughness: .3 })); spaceTop.position.y = .08; space.add(spaceTop); scene.add(space);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(.76, .055, 12, 64), new THREE.MeshBasicMaterial({ color: 0x35e5ff, transparent: true, opacity: .95 }));
    ring.rotation.x = Math.PI / 2; ring.position.y = .38; scene.add(ring);
    const targetPlate = new THREE.Mesh(new THREE.BoxGeometry(2.25, .12, 1.5), new THREE.MeshStandardMaterial({ color: 0x10283b, emissive: 0x073d55, emissiveIntensity: 1.5, metalness: .6, roughness: .25 }));
    targetPlate.position.set(0, 2.5, -5.5); scene.add(targetPlate);
    const targetLabel = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), new THREE.MeshBasicMaterial({ map: labelTexture(state.current.target, "#ffffff"), transparent: true, side: THREE.DoubleSide }));
    targetLabel.position.set(0, 2.59, -5.5); scene.add(targetLabel);

    const particles: { mesh: THREE.Mesh; velocity: THREE.Vector3; life: number }[] = [];
    let lastHit = state.current.hitSignal, lastMiss = state.current.missSignal, shown = "";
    const updateTarget = (value: string) => {
      const old = targetLabel.material as THREE.MeshBasicMaterial;
      old.map?.dispose();
      old.map = labelTexture(value, "#ffffff"); old.needsUpdate = true;
      const found = keys.get(value.toLowerCase());
      if (found) {
        ring.position.x = found.group.position.x;
        ring.position.z = found.group.position.z;
      }
      shown = value.toLowerCase();
    };
    updateTarget(state.current.target);
    const burst = (color: number) => {
      for (let i = 0; i < 22; i++) {
        const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(.055 + Math.random() * .09, 0), new THREE.MeshBasicMaterial({ color, transparent: true }));
        mesh.position.set(ring.position.x, .45, ring.position.z); scene.add(mesh);
        particles.push({ mesh, velocity: new THREE.Vector3((Math.random()-.5)*.22, Math.random()*.2, (Math.random()-.5)*.22), life: 1 });
      }
    };
    const clock = new THREE.Clock(); let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime, v = state.current;
      if (v.target.toLowerCase() !== shown) updateTarget(v.target);
      ring.rotation.z += dt * 1.1; ring.scale.setScalar(1 + Math.sin(t * 5) * .07);
      const current = keys.get(v.target.toLowerCase());
      if (current) current.top.position.y = .08 + Math.sin(t * 4) * .035;
      if (v.hitSignal !== lastHit) { lastHit = v.hitSignal; burst(0x55f5b5); if (current) current.group.position.y = -.18; }
      if (v.missSignal !== lastMiss) { lastMiss = v.missSignal; burst(0xff5577); }
      keys.forEach((k, ch) => {
        const isTarget = ch === v.target.toLowerCase();
        const mat = k.top.material as THREE.MeshStandardMaterial;
        mat.emissive.setHex(isTarget ? 0x0b91ad : 0x06101d);
        mat.emissiveIntensity = isTarget ? 1.1 + Math.sin(t * 5) * .35 : .18;
        k.group.position.y += (0 - k.group.position.y) * Math.min(1, dt * 8);
      });
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.life -= dt * 1.5; p.mesh.position.addScaledVector(p.velocity, dt * 12);
        p.mesh.scale.setScalar(Math.max(.01, p.life)); (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, p.life);
        if (p.life <= 0) { scene.remove(p.mesh); p.mesh.geometry.dispose(); p.mesh.material.dispose(); particles.splice(i, 1); }
      }
      renderer.render(scene, camera);
    };
    animate();
    const resize = () => { const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight); camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    const observer = new ResizeObserver(resize); observer.observe(el);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); scene.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); const mats = Array.isArray(o.material) ? o.material : [o.material]; mats.forEach(m => { (m as THREE.MeshBasicMaterial).map?.dispose(); m.dispose(); }); } }); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div ref={host} className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#07101d] sm:h-[580px] lg:h-[660px] [section:fullscreen_&]:h-[70vh] [section:fullscreen_&]:min-h-[420px]" aria-label="Three-dimensional keyboard with a glowing target key"><div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-[10px] font-black uppercase tracking-[.2em] text-cyan-100">KeyQuest · 3D Key Lab</div></div>;
}
