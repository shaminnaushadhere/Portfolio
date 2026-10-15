
import { ExternalLink, FileText, Github } from "lucide-react";
import SectionHeader from "./SectionHeader.jsx";

const projects = [
  {
    name: "Operation ThreatLens",
    period: "2026",
    mission: "SOC Log Analysis & Threat Detection Platform",
    status: "MISSION ACCOMPLISHED",
    stack: "Flask / Python",
    availability: "live",
    github: "https://github.com/shaminnaushad",
    features: [
      "IOC Extraction",
      "MITRE ATT&CK Mapping",
      "AbuseIPDB enrichment",
      "PDF reports",
      "CSV IOC export",
    ],
  },
  {
    name: "Operation OpenSOC",
    period: "2026",
    mission: "OpenSOC SIEM Lab",
    status: "MISSION ACCOMPLISHED",
    stack: "Wazuh / Ubuntu WSL2 / Windows 11 / SIEM",
    availability: "live",
    github: "https://github.com/shaminnaushadhere/OpenSOC-Lab",
    features: [
      "Deployed Wazuh manager, indexer, Filebeat, and dashboard",
      "Connected and monitored a Windows 11 endpoint",
      "Verified centralized security event collection",
      "Analyzed endpoint security telemetry",
      "Practiced SOC monitoring workflows",
    ],
  },
];

export default function ProjectOperations() {
  return (
    <section className="sentinel-section" id="projects">
      <SectionHeader
        label="Operations"
        title="Mission Timeline"
        subtitle="Completed cybersecurity operations and practical security projects."
      />

      <div className="alternating-timeline">
        {projects.map((project) => (
          <article
            className="operation-card timeline-card"
            key={project.name}
          >
            <div className="timeline-pin">
              {project.period}
            </div>

            <p className="hud-label">
              {project.stack}
            </p>

            <h3>{project.name}</h3>

            <p className="mt-3 text-sentinel-amber font-mono text-xs tracking-widest">
              {project.status}
            </p>

            <p className="mt-3 text-slate-300">
              {project.mission}
            </p>

            <ul className="mt-6 space-y-2 font-mono text-sm text-slate-300">
              {project.features.map((feature) => (
                <li key={feature}>
                  + {feature}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              {project.availability === "live" && (
                <>
                  <a
                    className="icon-link"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={16} />
                    GitHub
                  </a>

                  <button className="icon-link">
                    <ExternalLink size={16} />
                    Demo
                  </button>
                </>
              )}

              {project.availability === "pending" && (
                <span className="availability-note">
                  GitHub and demo to be available
                </span>
              )}

              <button className="icon-link">
                <FileText size={16} />
                Report
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
