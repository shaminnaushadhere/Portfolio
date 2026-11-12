import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import "./GlobalScan.css";

const DURATION = 4400;
const events = [
  { at: 0, text: "SATELLITE UPLINK ESTABLISHED" },
  { at: 850, text: "GEOINT STREAM SYNCHRONIZED" },
  { at: 1750, text: "REGION: NORTH AMERICA / ARIZONA" },
  { at: 2650, text: "TARGET ACQUIRED: TEMPE / ASU" },
  { at: 3450, text: "SURVEILLANCE VERIFIED" },
];

export default function GlobalScan({ onComplete }) {
  const reducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }
    const start = performance.now();
    const interval = window.setInterval(() => {
      setElapsed(Math.min(DURATION, performance.now() - start));
    }, 50);
    const finish = window.setTimeout(onComplete, DURATION);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(finish);
    };
  }, [onComplete, reducedMotion]);

  const acquired = elapsed >= 2650;
  const verified = elapsed >= 3450;
  const progress = Math.min(100, (elapsed / DURATION) * 100);

  return (
    <section className="sentinel-surveillance" aria-label="Satellite surveillance sequence">
      <img
        className="sentinel-surveillance__preload"
        src="/surveillance-city.jpg"
        alt=""
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
      />
      <div className={`sentinel-surveillance__scene ${imageLoaded ? "has-image" : ""}`} aria-hidden="true" />
      <div className="sentinel-surveillance__vignette" aria-hidden="true" />
      <div className="sentinel-surveillance__grain" aria-hidden="true" />
      <div className="sentinel-surveillance__sweep" aria-hidden="true" />

      <header className="sentinel-surveillance__header">
        <div><span className="sentinel-surveillance__eyebrow">PROJECT SENTINEL // GEOINT</span><strong>ORBITAL RECONNAISSANCE</strong></div>
        <div className="sentinel-surveillance__right"><span className="sentinel-surveillance__live">● LIVE FEED</span><span>CAM 07 / NIGHT VISION OFF</span></div>
      </header>

      <div className={`sentinel-surveillance__reticle ${acquired ? "is-locked" : ""}`} aria-hidden="true">
        <span className="sentinel-surveillance__corner tl" /><span className="sentinel-surveillance__corner tr" />
        <span className="sentinel-surveillance__corner bl" /><span className="sentinel-surveillance__corner br" />
        <span className="sentinel-surveillance__crosshair">+</span>
        {acquired && <span className="sentinel-surveillance__target-label">TARGET LOCK // 33.4255° N</span>}
      </div>

      <div className="sentinel-surveillance__coordinates" aria-hidden="true">
        <span>LAT 33.4255° N</span><span>LON 111.9400° W</span><span>ALT 12,480 M</span>
      </div>

      <div className="sentinel-surveillance__bottom">
        <div className="sentinel-surveillance__log" aria-live="polite">
          {events.filter((item) => elapsed >= item.at).slice(-3).map((item) => <p key={item.at}><span>›</span> {item.text}</p>)}
        </div>
        <AnimatePresence mode="wait">
          {verified ? (
            <motion.div key="verified" className="sentinel-surveillance__status is-verified" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <small>INTELLIGENCE CONFIRMED</small><strong>ACCESS AUTHORIZED</strong>
            </motion.div>
          ) : (
            <motion.div key="scanning" className="sentinel-surveillance__status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <small>{acquired ? "TRACKING STABLE" : "SCANNING AREA"}</small><strong>{acquired ? "TARGET ACQUIRED" : "SEARCHING..."}</strong>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="sentinel-surveillance__progress"><span style={{ width: `${progress}%` }} /></div>
      </div>
      <button className="sentinel-surveillance__skip" type="button" onClick={onComplete}>SKIP INTRO ↗</button>
    </section>
  );
}
