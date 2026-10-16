import { useState } from "react";

import Button from "./Button";
import SectionHeader from "./SectionHeader";

const FORM_ENDPOINT = "https://formsubmit.co/ajax/60d5184cffd06c5c654909b93314e04c";

// Split card: pitch and form on one side, a real build photo on the other.
const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="w-full px-4 py-24 md:px-10 md:py-32">
      <div className="reveal mx-auto grid max-w-7xl overflow-hidden rounded-card border border-white/10 bg-ink-800 text-paper md:grid-cols-2">
        <div className="relative h-56 md:order-2 md:h-auto">
          <img
            src="/img/posters/hero-3.webp"
            alt="Team members wiring a competition robot beside the field"
            width={1280}
            height={640}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        <div className="p-6 py-10 sm:p-10 md:p-14">
          <SectionHeader
            size="card"
            title="Support the next generation of engineers"
            intro="Sponsorship funds equipment, competition fees, travel, and outreach that grows STEM opportunities across Illinois. Send us a note and we'll follow up with sponsorship details."
          />

          <div className="mt-8">
            {sent ? (
              <div role="status" className="rounded-card border border-accent/40 bg-accent/10 p-6">
                <p className="font-semibold text-paper">Thanks! Your message was sent.</p>
                <p className="mt-1 text-sm text-paper-muted">We&apos;ll get back to you soon.</p>
                <button type="button" onClick={() => setSent(false)} className="mt-4 text-sm font-semibold text-accent hover:text-accent-hover">
                  Send another message
                </button>
              </div>
            ) : (
              <ContactForm onSent={() => setSent(true)} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

const ContactForm = ({ onSent }) => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);

      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setEmail("");
        setSubject("");
        setMessage("");
        onSent?.();
      } else {
        setError(json.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-paper">Your email</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-paper">Subject</span>
        <input
          required
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="field"
          placeholder="Brief subject"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-paper">Message</span>
        <textarea
          required
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field resize-y"
          placeholder="Write your message here"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-2">
        <Button type="submit" disabled={loading} title={loading ? "Sending..." : "Send message"} />
      </div>
    </form>
  );
};
