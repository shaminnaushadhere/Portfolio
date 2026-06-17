import { useEffect, useMemo, useState } from "react";

const sections = ["identity", "projects", "experience", "achievements", "cyberrange", "arsenal", "contact"];

export default function HUD() {
  const sessionId = useMemo(() => `SN-${Math.random().toString(16).slice(2, 8).toUpperCase()}`, []);
  const [time, setTime] = useState(new Date());
  const [current, setCurrent] = useState("identity");

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.find((entry) => entry.isIntersecting);
        if (active) setCurrent(active.target.id);
      },
      { rootMargin: "-42% 0px -48% 0px" }
    );
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <aside className="hud-overlay">
      <span>SENTINEL OS v1.0.7</span>
      <span>UTC {time.toISOString().slice(11, 19)}</span>
      <span>Section {current}</span>
      <span>Secure Session {sessionId}</span>
      <span>Signal Strong</span>
      <span>Threat Simulation: Moderate</span>
    </aside>
  );
}
