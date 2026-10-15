
import { useState } from "react";
import { Download, LockKeyhole, UnlockKeyhole } from "lucide-react";
import SectionHeader from "./SectionHeader.jsx";

export default function SecurityClearance() {
  const [unlocked, setUnlocked] = useState(false);

  async function downloadResume() {
    const response = await fetch("/Resume.pdf");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Shamin_Naushad_SOC_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="sentinel-section" id="clearance">
      <SectionHeader
        label="Resume Vault"
        title="Security Clearance"
        subtitle="Unlock the resume dossier for download."
      />
      <article className={`vault-card ${unlocked ? "unlocked" : ""}`}>
        {unlocked ? <UnlockKeyhole size={54} /> : <LockKeyhole size={54} />}
        <h3>{unlocked ? "Clearance Granted" : "Vault Locked"}</h3>
        <p>{unlocked ? "Resume dossier authenticated and ready." : "Unlock resume to access the downloadable PDF."}</p>
        {unlocked ? (
          <button className="sentinel-button mt-7" onClick={downloadResume}>
            <Download size={18} />
            Download Resume
          </button>
        ) : (
          <button className="sentinel-button mt-7" onClick={() => setUnlocked(true)}>
            Unlock Resume
          </button>
        )}
      </article>
    </section>
  );
}

