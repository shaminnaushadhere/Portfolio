import { useEffect, useRef } from "react";
import * as THREE from "three";

// Fictional, procedurally generated city. No external images or map tiles.
export default function ProceduralCity({ onProgress }) {
  const host = useRef(null);
  const progress = useRef(onProgress);
  useEffect(() => { progress.current = onProgress; }, [onProgress]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
    } catch {
      el.dataset.fallback = "true";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    // renderer.setSize(el.clientWidth, el.clientHeight);
    console.log("3D CITY SIZE:", el.clientWidth, el.clientHeight);

renderer.setSize(
  Math.max(el.clientWidth, 1),
  Math.max(el.clientHeight, 1)
);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030b12);
    scene.fog = new THREE.FogExp2(0x06141d, 0.0085);
    const camera = new THREE.PerspectiveCamera(52, Math.max(1, el.clientWidth) / Math.max(1, el.clientHeight), 0.1, 800);
    scene.add(new THREE.HemisphereLight(0x9bbbd5, 0x080d17, 1.8));
    const moon = new THREE.DirectionalLight(0x8db6db, 2.3);
    moon.position.set(-65, 110, 30);
    scene.add(moon);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(450, 450), new THREE.MeshStandardMaterial({ color: 0x111d24, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.12;
    scene.add(ground);

    // Deterministic seeded random ensures stable layout between visits.
    let seed = 39218;
    const rand = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
    const grid = 19;
    const spacing = 12;
    const structures = [];
    const litWindows = [];
    const roofs = [];
    for (let x = -grid; x <= grid; x++) {
      for (let z = -grid; z <= grid; z++) {
        if (Math.abs(x) % 5 === 0 || Math.abs(z) % 5 === 0) continue;
        if (rand() < 0.09) continue;
        const downtown = Math.max(0, 1 - Math.hypot(x, z) / 18);
        const h = 3 + rand() * 10 + Math.pow(downtown, 2) * (rand() * 55);
        const w = 5.5 + rand() * 3.3;
        const d = 5.5 + rand() * 3.3;
        const px = x * spacing + (rand() - 0.5) * 1.5;
        const pz = z * spacing + (rand() - 0.5) * 1.5;
        structures.push({ x: px, z: pz, h, w, d, shade: 0.5 + rand() * 0.5 });
        if (rand() > 0.5) roofs.push({ x: px, y: h + 0.2, z: pz });
        // Instanced tiny emissive windows on building fronts; no image textures.
        for (let y = 2.2; y < h - 1; y += 2.3) {
          for (let wx = -w / 2 + 1.1; wx < w / 2 - 0.4; wx += 1.65) {
            if (rand() < 0.38) litWindows.push({ x: px + wx, y, z: pz + d / 2 + 0.035, warm: rand() > 0.22 });
          }
        }
      }
    }

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x263d4b, roughness: 0.86, metalness: 0.22 });
    const buildings = new THREE.InstancedMesh(boxGeo, buildingMat, structures.length);
    const dummy = new THREE.Object3D();
    const tint = new THREE.Color();
    structures.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      buildings.setMatrixAt(i, dummy.matrix);
      tint.setRGB(0.48 * b.shade, 0.66 * b.shade, 0.8 * b.shade);
      buildings.setColorAt(i, tint);
    });
    buildings.instanceMatrix.needsUpdate = true;
    scene.add(buildings);

    const windowGeo = new THREE.PlaneGeometry(0.66, 0.9);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xffd38c, side: THREE.DoubleSide, toneMapped: false });
    const windows = new THREE.InstancedMesh(windowGeo, windowMat, litWindows.length);
    litWindows.forEach((w, i) => {
      dummy.position.set(w.x, w.y, w.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      windows.setMatrixAt(i, dummy.matrix);
      tint.set(w.warm ? 0xffd89a : 0x71d5ff);
      windows.setColorAt(i, tint);
    });
    windows.instanceMatrix.needsUpdate = true;
    scene.add(windows);

    // Road strips and dotted light markers: all geometry, no textures.
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x08121a });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x34535c });
    for (let n = -20; n <= 20; n += 5) {
      const p = n * spacing;
      const roadX = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 480), roadMat);
      roadX.rotation.x = -Math.PI / 2;
      roadX.position.set(p, 0.012, 0);
      scene.add(roadX);
      const roadZ = new THREE.Mesh(new THREE.PlaneGeometry(480, 4.6), roadMat);
      roadZ.rotation.x = -Math.PI / 2;
      roadZ.position.set(0, 0.014, p);
      scene.add(roadZ);
      const markX = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 470), lineMat);
      markX.rotation.x = -Math.PI / 2;
      markX.position.set(p, 0.02, 0);
      scene.add(markX);
      const markZ = new THREE.Mesh(new THREE.PlaneGeometry(470, 0.13), lineMat);
      markZ.rotation.x = -Math.PI / 2;
      markZ.position.set(0, 0.021, p);
      scene.add(markZ);
    }
    const roofMat = new THREE.MeshBasicMaterial({ color: 0x6bbdd2 });
    const roofMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.65, 0.35, 0.65), roofMat, roofs.length);
    roofs.forEach((r, i) => {
      dummy.position.set(r.x, r.y, r.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      roofMesh.setMatrixAt(i, dummy.matrix);
    });
    scene.add(roofMesh);

    // Highlight one downtown building as the tracked point.
    const target = structures.reduce((best, b) => (Math.hypot(b.x, b.z) < Math.hypot(best.x, best.z) ? b : best), structures[0]);
    const targetPosition = new THREE.Vector3(target.x, target.h + 4, target.z);
    
const clock = new THREE.Clock();
let frame = 0;
let raf = 0;

const duration = 4.8;
const lockTime = 3.7;

// Camera patrol points across the generated city.
// These are randomized once per visit.
const patrolPoints = Array.from({ length: 3 }, () => ({
  x: (rand() - 0.5) * 150,
  y: 65 + rand() * 45,
  z: (rand() - 0.5) * 150,
}));

// Begin with the city already visible.
const cameraPoints = [
  new THREE.Vector3(-85, 125, 100),
  ...patrolPoints.map(
    p => new THREE.Vector3(p.x, p.y, p.z)
  ),
  new THREE.Vector3(
    target.x + 35,
    target.h + 45,
    target.z + 45
  ),
];

const lookPoints = [
  new THREE.Vector3(0, 8, 0),
  ...patrolPoints.map(p =>
    new THREE.Vector3(
      p.x + (rand() - 0.5) * 35,
      10,
      p.z + (rand() - 0.5) * 35
    )
  ),
  new THREE.Vector3(target.x, target.h * 0.65, target.z),
];

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function animate() {
  const elapsed = clock.getElapsedTime();
  const t = reduced
    ? 1
    : Math.min(elapsed / duration, 1);

  const searchEnd = 0.78;
  const searchProgress = Math.min(t / searchEnd, 1);

  // Fast, changing-direction patrol.
  const segments = cameraPoints.length - 2;
  const scaled = searchProgress * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  const local = smoothstep(scaled - index);

  const patrolCamera = cameraPoints[index]
    .clone()
    .lerp(cameraPoints[index + 1], local);

  const patrolLook = lookPoints[index]
    .clone()
    .lerp(lookPoints[index + 1], local);

  if (t < searchEnd) {
    camera.position.copy(patrolCamera);
    camera.lookAt(patrolLook);
  } else {
    // Smoothly settle on the final target.
    const settle = smoothstep(
      Math.min((t - searchEnd) / 0.22, 1)
    );

    camera.position
      .copy(cameraPoints[cameraPoints.length - 2])
      .lerp(cameraPoints[cameraPoints.length - 1], settle);

    const finalLook = lookPoints[lookPoints.length - 2]
      .clone()
      .lerp(lookPoints[lookPoints.length - 1], settle);

    camera.lookAt(finalLook);
  }

  renderer.render(scene, camera);

  if (frame++ % 3 === 0) {
    const projected = targetPosition.clone().project(camera);

    if (elapsed < lockTime) {
      // Search reticle wanders around the screen.
      const x =
        50 +
        Math.sin(elapsed * 4.3) * 24 +
        Math.sin(elapsed * 8.1) * 7;

      const y =
        50 +
        Math.cos(elapsed * 3.2) * 18 +
        Math.sin(elapsed * 6.7) * 5;

      progress.current?.({
        progress: t,
        x,
        y,
      });
    } else {
      // Reticle locks onto the actual 3D building.
      progress.current?.({
        progress: t,
        x: (projected.x * 0.5 + 0.5) * 100,
        y: (-projected.y * 0.5 + 0.5) * 100,
      });
    }
  }

  raf = window.requestAnimationFrame(animate);
}

animate();

    const resize = new ResizeObserver(() => {
      const width = Math.max(el.clientWidth, 1);
      const height = Math.max(el.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resize.observe(el);
    return () => {
      window.cancelAnimationFrame(raf);
      resize.disconnect();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);
  return <div className="recon-city-canvas" ref={host} aria-hidden="true" />;
}
