import { lazy, Suspense, useState } from "react";
import BootSequence from "../sentinel/BootSequence.jsx";
import GlobalSearch from "../sentinel/GlobalSearch.jsx";
import GlobalScan from "../sentinel/GlobalScan.jsx";
import DossierReveal from "../sentinel/DossierReveal.jsx";
import BiometricScanner from "../sentinel/BiometricScanner.jsx";
import HUD from "../sentinel/HUD.jsx";
import SentinelNav from "../sentinel/SentinelNav.jsx";
import DigitalIdentity from "../sentinel/DigitalIdentity.jsx";
import GlobalFootprint from "../sentinel/GlobalFootprint.jsx";
import MissionTimeline from "../sentinel/MissionTimeline.jsx";
import SOCDashboard from "../sentinel/SOCDashboard.jsx";
import ProjectOperations from "../sentinel/ProjectOperations.jsx";
import AchievementsTimeline from "../sentinel/AchievementsTimeline.jsx";
import ExperienceTimeline from "../sentinel/ExperienceTimeline.jsx";
import CyberRange from "../sentinel/CyberRange.jsx";
import ThreatVisualization from "../sentinel/ThreatVisualization.jsx";
import CyberArsenal from "../sentinel/CyberArsenal.jsx";
import SecurityClearance from "../sentinel/SecurityClearance.jsx";
import AIAnalyst from "../sentinel/AIAnalyst.jsx";
import DarkWebTerminal from "../sentinel/DarkWebTerminal.jsx";
import SecureContact from "../sentinel/SecureContact.jsx";
import SentinelFooter from "../sentinel/SentinelFooter.jsx";

const ParallaxStars = lazy(() => import("../sentinel/ParallaxStars.jsx"));

const phases = {
  boot: "BOOT",
  search: "SEARCH",
  scan: "SCAN",
  dossier: "DOSSIER",
  biometric: "BIOMETRIC",
  main: "MAIN",
};

export default function Home() {
  const [phase, setPhase] = useState(phases.boot);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-sentinel-bg text-sentinel-text">
      <Suspense fallback={null}>
        <ParallaxStars />
      </Suspense>
      <div className="scanlines" aria-hidden="true" />
      <div className="laser-grid" aria-hidden="true" />

      {phase === phases.boot && <BootSequence onComplete={() => setPhase(phases.search)} />}
      {phase === phases.search && <GlobalSearch onInitiate={() => setPhase(phases.scan)} />}
      {phase === phases.scan && <GlobalScan onComplete={() => setPhase(phases.dossier)} />}
      {phase === phases.dossier && <DossierReveal onOpen={() => setPhase(phases.biometric)} />}
      {phase === phases.biometric && <BiometricScanner onComplete={() => setPhase(phases.main)} />}

      {phase === phases.main && (
        <>
          <HUD />
          <SentinelNav />
          <main className="relative z-10">
            <DigitalIdentity />
            <GlobalFootprint />
            <MissionTimeline />
            <SOCDashboard />
            <ProjectOperations />
            <ExperienceTimeline />
            <AchievementsTimeline />
            <CyberRange />
            <ThreatVisualization />
            <CyberArsenal />
            <SecurityClearance />
            <AIAnalyst />
            <SecureContact />
          </main>
          <DarkWebTerminal />
          <SentinelFooter />
        </>
      )}
    </div>
  );
}
