
import { Award, GraduationCap, ShieldCheck } from "lucide-react";
import SectionHeader from "./SectionHeader.jsx";

const achievements = [
  {
    date: "2024",
    icon: GraduationCap,
    title: "Google Foundations of Cybersecurity",
    copy: "Completed foundational cybersecurity training and built a stronger SOC analyst vocabulary.",
  },
  {
    date: "2025",
    icon: Award,
    title: "New American University Scholar",
    copy: "Academic scholarship recognition while pursuing Computer Science at Arizona State University.",
  },
  {
    date: "2026",
    icon: ShieldCheck,
    title: "pwn.college — Orange Belt",
    copy: "Earned the Orange Belt by completing hands-on cybersecurity challenges in Fundamentals and Intro to Cybersecurity, strengthening practical security knowledge and problem-solving skills.",
  },
];

export default function AchievementsTimeline() {
  return (
    <section className="sentinel-section" id="achievements">
      <SectionHeader
        label="Achievements"
        title="Achievement Timeline"
        subtitle="Milestones organized chronologically so recruiters can scan progress quickly."
      />
      <div className="alternating-timeline achievement-line">
        {achievements.map((item) => {
          const Icon = item.icon;
          return (
            <article className="operation-card timeline-card achievement-card" key={item.title}>
              <div className="timeline-pin">{item.date}</div>
              <Icon className="text-sentinel-amber" size={34} />
              <h3>{item.title}</h3>
              <p className="mt-3 text-slate-300">{item.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
