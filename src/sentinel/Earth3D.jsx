import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const RADIUS = 1.35;

const LOCATIONS = [
  { name: "Minnesota", lat: 46.7296, lon: -94.6859, color: 0x00f5ff },
  { name: "California", lat: 36.7783, lon: -119.4179, color: 0x00f5ff },
  { name: "Arizona", lat: 34.0489, lon: -111.0937, color: 0x00f5ff },
  { name: "Odisha, India", lat: 20.9517, lon: 85.0985, color: 0xff55d4 },
];

const FEATURED_US = new Set([
  "arizona",
  "california",
  "minnesota",
]);

function getName(feature) {
  const p = feature?.properties || {};

  return String(
    p.name ||
    p.NAME ||
    p.NAME_1 ||
    p.ST_NM ||
    p.state ||
    p.State ||
    p.STATE_NAME ||
    p.shapeName ||
    p.NAME_EN ||
    p.NAME_LONG ||
    p.ADMIN ||
    p.admin ||
    "Unknown"
  );
}

function normalizeName(name) {
  return String(name).toLowerCase().trim();
}

function getPolygons(feature) {
  const geometry = feature?.geometry;

  if (!geometry) return [];

  if (geometry.type === "Polygon") {
    return [geometry.coordinates];
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates;
  }

  return [];
}

function latLonToVector(lat, lon, radius = RADIUS) {
  const latitude = THREE.MathUtils.degToRad(lat);
  const longitude = THREE.MathUtils.degToRad(lon);

  return new THREE.Vector3(
    radius * Math.cos(latitude) * Math.sin(longitude),
    radius * Math.sin(latitude),
    radius * Math.cos(latitude) * Math.cos(longitude)
  );
}

function createBoundary(ring, material) {
  if (!ring || ring.length < 2) return [];

  const segments = [];
  let points = [];
  const step = Math.max(1, Math.floor(ring.length / 1200));

  function finish() {
    if (points.length >= 2) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      segments.push(new THREE.Line(geometry, material));
    }
    points = [];
  }

  for (let i = 0; i < ring.length; i += step) {
    const [lon, lat] = ring[i];

    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;

    if (points.length) {
      const previous = points[points.length - 1];
      const next = latLonToVector(lat, lon, RADIUS + 0.008);

      // Avoid drawing a line across the globe at the date line.
      if (previous.distanceTo(next) > 0.35) {
        finish();
           earthGroup.rotation.y += 0.0014;
      }

      earthGroup.updateMatrixWorld(true);

      markers.forEach(({ anchor, dot, ring, index }) => {
        const position = new THREE.Vector3();
        anchor.getWorldPosition(position);

        anchor.visible =
          position.clone().normalize().dot(cameraDirection) >
          0.17;

        dot.scale.setScalar(
          1 + 0.25 * Math.sin(elapsed * 3 + index)
        );

        ring.scale.setScalar(
          1 + 0.3 * Math.sin(elapsed * 2.5 + index)
        );
      });

      renderer.render(scene, camera);

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();

      renderer.domElement.removeEventListener(
        "pointerdown",
        onPointerDown
      );

      renderer.domElement.removeEventListener(
        "pointermove",
        onPointerMove
      );

      renderer.domElement.removeEventListener(
        "pointerup",
        onPointerUp
      );

      renderer.domElement.removeEventListener(
        "pointercancel",
        onPointerCancel
      );

      scene.traverse((object) => {
        object.geometry?.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach((material) =>
            material.dispose()
          );
        } else {
          object.material?.dispose();
        }
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [world, view]);

  return (
    <div
      className="h-full w-full relative"
      aria-label="Interactive cyber globe and state maps"
    >
      {view === "earth" ? (
        <>
          <div
            ref={hostRef}
            className="h-full w-full"
          />

          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2"
            style={{ zIndex: 2 }}
          >
            <button
              type="button"
              onClick={() => setView("usa")}
              className="rounded border border-cyan-400/50 bg-slate-950/80 px-3 py-1 text-xs text-cyan-100 hover:bg-cyan-900"
            >
              USA MAP
            </button>

            <button
              type="button"
              onClick={() => setView("india")}
              className="rounded border border-cyan-400/50 bg-slate-950/80 px-3 py-1 text-xs text-cyan-100 hover:bg-cyan-900"
            >
              INDIA MAP
            </button>
          </div>
        </>
      ) : (
        <MapDetail
          key={view}
          region={view}
          data={states[view]}
          onBack={() => setView("earth")}
        />
      )}

      {error && (
        <div className="absolute top-2 left-2 right-2 text-xs text-red-300 bg-slate-950/90 p-2 rounded">
          Map data error: {error}
        </div>
      )}

      {!world && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-cyan-300 text-sm">
          LOADING GEOGRAPHIC DATA…
        </div>
      )}
    </div>
  );
}
