
import { useEffect, useRef } from "react";
import * as THREE from "three";

const LOCATIONS = [
  { name: "Minnesota", lat: 46.7296, lon: -94.6859, color: 0x00f5ff },
  { name: "California", lat: 36.7783, lon: -119.4179, color: 0x00f5ff },
  { name: "Arizona", lat: 34.0489, lon: -111.0937, color: 0x00f5ff },
  { name: "Odisha, India", lat: 20.9517, lon: 85.0985, color: 0xff55d4 },
];

const RADIUS = 1.35;

function latLonToVector(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function Earth3D() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.7;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Earth texture with real continent geography.
    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    );

    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 96, 64),
      new THREE.MeshPhongMaterial({
        map: earthTexture,
        color: 0x77dfff,
        emissive: 0x072b4a,
        emissiveIntensity: 0.35,
        shininess: 25,
      })
    );

    earthGroup.add(earth);

    // Digital latitude/longitude grid.
    const grid = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS + 0.008, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00eaff,
        wireframe: true,
        transparent: true,
        opacity: 0.075,
        depthWrite: false,
      })
    );

    earthGroup.add(grid);

    // Outer atmospheric glow.
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.08, 64, 48),
      new THREE.MeshBasicMaterial({
        color: 0x8a45ff,
        transparent: true,
        opacity: 0.075,
        side: THREE.BackSide,
        depthWrite: false,
      })
    );

    earthGroup.add(atmosphere);

    // Lighting.
    scene.add(new THREE.AmbientLight(0x6abfff, 1.4));

    const sunlight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunlight.position.set(4, 2, 5);
    scene.add(sunlight);

    const purpleLight = new THREE.PointLight(0xff33dd, 12);
    purpleLight.position.set(-3, -1, 2);
    scene.add(purpleLight);

    // Geographic markers.
    const markers = [];

    LOCATIONS.forEach((location) => {
      const position = latLonToVector(
        location.lat,
        location.lon,
        RADIUS + 0.025
      );

      const markerGroup = new THREE.Group();
      markerGroup.position.copy(position);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 16, 16),
        new THREE.MeshBasicMaterial({
          color: location.color,
        })
      );

      markerGroup.add(core);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.055, 0.075, 32),
        new THREE.MeshBasicMaterial({
          color: location.color,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );

      ring.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        position.clone().normalize()
      );

      markerGroup.add(ring);

      earthGroup.add(markerGroup);

      markers.push({
        group: markerGroup,
        core,
        ring,
        location,
      });
    });

    // Mouse-controlled rotation.
    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    function onPointerDown(event) {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event) {
      if (!dragging) return;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;

      earthGroup.rotation.y += dx * 0.005;
      earthGroup.rotation.x = THREE.MathUtils.clamp(
        earthGroup.rotation.x + dy * 0.003,
        -0.5,
        0.5
      );

      previousX = event.clientX;
      previousY = event.clientY;
    }

    function onPointerUp() {
      dragging = false;
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "pan-y";

    const clock = new THREE.Clock();
    let animationId;

    function resize() {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function animate() {
      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.05);

      if (!dragging) {
        earthGroup.rotation.y += 0.004;
      }

      markers.forEach((marker, index) => {
        const pulse = 1 + Math.sin(elapsed * 3 + index) * 0.25;

        marker.core.scale.setScalar(pulse);
        marker.ring.scale.setScalar(
          1 + Math.sin(elapsed * 2.5 + index) * 0.2
        );

        // Keep the marker visible only on the near side.
        const worldPosition = new THREE.Vector3();
        marker.group.getWorldPosition(worldPosition);

        const facingCamera =
          worldPosition.dot(camera.position) > RADIUS * RADIUS;

        marker.group.visible = facingCamera;
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();

      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);

      scene.traverse((object) => {
        object.geometry?.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material?.dispose();
        }
      });

      earthTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="h-full w-full"
      aria-label="Interactive rotating Earth with location markers for Minnesota, California, Arizona, and Odisha"
    />
  );
}
