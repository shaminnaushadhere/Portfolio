import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Radio, ScanFace } from "lucide-react";
import SectionHeader from "./SectionHeader.jsx";

const panels = {
  biometric: {
    icon: Fingerprint,
    title: "Biometric Scan",
    facts: [
      ["Role", "Computer Science Student"],
      ["Specialization", "Cybersecurity"],
      ["Institution", "Arizona State University"],
      ["Focus", "SOC Operations"],
    ],
    copy: "Shamin focuses on threat detection, incident analysis, secure coding, log review, and practical security automation.",
  },
  profile: {
    icon: ScanFace,
    title: "Operational Profile",
    facts: [
      ["Training", "HTB / TryHackMe / CyberDefenders"],
      ["Certificate", "Google Foundations of Cybersecurity"],
      ["Target", "SOC Analyst"],
      ["Style", "Evidence-driven investigation"],
    ],
    copy: "The profile emphasizes disciplined analysis: collect signals, verify indicators, map behavior, and communicate findings clearly.",
  },
  voice: {
    icon: Radio,
    title: "Voiceprint Match",
    facts: [
      ["Tools", "Wireshark / Nmap / Burp Suite"],
      ["Cloud", "AWS EC2"],
      ["Languages", "Python / JavaScript / Java"],
      ["Systems", "Linux"],
    ],
    copy: "Hands-on work spans web application security, Flask tooling, monitoring concepts, and simulated SOC workflows.",
  },
};

export default function DigitalIdentity() {
  const [active, setActive] = useState("biometric");
  const [photoLoaded, setPhotoLoaded] = useState(true);
  const data = panels[active];
  const Icon = data.icon;

  return (
    <section className="sentinel-section" id="identity">
      <SectionHeader
        label="Identity"
        title="Digital Identity"
        subtitle="Verified analyst profile for Shamin Naushad."
      />
      <div className="grid gap-6 lg:grid-cols-[500px_1fr]">
        <div className="grid content-start gap-4">
          <article className="profile-card">
            {photoLoaded && (
              <img
                src="/profile.png"
                alt="Shamin Naushad"
                onError={() => setPhotoLoaded(false)}
              />
            )}
            {!photoLoaded && <div className="profile-fallback">SN</div>}
            <div className="profile-copy">
              <p className="hud-label">Subject Photo</p>
              <h3>Shamin Naushad</h3>
              <span>Cybersecurity Analyst Track</span>
            </div>
            <aside className="profile-quote-wrap">
              <blockquote className="analyst-quote">
                In every signal, there is a story. In every anomaly, a direction.
              </blockquote>
            </aside>
          </article>
          {Object.entries(panels).map(([key, item]) => {
            const ItemIcon = item.icon;
            return (
              <button key={key} className={`scan-choice ${active === key ? "active" : ""}`} onClick={() => setActive(key)}>
                <ItemIcon />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
        <motion.article
          key={active}
          className="sentinel-card p-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {active === "biometric" ? (
            <div className="biometric-visual" aria-hidden="true">
              <div className="bio-orb">
                <Fingerprint size={116} />
                <span className="bio-scan-line" />
              </div>
              <div className="bio-status">
                <span>Live biometric sweep</span>
                <b>Match confidence 98.7%</b>
              </div>
            </div>
          ) : (
            <Icon className="text-sentinel-cyan" size={42} />
          )}
          <h3 className="mt-5 font-display text-3xl font-bold uppercase">{data.title}</h3>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {data.facts.map(([label, value]) => (
              <div className="intel-cell" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <p className="mt-7 font-mono leading-7 text-slate-300">{data.copy}</p>
        </motion.article>
      </div>
    </section>
  );
}
