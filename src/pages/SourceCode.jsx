import { Link } from "react-router-dom";
import { Code2, FileText, Github } from "lucide-react";

export default function SourceCode() {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <Link className="mono-link" to="/">
          Return to Sentinel
        </Link>
        <section className="mt-12 border border-white/10 bg-sentinel-panel/80 p-8 shadow-cyan">
          <p className="hud-label">Source Archive</p>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase tracking-wide">
            Project Sentinel Codebase
          </h1>
          <p className="mt-5 max-w-2xl text-slate-300">
            A standalone React and Vite portfolio with local simulations,
            Three.js visuals, no backend dependency, and recruiter-friendly
            project evidence.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [Code2, "React Components", "Modular Sentinel sections and flow screens."],
              [FileText, "Resume Vault", "Resume download expects public/resume.pdf."],
              [Github, "GitHub Ready", "Clean package scripts for install, dev, and build."],
            ].map(([Icon, title, copy]) => (
              <article key={title} className="border border-white/10 bg-black/20 p-5">
                <Icon className="text-sentinel-cyan" />
                <h2 className="mt-4 font-display text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-slate-400">{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
