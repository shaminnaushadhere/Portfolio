import { useEffect, useState } from "react";
import { Fingerprint } from "lucide-react";

export default function BiometricScanner({ onComplete }) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!scanning) return undefined;
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const stutter = Math.random() > 0.78 ? 1 : 7;
        const next = Math.min(100, current + stutter);
        if (next === 100) {
          window.clearInterval(timer);
          window.setTimeout(onComplete, 650);
        }
        return next;
      });
    }, 90);
    return () => window.clearInterval(timer);
  }, [scanning, onComplete]);

  const status = progress === 100 ? "BIOMETRIC MATCH CONFIRMED" : scanning ? "SCANNING FINGERPRINT..." : "AWAITING BIOMETRIC INPUT";

  return (
    <section className="flow-screen px-5 text-center">
      <div className="terminal-panel w-full max-w-xl">
        <p className="hud-label">Biometric Authentication</p>
        <button className={`fingerprint-pad mt-10 ${scanning ? "is-scanning" : ""}`} onClick={() => setScanning(true)}>
          <Fingerprint size={112} />
        </button>
        <h1 className="mt-8 font-display text-3xl font-bold uppercase">{status}</h1>
        <div className="progress-shell mt-8">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-4 font-mono text-sm text-slate-400">{progress}% verified</p>
      </div>
    </section>
  );
}
