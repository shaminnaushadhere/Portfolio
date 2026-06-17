import { useState } from "react";
import { Terminal, X } from "lucide-react";

const commands = {
  help: "Commands: whoami, projects, skills, status, clear, sudo access_darkweb",
  whoami: "Shamin Naushad - cybersecurity-focused Computer Science student.",
  projects: "ThreatLens / PhantomNet",
  skills: "Python, Flask, React, Linux, AWS EC2, Wireshark, Nmap, Burp Suite, log analysis.",
  status: "Secure session online. Simulated hidden archive contained.",
  "sudo access_darkweb": "Access denied. Simulated hidden archive remains sealed. Nice try.",
};

export default function DarkWebTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(["Type help to list commands."]);
  const [input, setInput] = useState("");

  function submit(event) {
    event.preventDefault();
    const command = input.trim();
    if (!command) return;
    if (command === "clear") setLines([]);
    else setLines((current) => [...current, `> ${command}`, commands[command] || "Unknown command. Try help."]);
    setInput("");
  }

  return (
    <>
      <button className="terminal-toggle" onClick={() => setOpen(true)} aria-label="Open terminal">
        <Terminal />
      </button>
      {open && (
        <aside className="floating-terminal">
          <header>
            <span>Sentinel Terminal</span>
            <button onClick={() => setOpen(false)} aria-label="Close terminal"><X size={18} /></button>
          </header>
          <div className="terminal-lines">
            {lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
          </div>
          <form onSubmit={submit}>
            <span>&gt;</span>
            <input value={input} onChange={(event) => setInput(event.target.value)} autoFocus />
          </form>
        </aside>
      )}
    </>
  );
}
