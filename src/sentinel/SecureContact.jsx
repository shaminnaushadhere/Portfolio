import { Github, Linkedin, Mail } from "lucide-react";
import SectionHeader from "./SectionHeader.jsx";

export default function SecureContact() {
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Project Sentinel contact from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\nReply to: ${data.get("email")}`);
    window.location.href = `mailto:shaminnaushad432@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <section className="sentinel-section" id="contact">
      <SectionHeader
        label="Contact"
        title="Secure Contact"
        subtitle="Send a direct message or open Shamin's public profiles."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="contact-form" onSubmit={submit}>
          <input name="name" placeholder="Name" required />
          <input name="email" type="email" placeholder="Email" required />
          <textarea name="message" placeholder="Message" required />
          <button className="sentinel-button">Transmit Message</button>
        </form>
        <aside className="sentinel-card grid content-start gap-3 p-6">
          <a className="contact-link" href="mailto:shaminnaushad432@gmail.com"><Mail /> shaminnaushad432@gmail.com</a>
          <a className="contact-link" href="https://github.com/shaminnaushad" target="_blank" rel="noreferrer"><Github /> github.com/shaminnaushad</a>
          <a className="contact-link" href="https://linkedin.com/in/shaminnaushad" target="_blank" rel="noreferrer"><Linkedin /> linkedin.com/in/shaminnaushad</a>
        </aside>
      </div>
    </section>
  );
}
