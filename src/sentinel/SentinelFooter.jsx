export default function SentinelFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 py-8 font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span>Project Sentinel</span>
        <span>Secure Session / Online</span>
        <span>Copyright {new Date().getFullYear()} Shamin Naushad</span>
      </div>
    </footer>
  );
}
