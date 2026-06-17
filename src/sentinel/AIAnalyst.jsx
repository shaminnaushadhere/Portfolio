import { useState } from "react";
import SectionHeader from "./SectionHeader.jsx";

const responses = {
  "Who is Shamin?":
    "Shamin Naushad is a Computer Science student at Arizona State University with a strong focus on cybersecurity and SOC analyst work. His portfolio is built around threat detection, incident analysis, secure coding, log review, and practical security automation. He is developing the kind of evidence-driven mindset needed in a security operations environment: investigate the signal, verify the context, and explain the finding clearly.",
  "Explain ThreatLens":
    "ThreatLens is Shamin's SOC log analysis and threat detection platform. It is designed to help an analyst review security logs, extract indicators of compromise, map suspicious behavior to MITRE ATT&CK concepts, enrich IP indicators with AbuseIPDB-style intelligence, and generate readable investigation reports. The goal of the project is not just to parse logs, but to turn raw evidence into a structured analyst workflow with exports such as PDF reports and CSV IOC lists.",
  "What cybersecurity tools does he know?":
    "Shamin has hands-on practice with tools and environments commonly used in security learning and SOC-style analysis. His toolkit includes Wireshark for packet inspection, Nmap for enumeration, Burp Suite for web application testing, Linux for command-line investigation, Python and Flask for automation and security tooling, and AWS EC2 for cloud-hosted practice environments. He also works with log analysis, IOC enrichment concepts, OWASP topics, and MITRE ATT&CK mapping.",
  "What projects has he built?":
    "Shamin's featured projects are ThreatLens and PhantomNet. ThreatLens focuses on SOC log analysis, IOC extraction, MITRE mapping, enrichment, reporting, and analyst-friendly exports. PhantomNet is still in progress and is positioned as a website defense and monitoring platform focused on alerting, deception concepts, and defense-ring thinking. Together, these projects show his interest in blue-team workflows, detection engineering, and practical security operations.",
};

export default function AIAnalyst() {
  const [answer, setAnswer] = useState("Select a local analyst prompt. No backend or external API is used.");

  return (
    <section className="sentinel-section" id="ai">
      <SectionHeader
        label="Local Analyst"
        title="AI Analyst"
        subtitle="A local predefined response panel styled like an analyst assistant."
      />
      <article className="sentinel-card p-6">
        <div className="terminal-output">{answer}</div>
        <div className="mt-5 flex flex-wrap gap-3">
          {Object.keys(responses).map((question) => (
            <button className="icon-link" key={question} onClick={() => setAnswer(responses[question])}>
              {question}
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
