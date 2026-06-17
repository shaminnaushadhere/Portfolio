import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Earth3D() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    host.appendChild(renderer.domElement);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.22 })
    );
    scene.add(globe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.52, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.08, side: THREE.BackSide })
    );
    scene.add(atmosphere);

    const satellites = new THREE.Group();
    for (let i = 0; i < 4; i += 1) {
      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffb000 })
      );
      sat.userData.phase = i * 1.55;
      satellites.add(sat);
    }
    scene.add(satellites);

    const nodes = [
      [-0.74, 0.35, 0.92],
      [0.2, -0.45, 1.08],
      [0.86, 0.08, 0.72],
      [-0.15, 0.8, 0.72],
    ].map(([x, y, z]) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x00f5ff })
      );
      node.position.set(x, y, z);
      globe.add(node);
      return node;
    });

    let frame = 0;
    let animationId = 0;

    function resize() {
      const rect = host.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
      camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
      camera.updateProjectionMatrix();
    }

    function animate() {
      frame += 0.01;
      globe.rotation.y += 0.004;
      globe.rotation.x = Math.sin(frame * 0.4) * 0.08;
      atmosphere.rotation.y -= 0.002;
      satellites.children.forEach((sat) => {
        const t = frame + sat.userData.phase;
        sat.position.set(Math.cos(t) * 2.05, Math.sin(t * 0.7) * 0.72, Math.sin(t) * 1.3);
      });
      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(frame * 4 + index) * 0.25);
      });
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      scene.traverse((item) => {
        item.geometry?.dispose();
        if (Array.isArray(item.material)) item.material.forEach((material) => material.dispose());
        else item.material?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="h-full w-full" aria-label="3D rotating Sentinel globe" />;
}
