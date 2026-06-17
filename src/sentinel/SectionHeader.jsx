import { motion } from "framer-motion";

export default function SectionHeader({ label, title, subtitle }) {
  return (
    <motion.div
      className="section-header"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55 }}
    >
      <p className="hud-label">{label}</p>
      <h2>{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
    </motion.div>
  );
}
