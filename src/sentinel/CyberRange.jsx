import { useState } from "react";
import SectionHeader from "./SectionHeader.jsx";

const labs = [
  {
    title: "Web Shell Investigation",
    platform: "CyberDefenders",
    tools: "Linux logs, web artifacts, timeline review",
    objective: "Trace suspicious server-side execution and identify how the shell activity appeared in logs.",
    lesson: "Learned to connect file changes, command execution evidence, and web access patterns into one incident narrative.",
  },
  {
    title: "XSS",
    platform: "HTB",
    tools: "Browser testing, Burp Suite, request inspection",
    objective: "Review how unsafe input handling can reflect executable payloads back to a user session.",
    lesson: "Practiced validating input points, observing payload behavior, and thinking through output encoding defenses.",
  },
  {
    title: "CSRF",
    platform: "HTB",
    tools: "Browser testing, session/request analysis",
    objective: "Understand how trusted sessions can be abused when state-changing requests lack proper protection.",
    lesson: "Learned why tokens, SameSite cookies, and careful request validation matter in application security.",
  },
  {
    title: "SQL Injection",
    platform: "HTB",
    tools: "Burp Suite, SQL basics, payload testing",
    objective: "Identify unsafe query behavior and test how crafted input can alter backend database logic.",
    lesson: "Reinforced parameterized queries, input validation, and severity thinking for data exposure risks.",
  },
  {
    title: "MITM",
    platform: "Lab",
    tools: "Wireshark, packet review, protocol inspection",
    objective: "Inspect traffic behavior and understand where weak trust assumptions can expose sensitive exchanges.",
    lesson: "Built confidence reading packet flows, spotting anomalies, and explaining network-level risk clearly.",
  },
  {
    title: "Padding Oracle",
    platform: "HTB",
    tools: "Lab environment, request/response comparison",
    objective: "Explore how cryptographic implementation details can leak information through response differences.",
    lesson: "Learned to treat crypto errors carefully and separate secure design from fragile implementation behavior.",
  },
  {
    title: "Log Analysis",
    platform: "SOC Practice",
    tools: "Python, Linux, structured triage",
    objective: "Review logs for suspicious events, correlate indicators, and separate normal activity from signals worth escalating.",
    lesson: "Practiced analyst workflow: filter noise, preserve evidence, assign severity, and summarize findings.",
  },
  {
    title: "IOC Investigation",
    platform: "SOC Practice",
    tools: "OSINT, AbuseIPDB concepts, indicator enrichment",
    objective: "Investigate IPs, domains, and suspicious artifacts to decide whether they support an incident hypothesis.",
    lesson: "Learned enrichment is not proof by itself; context, source quality, and correlation are what make it useful.",
  },
];

export default function CyberRange() {
  const [open, setOpen] = useState(labs[0][0]);

  return (
    <section className="sentinel-section" id="cyberrange">
      <SectionHeader
        label="Labs"
        title="Cyber Range"
        subtitle="A mission board for hands-on security exercises and lessons learned."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {labs.map((lab) => (
          <button className={`range-card ${open === lab.title ? "active" : ""}`} key={lab.title} onClick={() => setOpen(lab.title)}>
            <span>{open === lab.title ? lab.platform : "Mission"}</span>
            <h3>{lab.title}</h3>
            {open === lab.title && (
              <div className="range-detail">
                <p><b>Tools:</b> {lab.tools}</p>
                <p><b>Objective:</b> {lab.objective}</p>
                <p><b>Lesson:</b> {lab.lesson}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
