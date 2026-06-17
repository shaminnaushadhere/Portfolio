import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const subject = "SHAMIN NAUSHAD";

export default function GlobalSearch({ onInitiate }) {
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!started) return undefined;
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setValue(subject.slice(0, index));
      if (index >= subject.length) {
        window.clearInterval(timer);
        window.setTimeout(onInitiate, 620);
      }
    }, 82);
    return () => window.clearInterval(timer);
  }, [started, onInitiate]);

  return (
    <section className="flow-screen px-5 text-center">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
        <p className="hud-label">Global Intelligence Database</p>
        <h1 className="mt-5 font-display text-5xl font-black uppercase leading-none tracking-wide md:text-7xl">
          Analyst Locator
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-mono text-sm uppercase tracking-[0.24em] text-slate-400">
          Secure session / Local simulation / Recruiter dossier
        </p>
        <div className="mx-auto mt-12 grid max-w-2xl gap-5">
          <label className="search-field">
            <Search size={22} />
            <input readOnly value={value} placeholder="Awaiting investigation command" />
          </label>
          <button className="sentinel-button" onClick={() => setStarted(true)} disabled={started}>
            Initiate Investigation
          </button>
        </div>
      </motion.div>
    </section>
  );
}
