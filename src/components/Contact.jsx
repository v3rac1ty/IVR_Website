import { useState } from "react";
import clsx from "clsx";

import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const FORM_ENDPOINT = "https://formsubmit.co/ajax/60d5184cffd06c5c654909b93314e04c";

const ImageClipBox = ({ src, clipClass, width, height }) => (
  <div className={clipClass}>
    <img src={src} alt="" width={width} height={height} loading="lazy" decoding="async" />
  </div>
);

const Contact = () => {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="my-20 w-full px-4 md:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-card border border-white/10 bg-ink-800 py-20 text-paper">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-0 z-0 hidden h-full w-96 overflow-hidden opacity-50 lg:block">
          <ImageClipBox src="/img/opt/contact-1.webp" clipClass="contact-clip-path-1" width={800} height={546} />
          <ImageClipBox src="/img/opt/contact-2.webp" clipClass="contact-clip-path-2 translate-y-60 lg:translate-y-40" width={800} height={508} />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-10 z-0 hidden w-80 opacity-50 lg:block">
          <ImageClipBox src="/img/opt/swordman-partial.webp" clipClass="absolute md:scale-125" width={800} height={984} />
          <ImageClipBox src="/img/opt/swordman.webp" clipClass="sword-man-clip-path md:scale-125" width={800} height={984} />
        </div>

        <div className="relative z-20 flex flex-col items-center px-4 text-center">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Sponsor Illini VEX
          </p>

          <AnimatedTitle
            title="Support the <br /> next generation of <br /> innovators"
            containerClass="!text-4xl !leading-[.95] md:!text-[4.5rem]"
          />

          <p className="mt-8 max-w-xl text-base leading-relaxed text-paper-muted">
            Partner with Illini VEX Robotics to give students the tools,
            mentorship, and travel support they need to compete and learn.
            Sponsorship funds equipment, competition fees, travel, and outreach
            that grows STEM opportunities across Illinois.
          </p>

          <Button
            title={open ? "Close form" : "Contact us"}
            containerClass="mt-8"
            aria-expanded={open}
            aria-controls="contact-form"
            onClick={() => {
              setOpen((s) => !s);
              setSent(false);
            }}
          />

          {sent && !open && (
            <p role="status" className="mt-6 rounded-lg bg-accent/15 px-4 py-2 text-sm font-semibold text-accent">
              Thanks! Your message was sent. We&apos;ll get back to you soon.
            </p>
          )}

          <div
            id="contact-form"
            className={clsx(
              "grid w-full max-w-xl transition-all duration-500 ease-out",
              open ? "mt-8 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
            inert={open ? undefined : ""}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="rounded-card border border-white/10 bg-ink p-6 text-left">
                <ContactForm
                  onClose={() => setOpen(false)}
                  onSent={() => {
                    setSent(true);
                    setOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

const ContactForm = ({ onClose, onSent }) => {
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

      <div className="mt-2 flex items-center justify-between">
        <Button type="submit" disabled={loading} title={loading ? "Sending..." : "Send message"} />
        <button type="button" onClick={onClose} className="p-2 text-sm font-semibold text-paper-muted hover:text-paper">
          Cancel
        </button>
      </div>
    </form>
  );
};
