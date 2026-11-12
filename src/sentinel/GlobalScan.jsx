import { useCallback, useEffect, useRef, useState } from "react";
import ProceduralCity from "./ProceduralCity.jsx";
import "./GlobalScan.css";

const DURATION = 5000;

export default function GlobalScan({ onComplete }) {
  const [status, setStatus] = useState(0);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const finished = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const id = window.setTimeout(finish, 350);
      return () => window.clearTimeout(id);
    }
    const statusTimers = [650, 3700, 4200].map((delay, index) =>
      window.setTimeout(() => setStatus(index + 1), delay)
    );
    const done = window.setTimeout(finish, DURATION);
    return () => {
      statusTimers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [finish]);

  const updateTarget = useCallback(({ x, y }) => {
    setTarget({ x: Math.max(8, Math.min(92, x)), y: Math.max(12, Math.min(88, y)) });
  }, []);

  return (
    <section className="recon-screen" aria-label="Project Sentinel orbital reconnaissance">
      <ProceduralCity onProgress={updateTarget} />
      <div className="recon-vignette" aria-hidden="true" />
      <div className="recon-scanlines" aria-hidden="true" />
      <header className="recon-top">
        <div><small>PROJECT SENTINEL // GEOINT</small><h2>ORBITAL RECONNAISSANCE</h2></div>
        <div className="recon-top-right"><small><span className="recon-live" /> LIVE FEED</small><span>CAM 07 / SYNTHETIC NIGHT VIEW</span></div>
      </header>
      <div className="recon-coords" aria-hidden="true">
        <span>REGION / ARIZONA</span><span>SECTOR / TEMPE</span><span>MODE / 3D RECON</span><span>DATA / SIMULATED</span>
      </div>
      <div className={`recon-lock ${status >= 2 ? "is-locked" : ""}`} style={{ left: `${target.x}%`, top: `${target.y}%` }} aria-hidden="true">
        <i className="recon-corner tl"/><i className="recon-corner tr"/><i className="recon-corner bl"/><i className="recon-corner br"/>
        <span className="recon-cross">+</span>
        {status >= 2 && <b>TARGET ACQUIRED</b>}
      </div>
      <footer className="recon-bottom">
        <div className="recon-events">
          <span>› SATELLITE UPLINK ESTABLISHED</span>
          {status >= 1 && <span>› URBAN GEOMETRY MAPPED</span>}
          {status >= 2 && <span>› TARGET LOCK / TEMPE, AZ</span>}
          {status >= 3 && <span>› ANALYST PROFILE LOCATED</span>}
        </div>
        <div className="recon-state"><small>{status >= 3 ? "RECON COMPLETE" : status >= 2 ? "LOCK CONFIRMED" : "SCANNING AREA"}</small><strong>{status >= 3 ? "IDENTIFIED" : status >= 2 ? "TRACKING" : "SEARCHING..."}</strong></div>
        <div className="recon-progress"><div /></div>
        <button className="recon-skip" type="button" onClick={finish} aria-label="Skip surveillance animation">SKIP INTRO ↗</button>
      </footer>
    </section>
  );
}
