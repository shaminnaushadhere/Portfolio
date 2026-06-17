import { BriefcaseBusiness, Server, Wrench } from "lucide-react";
import SectionHeader from "./SectionHeader.jsx";

const experiences = [
  {
    date: "2025",
    icon: BriefcaseBusiness,
    title: "ASU Technology Consultant",
    type: "Experience",
    copy: "Provided hands-on technical support in a university environment, helping users troubleshoot systems, access issues, connectivity problems, and service requests.",
    details: ["User support", "Troubleshooting", "Service reliability", "Technical communication"],
  },
  {
    date: "2024",
    icon: Wrench,
    title: "Application Security Internship",
    type: "Experience",
    copy: "Worked on secure application concepts including authentication, API hardening, RBAC, logging, and OWASP-focused review workflows.",
    details: ["OAuth / JWT", "RBAC", "API security", "Burp Suite"],
  },
  {
    date: "2025",
    icon: Server,
    title: "Campus Network Security Audit",
    type: "Experience",
    copy: "Practiced infrastructure review using AWS EC2, vulnerability assessment concepts, and operational documentation for network-facing services.",
    details: ["AWS EC2", "Vulnerability review", "Network services", "Documentation"],
  },
];

export default function ExperienceTimeline() {
  return (
    <section className="sentinel-section" id="experience">
      <SectionHeader
        label="Experience"
        title="Field Experience"
        subtitle="Hands-on technical and security work separated from achievements."
      />
      <div className="alternating-timeline achievement-line">
        {experiences.map((item) => {
          const Icon = item.icon;
          return (
            <article className="operation-card timeline-card achievement-card" key={item.title}>
              <div className="timeline-pin">{item.date}</div>
              <Icon className="text-sentinel-cyan" size={34} />
              <p className="hud-label mt-4">{item.type}</p>
              <h3>{item.title}</h3>
              <p className="mt-3 text-slate-300">{item.copy}</p>
              <ul className="mt-5 space-y-2 font-mono text-sm text-slate-300">
                {item.details.map((detail) => <li key={detail}>+ {detail}</li>)}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
