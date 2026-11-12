
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
      }

      points.push(next);
    } else {
      points.push(latLonToVector(lat, lon, RADIUS + 0.008));
    }
  }

  finish();
  return segments;
}

function addGrid(group) {
  const material = new THREE.LineBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.13,
    depthWrite: false,
  });

  // Latitude lines.
  for (let lat = -75; lat <= 75; lat += 15) {
    const points = [];

    for (let lon = -180; lon <= 180; lon += 3) {
      points.push(latLonToVector(lat, lon, RADIUS + 0.012));
    }

    group.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        material
      )
    );
  }

  // Longitude lines.
  for (let lon = -180; lon < 180; lon += 15) {
    const points = [];

    for (let lat = -90; lat <= 90; lat += 3) {
      points.push(latLonToVector(lat, lon, RADIUS + 0.012));
    }

    group.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        material
      )
    );
  }
}

function pointInRing(lon, lat, ring) {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersects =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

function pointInFeature(lon, lat, feature) {
  return getPolygons(feature).some((polygon) => {
    if (!polygon.length || !pointInRing(lon, lat, polygon[0])) {
      return false;
    }

    // Exclude holes.
    return !polygon
      .slice(1)
      .some((hole) => pointInRing(lon, lat, hole));
  });
}

function countryTarget(feature) {
  const p = feature.properties || {};
  const name = normalizeName(getName(feature));

  const code = String(
    p["ISO3166-1-Alpha-3"] ||
    p.ADM0_A3 ||
    p.ISO_A3 ||
    p.iso_a3 ||
    ""
  ).toUpperCase();

  if (
    code === "USA" ||
    name === "united states of america" ||
    name === "united states"
  ) {
    return "usa";
  }

  if (code === "IND" || name === "india") {
    return "india";
  }

  return null;
}

function getCoordinates(feature) {
  const coordinates = [];

  getPolygons(feature).forEach((polygon) => {
    polygon.forEach((ring) => {
      ring.forEach(([lon, lat]) => {
        if (Number.isFinite(lon) && Number.isFinite(lat)) {
          coordinates.push([lon, lat]);
        }
      });
    });
  });

  return coordinates;
}

function boundsFor(features) {
  const points = features.flatMap(getCoordinates);

  if (!points.length) return [-180, -90, 180, 90];

  const lons = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);

  return [
    Math.min(...lons),
    Math.min(...lats),
    Math.max(...lons),
    Math.max(...lats),
  ];
}

function svgPath(feature, project) {
  let path = "";

  getPolygons(feature).forEach((polygon) => {
    polygon.forEach((ring) => {
      ring.forEach(([lon, lat], index) => {
        const [x, y] = project(lon, lat);

        path += `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
      });

      path += "Z ";
    });
  });

  return path;
}

function MapDetail({ region, data, onBack }) {
  const [selected, setSelected] = useState(null);

  if (!data?.features?.length) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-cyan-200">
        <p>State boundaries are unavailable.</p>
        <button
          type="button"
          onClick={onBack}
          className="border border-cyan-400 rounded px-4 py-2"
        >
          RETURN TO EARTH
        </button>
      </div>
    );
  }

  const isUSA = region === "usa";

  const features = data.features.filter(
    (feature) => getPolygons(feature).length > 0
  );

  const alaska = features.filter(
    (feature) => normalizeName(getName(feature)) === "alaska"
  );

  const hawaii = features.filter(
    (feature) => normalizeName(getName(feature)) === "hawaii"
  );

  const mainFeatures = isUSA
    ? features.filter(
        (feature) =>
          !["alaska", "hawaii"].includes(normalizeName(getName(feature)))
      )
    : features;

  const width = 900;
  const height = 520;

  function createProjection(items, area) {
    const [minLon, minLat, maxLon, maxLat] = boundsFor(items);

    const lonRange = Math.max(maxLon - minLon, 0.001);
    const latRange = Math.max(maxLat - minLat, 0.001);

    const scale = Math.min(
      area.width / lonRange,
      area.height / latRange
    );

    const drawnWidth = lonRange * scale;
    const drawnHeight = latRange * scale;

    const offsetX = area.x + (area.width - drawnWidth) / 2;
    const offsetY = area.y + (area.height - drawnHeight) / 2;

    return (lon, lat) => [
      offsetX + (lon - minLon) * scale,
      offsetY + (maxLat - lat) * scale,
    ];
  }

  const mainProjection = createProjection(mainFeatures, {
    x: 35,
    y: 30,
    width: 830,
    height: 420,
  });

  const alaskaProjection = alaska.length
    ? createProjection(alaska, {
        x: 45,
        y: 385,
        width: 165,
        height: 105,
      })
    : null;

  const hawaiiProjection = hawaii.length
    ? createProjection(hawaii, {
        x: 220,
        y: 420,
        width: 120,
        height: 65,
      })
    : null;

  function renderFeature(feature, project) {
    const name = getName(feature);
    const normalized = normalizeName(name);

    const featured = isUSA
      ? FEATURED_US.has(normalized)
      : normalized === "odisha" || normalized === "orissa";

    const active = selected === name;

    return (
      <path
        key={`${region}-${name}`}
        d={svgPath(feature, project)}
        fill={
          active
            ? "#f472b6"
            : featured
              ? "#0e7490"
              : "#071a34"
        }
        stroke={active ? "#ffffff" : "#24caff"}
        strokeWidth={active ? 2.2 : 1.1}
        strokeLinejoin="round"
        fillRule="evenodd"
        className="cursor-pointer transition-colors duration-200 hover:fill-cyan-600"
        onClick={() => setSelected(name)}
      >
        <title>{name}</title>
      </path>
    );
  }

  return (
    <div className="h-full w-full relative flex flex-col bg-slate-950/70 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3 gap-3">
        <div>
          <div className="text-cyan-300 text-xs tracking-widest">
            GEOGRAPHIC INTELLIGENCE
          </div>
          <div className="text-white text-sm font-semibold">
            {isUSA ? "UNITED STATES" : "INDIA"} / STATE MAP
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="border border-cyan-400/60 text-cyan-200 rounded px-3 py-2 text-xs hover:bg-cyan-900/50"
        >
          RETURN TO EARTH
        </button>
      </div>

      <div className="flex-1 min-h-0 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${isUSA ? "United States" : "India"} interactive state map`}
        >
          {mainFeatures.map((feature) =>
            renderFeature(feature, mainProjection)
          )}

          {isUSA && alaskaProjection &&
            alaska.map((feature) =>
              renderFeature(feature, alaskaProjection)
            )}

          {isUSA && hawaiiProjection &&
            hawaii.map((feature) =>
              renderFeature(feature, hawaiiProjection)
            )}

          {isUSA && (
            <>
              <text x="90" y="505" fill="#67e8f9" fontSize="14">
                ALASKA
              </text>
              <text x="240" y="505" fill="#67e8f9" fontSize="14">
                HAWAII
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="text-center text-cyan-200 text-xs pb-3 px-3">
        {selected
          ? `SELECTED: ${selected.toUpperCase()}`
          : "SELECT A STATE TO VIEW ITS NAME"}
      </div>
    </div>
  );
}

export default function Earth3D() {
  const hostRef = useRef(null);

  const [world, setWorld] = useState(null);
  const [states, setStates] = useState({
    usa: null,
    india: null,
  });

  const [view, setView] = useState("earth");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMaps() {
      try {
        const paths = [
          "/geo/countries.geojson",
          "/geo/us-states.geojson",
          "/geo/Indian_States.geojson",
        ];

        const responses = await Promise.all(
          paths.map((path) => fetch(path))
        );

        for (let i = 0; i < responses.length; i++) {
          if (!responses[i].ok) {
            throw new Error(`Cannot load ${paths[i]}`);
          }
        }

        const [countries, usa, india] = await Promise.all(
          responses.map((response) => response.json())
        );

        for (const data of [countries, usa, india]) {
          if (
            data.type !== "FeatureCollection" ||
            !Array.isArray(data.features)
          ) {
            throw new Error("Invalid GeoJSON FeatureCollection");
          }
        }

        if (cancelled) return;

        setWorld(countries);
        setStates({ usa, india });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load map data");
        }
      }
    }

    loadMaps();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;

    if (!host || !world || view !== "earth") return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );

    camera.position.set(0, 0, 4.7);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.5)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.domElement.style.cssText =
      "display:block;width:100%;height:100%;cursor:grab;touch-action:none";

    host.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 72, 48),
      new THREE.MeshPhongMaterial({
        color: 0x06152b,
        emissive: 0x04162d,
        emissiveIntensity: 0.65,
        shininess: 50,
      })
    );

    earthGroup.add(globe);

    addGrid(earthGroup);

    const boundaryMaterial = new THREE.LineBasicMaterial({
      color: 0x20baff,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    });

    world.features.forEach((feature) => {
      getPolygons(feature).forEach((polygon) => {
        polygon.forEach((ring) => {
          createBoundary(ring, boundaryMaterial).forEach(
            (line) => earthGroup.add(line)
          );
        });
      });
    });

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.07, 64, 48),
      new THREE.MeshBasicMaterial({
        color: 0x168be4,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      })
    );

    earthGroup.add(atmosphere);

    scene.add(new THREE.AmbientLight(0x76baff, 1.8));

    const light = new THREE.DirectionalLight(0x83d8ff, 2);
    light.position.set(3, 3, 5);
    scene.add(light);

    const markers = LOCATIONS.map((place, index) => {
      const anchor = new THREE.Group();

      anchor.position.copy(
        latLonToVector(place.lat, place.lon, RADIUS + 0.025)
      );

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.032, 12, 12),
        new THREE.MeshBasicMaterial({
          color: place.color,
        })
      );

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.055, 0.073, 28),
        new THREE.MeshBasicMaterial({
          color: place.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        })
      );

      ring.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        anchor.position.clone().normalize()
      );

      anchor.add(dot, ring);
      earthGroup.add(anchor);

      return { anchor, dot, ring, index };
    });

    // Show North America initially with northern latitudes visible.
    earthGroup.rotation.set(-0.35, 1.75, 0);

    let dragging = false;
    let moved = false;

    let downX = 0;
    let downY = 0;
    let lastX = 0;
    let lastY = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onPointerDown(event) {
      dragging = true;
      moved = false;

      downX = lastX = event.clientX;
      downY = lastY = event.clientY;

      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    }

    function onPointerMove(event) {
      if (!dragging) return;

      if (
        Math.abs(event.clientX - downX) +
          Math.abs(event.clientY - downY) >
        7
      ) {
        moved = true;
      }

      earthGroup.rotation.y +=
        (event.clientX - lastX) * 0.005;

      earthGroup.rotation.x = THREE.MathUtils.clamp(
        earthGroup.rotation.x +
          (event.clientY - lastY) * 0.003,
        -0.85,
        0.85
      );

      lastX = event.clientX;
      lastY = event.clientY;
    }

    function onPointerUp(event) {
      if (!dragging) return;

      dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (moved) return;

      const rect =
        renderer.domElement.getBoundingClientRect();

      mouse.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      const hit = raycaster.intersectObject(globe, false)[0];

      if (!hit) return;

      const local = earthGroup
        .worldToLocal(hit.point.clone())
        .normalize();

      const lat = THREE.MathUtils.radToDeg(
        Math.asin(THREE.MathUtils.clamp(local.y, -1, 1))
      );

      const lon = THREE.MathUtils.radToDeg(
        Math.atan2(local.x, local.z)
      );

      const country = world.features.find(
        (feature) =>
          countryTarget(feature) &&
          pointInFeature(lon, lat, feature)
      );

      if (country) {
        setView(countryTarget(country));
      }
    }

    function onPointerCancel() {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    }

    renderer.domElement.addEventListener(
      "pointerdown",
      onPointerDown
    );

    renderer.domElement.addEventListener(
      "pointermove",
      onPointerMove
    );

    renderer.domElement.addEventListener(
      "pointerup",
      onPointerUp
    );

    renderer.domElement.addEventListener(
      "pointercancel",
      onPointerCancel
    );

    function resize() {
      const rect = host.getBoundingClientRect();

      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      renderer.setSize(width, height, false);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const clock = new THREE.Clock();
    const cameraDirection = camera.position.clone().normalize();

    let animationId = 0;

    function animate() {
      const elapsed = clock.getElapsedTime();

      if (!dragging) {
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
