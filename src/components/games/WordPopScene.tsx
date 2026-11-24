import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  targetWord: string;
  popSignal: number;
  active: boolean;
  difficulty: "easy" | "medium" | "hard";
};

type Bubble = {
  group: THREE.Group;
  velocity: THREE.Vector3;
  phase: number;
  target: boolean;
  word: string;
};

const palette = [0xff4fd8, 0x7c5cff, 0x27d9ff, 0x61f2a4, 0xffb347];

function makeBubble(word: string, target: boolean, index: number) {
  const group = new THREE.Group();
  const color = palette[index % palette.length];
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(target ? 1.55 : 1.28, 32, 24),
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.2,
      roughness: 0.12,
      transmission: 0.12,
      transparent: true,
      opacity: 0.82,
      emissive: color,
      emissiveIntensity: target ? 0.24 : 0.12,
    }),
  );
  group.add(sphere);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(target ? 1.72 : 1.4, 0.045, 12, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: target ? 0.95 : 0.4 }),
  );
  group.add(ring);

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(3,7,18,0.72)";
    ctx.roundRect(34, 30, 444, 120, 30);
    ctx.fill();
    ctx.strokeStyle = target ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.35)";
    ctx.lineWidth = target ? 5 : 3;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 54px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word.toUpperCase(), 256, 91);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(target ? 2.65 : 2.25, target ? 0.94 : 0.79),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  label.position.z = target ? 1.48 : 1.23;
  group.add(label);

  if (target) {
    const glow = new THREE.PointLight(color, 4, 8);
    glow.position.z = 0.5;
    group.add(glow);
  }

  return group;
}

export function WordPopScene({ targetWord, popSignal, active, difficulty }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const values = useRef({ targetWord, popSignal, active, difficulty });
  useEffect(() => {
    values.current = { targetWord, popSignal, active, difficulty };
  }, [targetWord, popSignal, active, difficulty]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050615);
    scene.fog = new THREE.FogExp2(0x090a25, 0.025);

    const camera = new THREE.PerspectiveCamera(55, host.clientWidth / Math.max(1, host.clientHeight), 0.1, 100);
    camera.position.set(0, 0, 18);

    scene.add(new THREE.HemisphereLight(0x8ea9ff, 0x090812, 1.8));
    const key = new THREE.PointLight(0x8b5cf6, 18, 35);
    key.position.set(-8, 7, 10);
    scene.add(key);
    const fill = new THREE.PointLight(0x22d3ee, 12, 30);
    fill.position.set(8, -4, 8);
    scene.add(fill);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 420;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 45;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 28;
      starPositions[i * 3 + 2] = -4 - Math.random() * 25;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.75 })));

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(15, 64),
      new THREE.MeshBasicMaterial({ color: 0x0d1030, transparent: true, opacity: 0.42 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -7;
    floor.position.z = -2;
    scene.add(floor);

    const bubbles: Bubble[] = [];
    const debris: { mesh: THREE.Mesh; velocity: THREE.Vector3; life: number }[] = [];
    let lastSignal = values.current.popSignal;
    let currentTarget = values.current.targetWord;
    let raf = 0;

    const createSet = () => {
      bubbles.forEach((b) => scene.remove(b.group));
      bubbles.length = 0;
      const words = [currentTarget, "type", "speed", "focus"];
      for (let i = 0; i < words.length; i++) {
        const isTarget = i === 0;
        const group = makeBubble(words[i], isTarget, i);
        const x = isTarget ? 0 : (i - 2.5) * 3.6;
        const y = isTarget ? 0.2 : -1.3 + (i % 2) * 2.6;
        group.position.set(x, y, isTarget ? 1.5 : -0.2);
        group.userData.baseY = y;
        group.userData.phase = i * 1.7;
        scene.add(group);
        bubbles.push({
          group,
          velocity: new THREE.Vector3((i - 1.5) * 0.003, 0, 0),
          phase: i * 1.7,
          target: isTarget,
          word: words[i],
        });
      }
    };

    createSet();

    const explode = (group: THREE.Group) => {
      const origin = group.position.clone();
      for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.08 + Math.random() * 0.11, 0),
          new THREE.MeshBasicMaterial({ color: palette[i % palette.length], transparent: true }),
        );
        mesh.position.copy(origin);
        scene.add(mesh);
        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.18,
          (Math.random() - 0.5) * 0.18,
          (Math.random() - 0.5) * 0.18,
        );
        debris.push({ mesh, velocity, life: 1 });
      }
      group.visible = false;
    };

    const updateTarget = () => {
      currentTarget = values.current.targetWord;
      createSet();
    };

    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      const v = values.current;

      if (v.popSignal !== lastSignal) {
        lastSignal = v.popSignal;
        const target = bubbles.find((b) => b.target);
        if (target) explode(target.group);
        window.setTimeout(updateTarget, 260);
      }

      bubbles.forEach((b) => {
        if (!b.group.visible) return;
        b.group.rotation.y += dt * (b.target ? 0.35 : 0.2);
        b.group.position.y = (b.group.userData.baseY as number) + Math.sin(elapsed * (b.target ? 1.4 : 1) + b.phase) * (b.target ? 0.28 : 0.18);
        if (!b.target && v.active) {
          b.group.position.x += b.velocity.x * (v.difficulty === "hard" ? 1.8 : v.difficulty === "medium" ? 1.35 : 1);
          if (Math.abs(b.group.position.x) > 7) b.velocity.x *= -1;
        }
        if (b.target && v.active) {
          const s = 1 + Math.sin(elapsed * 5) * 0.045;
          b.group.scale.setScalar(s);
        }
      });

      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.life -= dt * 1.7;
        d.mesh.position.addScaledVector(d.velocity, dt * 18);
        d.mesh.rotation.x += dt * 6;
        d.mesh.rotation.y += dt * 8;
        d.mesh.scale.setScalar(Math.max(0.01, d.life));
        (d.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, d.life);
        if (d.life <= 0) {
          scene.remove(d.mesh);
          d.mesh.geometry.dispose();
          (d.mesh.material as THREE.Material).dispose();
          debris.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const resize = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const materials = Array.isArray(o.material) ? o.material : [o.material];
          materials.forEach((m) => {
            if ((m as THREE.MeshBasicMaterial).map) (m as THREE.MeshBasicMaterial).map?.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative h-[500px] w-full overflow-hidden rounded-[1.5rem] border border-fuchsia-300/20 bg-[#050615] sm:h-[580px] lg:h-[660px] [section:fullscreen_&]:h-[70vh] [section:fullscreen_&]:min-h-[420px]"
      aria-label="Original 3D Word Pop arena with floating words"
    >
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-[10px] font-black uppercase tracking-[.2em] text-fuchsia-100">
        KeyQuest · Word Pop Arena
      </div>
      <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg bg-slate-950/65 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/80">
        Target bubble glows
      </div>
    </div>
  );
}
