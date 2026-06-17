import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader.jsx";

const metrics = [
  ["Projects Built", 2, "+"],
  ["Labs Practiced", 20, "+"],
  ["Security Tools", 8, "+"],
  ["Certifications", 1, " Completed / 1 In Progress"],
  ["Active Projects", 2, ""],
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let current = 0;
      const timer = window.setInterval(() => {
        current = Math.min(value, current + Math.max(1, Math.ceil(value / 20)));
        setCount(current);
        if (current === value) window.clearInterval(timer);
      }, 38);
      observer.disconnect();
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <strong ref={ref}>{count}{count === value ? suffix : ""}</strong>;
}

export default function SOCDashboard() {
  return (
    <section className="sentinel-section" id="soc">
      <SectionHeader
        label="SOC Dashboard"
        title="Operational Metrics"
        subtitle="Realistic portfolio metrics presented as a command-center dashboard."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map(([label, value, suffix]) => (
          <article className="metric-card" key={label}>
            <Counter value={value} suffix={suffix} />
            <span>{label}</span>
            <div className="metric-bars">{Array.from({ length: 12 }, (_, i) => <b key={i} />)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
