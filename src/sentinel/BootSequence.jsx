import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const lines = [
  "ESTABLISHING SECURE CONNECTION...",
  "ROUTING THROUGH ENCRYPTED CHANNELS...",
  "AUTHENTICATING USER...",
  "VERIFYING SENTINEL CLEARANCE...",
  "ACCESS GRANTED.",
];

export default function BootSequence({ onComplete }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const lineTimer = window.setInterval(() => {
      setVisible((count) => Math.min(lines.length, count + 1));
    }, 430);
    const doneTimer = window.setTimeout(onComplete, 3300);
    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <motion.section
      className="flow-screen"
      exit={{ opacity: 0 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <div className="terminal-panel max-w-3xl">
        <p className="hud-label">Project Sentinel v1.0.7</p>
        <div className="mt-8 min-h-44 space-y-4 font-mono text-sm text-slate-300">
          {lines.slice(0, visible).map((line) => (
            <p key={line}>
              <span className="text-sentinel-cyan">&gt;</span> {line}
            </p>
          ))}
          <span className="cursor-block" />
        </div>
        <div className="progress-shell mt-8">
          <motion.span initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.8 }} />
        </div>
      </div>
    </motion.section>
  );
}
