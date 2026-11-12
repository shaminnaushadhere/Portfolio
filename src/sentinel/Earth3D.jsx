  useEffect(() => {
    const host = hostRef.current;
    if (!host || !world || view !== "earth") return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.7);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;cursor:grab;touch-action:none";
    host.appendChild(renderer.domElement);
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 72, 48), new THREE.MeshPhongMaterial({ color: 0x06152b, emissive: 0x04162d, emissiveIntensity: 0.65, shininess: 50 }));
    earthGroup.add(globe);
    makeGrid(earthGroup);
    const borders = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: 0x20baff, transparent: true, opacity: 0.82, depthWrite: false });
    world.features.forEach((feature) => polygons(feature).forEach((poly) => poly.forEach((ring) => {
      const line = lineFromRing(ring, lineMat);
      if (line) borders.add(line);
    })));
    earthGroup.add(borders);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(R * 1.07, 64, 48), new THREE.MeshBasicMaterial({ color: 0x168be4, side: THREE.BackSide, transparent: true, opacity: 0.12, depthWrite: false }));
    earthGroup.add(atmosphere);
    scene.add(new THREE.AmbientLight(0x76baff, 1.8));
    const light = new THREE.DirectionalLight(0x83d8ff, 2);
    light.position.set(3, 3, 5); scene.add(light);
    const markers = PLACES.map((place, index) => {
      const anchor = new THREE.Group();
      anchor.position.copy(globePoint(place.lat, place.lon, R + 0.018));
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), new THREE.MeshBasicMaterial({ color: place.color }));
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.055, 0.073, 28), new THREE.MeshBasicMaterial({ color: place.color, side: THREE.DoubleSide, transparent: true, opacity: 0.85, depthWrite: false }));
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), anchor.position.clone().normalize());
      anchor.add(dot, ring); earthGroup.add(anchor);
      return { anchor, dot, ring, index };
    });
    // Start with North America in front and northern latitudes tilted toward viewer.
    earthGroup.rotation.set(-0.35, 1.75, 0);
    let dragging = false, moved = false, downX = 0, downY = 0, lastX = 0, lastY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function down(e) { dragging = true; moved = false; downX = lastX = e.clientX; downY = lastY = e.clientY; renderer.domElement.setPointerCapture(e.pointerId); renderer.domElement.style.cursor = "grabbing"; }
    function move(e) {
      if (!dragging) return;
      if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 7) moved = true;
      earthGroup.rotation.y += (e.clientX - lastX) * 0.005;
      earthGroup.rotation.x = THREE.MathUtils.clamp(earthGroup.rotation.x + (e.clientY - lastY) * 0.003, -0.85, 0.85);
      lastX = e.clientX; lastY = e.clientY;
    }
    function up(e) {
      if (!dragging) return;
      dragging = false; renderer.domElement.style.cursor = "grab";
      if (moved) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(globe, false)[0];
      if (!hit) return;
      const local = earthGroup.worldToLocal(hit.point.clone()).normalize();
      const lat = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(local.y, -1, 1)));
      const lon = THREE.MathUtils.radToDeg(Math.atan2(local.x, local.z));
      const country = world.features.find((f) => targetCountry(f) && inFeature(lon, lat, f));
      if (country) setView(targetCountry(country));
    }
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", () => { dragging = false; });
    function resize() {
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    const observer = new ResizeObserver(resize); observer.observe(host);
    const clock = new THREE.Clock();
    let raf = 0;
    const cameraDir = camera.position.clone().normalize();
    function animate() {
      const elapsed = clock.getElapsedTime();
      if (!dragging) earthGroup.rotation.y += 0.0014;
      earthGroup.updateMatrixWorld(true);
      markers.forEach(({ anchor, dot, ring, index }) => {
        const pos = new THREE.Vector3(); anchor.getWorldPosition(pos);
        anchor.visible = pos.clone().normalize().dot(cameraDir) > 0.17;
        dot.scale.setScalar(1 + 0.25 * Math.sin(elapsed * 3 + index));
        ring.scale.setScalar(1 + 0.3 * Math.sin(elapsed * 2.5 + index));
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(raf); observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      scene.traverse((o) => { o.geometry?.dispose(); if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose()); else o.material?.dispose(); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [world, view]);

  return (
    <div className="h-full w-full relative" aria-label="Interactive cyber globe and state maps">
      {view === "earth" ? <>
        <div ref={hostRef} className="h-full w-full" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 2 }}>
          <button type="button" onClick={() => setView("usa")} className="rounded border border-cyan-400/50 bg-slate-950/80 px-3 py-1 text-xs text-cyan-100 hover:bg-cyan-900">USA MAP</button>
          <button type="button" onClick={() => setView("india")} className="rounded border border-cyan-400/50 bg-slate-950/80 px-3 py-1 text-xs text-cyan-100 hover:bg-cyan-900">INDIA MAP</button>
        </div>
      </> : <MapDetail key={view} region={view} data={states[view]} onBack={() => setView("earth")} />}
      {error && <div className="absolute top-2 left-2 right-2 text-xs text-red-300 bg-slate-950/90 p-2 rounded">Map data error: {error}</div>}
      {!world && !error && <div className="absolute inset-0 flex items-center justify-center text-cyan-300 text-sm">LOADING GEOGRAPHIC DATA…</div>}
    </div>
  );
}
