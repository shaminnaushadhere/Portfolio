import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";

const Earth3D = lazy(() => import("./Earth3D.jsx"));

const logs = [
  "Searching academic records...",
  "Scanning continental records...",
  "MATCH FOUND: NORTH AMERICA",
  "Country lock: United States",
  "State lock: Arizona",
  "City lock: Tempe / Arizona State University",
  "Analyst profile located.",
];

export default function GlobalScan({ onComplete }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible((count) => Math.min(logs.length, count + 1));
    }, 620);
    const done = window.setTimeout(onComplete, 4300);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <section className="flow-screen px-5">
      <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[440px] min-h-[360px]">
          <Suspense fallback={<div className="terminal-panel h-full" />}>
            <Earth3D />
          </Suspense>
        </div>
        <motion.div className="terminal-panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
          <p className="hud-label">Global Scan</p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase">North America lock active</h2>
          <div className="mt-8 space-y-4 font-mono text-sm text-slate-300">
            {logs.slice(0, visible).map((log) => (
              <p key={log}>
                <span className="text-sentinel-cyan">&gt;</span> {log}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
