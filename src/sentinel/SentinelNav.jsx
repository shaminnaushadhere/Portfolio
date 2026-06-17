import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const items = [
  ["IDENTITY", "identity"],
  ["OPERATIONS", "projects"],
  ["EXPERIENCE", "experience"],
  ["ACHIEVEMENTS", "achievements"],
  ["LABS", "cyberrange"],
  ["ARSENAL", "arsenal"],
  ["CONTACT", "contact"],
];

export default function SentinelNav() {
  const [open, setOpen] = useState(false);

  function jump(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <header className="sentinel-nav">
      <button className="brand" onClick={() => jump("identity")}>
        Project Sentinel
      </button>
      <nav className={open ? "is-open" : ""}>
        {items.map(([label, id]) => (
          <button key={id} onClick={() => jump(id)}>
            {label}
          </button>
        ))}
        <Link to="/source-code">SOURCE</Link>
      </nav>
      <button className="nav-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
