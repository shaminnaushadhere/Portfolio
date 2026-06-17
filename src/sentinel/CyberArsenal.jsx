import SectionHeader from "./SectionHeader.jsx";

const skills = [
  ["Python", "Language", 92],
  ["JavaScript / React", "Language", 85],
  ["Java / C/C++ / Swift", "Language", 78],
  ["Linux", "System", 85],
  ["AWS (EC2)", "Cloud", 72],
  ["Wireshark & Nmap", "Security Tool", 82],
  ["Burp Suite", "Security Tool", 78],
  ["Threat Detection", "Cyber", 88],
  ["OWASP / Secure Coding", "Cyber", 85],
  ["Incident Response", "Cyber", 80],
];

export default function CyberArsenal() {
  return (
    <section className="sentinel-section" id="arsenal">
      <SectionHeader
        label="Arsenal"
        title="Cyber Arsenal"
        subtitle="Weapons locker - tactical capabilities and proficiency assessment."
      />
      <div className="arsenal-bars">
        {skills.map(([name, category, percent]) => (
          <article className="arsenal-bar" key={name}>
            <div>
              <h3>{name}</h3>
              <span>{category}</span>
            </div>
            <div className="arsenal-track"><b style={{ width: `${percent}%` }} /></div>
            <em>{percent}%</em>
          </article>
        ))}
      </div>
    </section>
  );
}
