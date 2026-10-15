
import { Award, GraduationCap } from "lucide-react";
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
    image: "/pwn-orange-belt.svg",
    title: "pwn.college — Orange Belt",
    copy: "Earned the Orange Belt in Intro to Cybersecurity through hands-on cybersecurity training, covering 7 modules and 183 challenges across foundational security concepts and practical hacking exercises.",
    stats: [
      "161 Hacking",
      "7 Modules",
      "183 Challenges",
    ],
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
            <article
              className="operation-card timeline-card achievement-card"
              key={item.title}
            >
              <div className="timeline-pin">
                {item.date}
              </div>

              {item.image ? (
                <img
                  src={item.image}
                  alt="pwn.college Orange Belt"
                  className="h-14 w-auto max-w-32 object-contain"
                  loading="lazy"
                />
              ) : (
                <Icon
                  className="text-sentinel-amber"
                  size={34}
                />
              )}

              <h3>{item.title}</h3>

              <p className="mt-3 text-slate-300">
                {item.copy}
              </p>

              {item.stats && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.stats.map((stat) => (
                    <span
                      key={stat}
                      className="rounded border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-mono text-xs text-orange-300"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
