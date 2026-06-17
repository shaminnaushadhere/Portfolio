import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function DossierReveal({ onOpen }) {
  const [photoLoaded, setPhotoLoaded] = useState(true);

  return (
    <section className="flow-screen px-5">
      <motion.article
        className="dossier-card"
        initial={{ opacity: 0, rotateX: 18, y: 30 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="hud-label">Sentinel Analyst File</p>
        <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center">
          <div className="profile-mark">
            {photoLoaded && <img src="/profile.png" alt="Shamin Naushad" onError={() => setPhotoLoaded(false)} />}
            {!photoLoaded && <span>SN</span>}
          </div>
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.32em] text-sentinel-amber">Subject Identified</p>
            <h1 className="mt-3 font-display text-5xl font-black uppercase md:text-7xl">Shamin Naushad</h1>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            ["Classification", "Cybersecurity Analyst"],
            ["Status", "Active"],
            ["Location", "Arizona State University"],
            ["Mission", "Threat Detection & Security Operations"],
          ].map(([label, value]) => (
            <div className="intel-cell" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <button className="sentinel-button mt-10 w-full" onClick={onOpen}>
          <ShieldCheck size={18} />
          Open Dossier
        </button>
      </motion.article>
    </section>
  );
}
