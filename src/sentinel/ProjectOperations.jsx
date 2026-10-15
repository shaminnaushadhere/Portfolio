
import { ExternalLink, FileText, Github } from "lucide-react";
import SectionHeader from "./SectionHeader.jsx";

const projects = [
  {
    name: "Operation ThreatLens",
    period: "2026",
    mission: "SOC Log Analysis & Threat Detection Platform",
    stack: "Flask / Python",
    availability: "live",
    features: ["IOC Extraction", "MITRE ATT&CK Mapping", "AbuseIPDB enrichment", "PDF reports", "CSV IOC export"],
  },
  {
    name: "Operation OpenSOC",
    period: "2026",
    mission: "SIEM Deployment, Threat Detection & Security Monitoring Lab",
    stack: "Wazuh / Linux / Windows / SIEM",
    availability: "pending",
    features: [
      "Wazuh SIEM deployment and configuration",
      "Centralized security log collection",
      "Endpoint security monitoring",
      "Security event and alert investigation",
      "Hands-on SOC monitoring workflows",
    ],
  },
];

export default function ProjectOperations() {
  return (
    <section className="sentinel-section" id="projects">
      <SectionHeader
        label="Operations"
        title="Project Operations"
        subtitle="Portfolio projects framed as security missions with practical deliverables."
      />
      <div className="alternating-timeline">
        {projects.map((project, index) => (
          <article className="operation-card timeline-card" key={project.name}>
            <div className="timeline-pin">{project.period}</div>
            <p className="hud-label">{project.stack}</p>
            <h3>{project.name}</h3>
            <p className="mt-3 text-slate-300">{project.mission}</p>
            <ul className="mt-6 space-y-2 font-mono text-sm text-slate-300">
              {project.features.map((feature) => <li key={feature}>+ {feature}</li>)}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              {project.availability === "live" && (
                <>
                  <a className="icon-link" href="https://github.com/shaminnaushad" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
                  <button className="icon-link"><ExternalLink size={16} /> Demo</button>
                </>
              )}
              {project.availability === "pending" && <span className="availability-note">GitHub and demo to be available</span>}
              <button className="icon-link"><FileText size={16} /> Report</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
