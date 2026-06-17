import { lazy, Suspense } from "react";
import SectionHeader from "./SectionHeader.jsx";

const Earth3D = lazy(() => import("./Earth3D.jsx"));

export default function GlobalFootprint() {
  return (
    <section className="sentinel-section" id="footprint">
      <SectionHeader
        label="Footprint"
        title="Global Footprint"
        subtitle="Origin stays in India while the current operational focus highlights country, state, and city."
      />
      <div className="footprint-classic">
        <article className="sentinel-card footprint-visual">
          <div className="footprint-head">
            <p className="hud-label">Coords: 12.9716 N, 77.5946 E</p>
            <span>Threat: Moderate</span>
          </div>
          <div className="earth-stage">
            <Suspense fallback={null}>
              <Earth3D />
            </Suspense>
          </div>
          <svg className="attack-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M17 68 C34 33, 57 30, 80 47" />
            <path d="M20 35 C43 64, 63 70, 83 29" />
          </svg>
          <div className="orbit-stats">
            <span>Real-time orbital view</span>
          </div>
        </article>
        <div className="location-stack">
          {[
            ["India", "Origin Point", "12.97 N 77.59 E", "Foundation in technology and problem-solving."],
            ["United States", "Current Country", "North America", "Primary academic and professional development base."],
            ["Arizona", "Current State", "33.42 N 111.93 W", "Cybersecurity learning, portfolio building, and SOC analyst preparation."],
            ["Tempe", "Current City", "Arizona State University", "Computer Science and security operations focus."],
            ["Global", "Digital Presence", "Distributed", "SOC labs, cybersecurity projects, and open-source contributions."],
          ].map(([title, label, coords, copy]) => (
            <article className="location-card-classic" key={title}>
              <small>{coords}</small>
              <p className="hud-label">{title}</p>
              <span>{label}</span>
              <p className="mt-3 text-slate-300">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
