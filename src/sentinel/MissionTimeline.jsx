
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";

const entries = [
  { title: "Entered Computer Science", status: "Accomplished" },
  { title: "Discovered Cybersecurity", status: "Accomplished" },
  { title: "Google Foundations of Cybersecurity Certificate", status: "Accomplished" },
  { title: "HTB / TryHackMe / CyberDefenders Labs", status: "Active" },
  { title: "Operation ThreatLens", status: "Accomplished" },
  { title: "Operation OpenSOC", status: "Accomplished" },
  { title: "Operation PhantomNet", status: "Active" },
  { title: "Security+", status: "Active - In Progress" },
];

export default function MissionTimeline() {
  return (
    <section className="sentinel-section" id="timeline">
      <SectionHeader
        label="Timeline"
        title="Mission Timeline"
        subtitle="A chronological view of training, projects, and current security focus."
      />

      <div className="timeline mission-zigzag">
        {entries.map((entry, index) => (
          <motion.article
            className="timeline-item"
            key={entry.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -72 : 72 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.58, ease: "easeOut" }}
          >
            <div className="mission-meta">
              <span>
                Mission {String(index + 1).padStart(2, "0")}
              </span>

              <b
                className={
                  entry.status.startsWith("Active")
                    ? "active"
                    : "accomplished"
                }
              >
                {entry.status}
              </b>
            </div>

            <h3>{entry.title}</h3>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
