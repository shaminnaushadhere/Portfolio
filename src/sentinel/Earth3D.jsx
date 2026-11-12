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
