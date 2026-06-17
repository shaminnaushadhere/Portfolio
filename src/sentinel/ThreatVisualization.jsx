import { useState } from "react";
import { AlertTriangle, Eye, FileText, Focus, Radar, ScanSearch, Shield } from "lucide-react";
import SectionHeader from "./SectionHeader.jsx";

const stages = [
  ["Reconnaissance", "Target identification and passive information gathering.", Radar],
  ["Enumeration", "Services, endpoints, and exposed systems are mapped for risk review.", ScanSearch],
  ["Exploitation", "Potential weakness is tested in a controlled simulation path.", Focus],
  ["Persistence", "Access patterns are evaluated for long-term attacker behavior.", AlertTriangle],
  ["Detection", "Suspicious behavior is flagged for SOC review.", Eye],
  ["Response", "Containment, blocking, and remediation actions are applied.", Shield],
  ["Reporting", "Evidence is exported into a readable analyst report.", FileText],
];

export default function ThreatVisualization() {
  const [active, setActive] = useState(0);

  return (
    <section className="sentinel-section" id="threat">
      <SectionHeader
        label="Simulation"
        title="Threat Visualization"
        subtitle="Simulated attack chain lifecycle - from reconnaissance to response."
      />
      <article className="threat-chain">
        <div className="threat-stage-row">
          {stages.map(([name, , Icon], index) => (
            <button className={active === index ? "active" : ""} key={name} onClick={() => setActive(index)}>
              <i><Icon size={24} /></i>
              <span>Stage {index + 1}</span>
            </button>
          ))}
        </div>
        <div className="threat-stage-detail">
          <p className="hud-label">Stage {active + 1} of {stages.length}</p>
          <h3 className="mt-3 font-display text-4xl font-bold uppercase">{stages[active][0]}</h3>
          <p className="mt-4 max-w-2xl text-slate-300">{stages[active][1]}</p>
          <div className="progress-shell mt-8"><span style={{ width: `${((active + 1) / stages.length) * 100}%` }} /></div>
        </div>
      </article>
    </section>
  );
}
