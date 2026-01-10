import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import { useState } from "react";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  const [open, setOpen] = useState(false);
  return (
    <div id="contact" className="my-20 min-h-96 w-screen  px-10">
      <div className="relative rounded-lg bg-black py-16 text-blue-50 sm:overflow-hidden">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96 z-0 pointer-events-none">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80 z-0 pointer-events-none">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            clipClass="absolute md:scale-125"
          />
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="relative z-20 flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase">
            Join Zentry
          </p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether."
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <Button
            title="contact us"
            containerClass="mt-10 cursor-pointer"
            onClick={() => setOpen((s) => !s)}
          />

          <div
            className={`mt-8 w-full overflow-hidden transition-all duration-500 ${
              open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-lg bg-white p-6 text-black shadow-lg">
              <ContactForm onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

const ContactForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);

      const res = await fetch("https://formsubmit.co/ajax/vexuiuc@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const json = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: json.message || "Message sent" });
        setEmail("");
        setSubject("");
        setMessage("");
        if (onClose) onClose();
      } else {
        setStatus({ ok: false, msg: json.message || "Failed to send" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ ok: false, msg: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label className="flex flex-col items-start text-left">
        <span className="text-sm text-gray-700">Your email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 rounded border px-3 py-2 w-full"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col items-start text-left">
        <span className="text-sm text-gray-700">Subject</span>
        <input
          required
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 rounded border px-3 py-2 w-full"
          placeholder="Brief subject"
        />
      </label>

      <label className="flex flex-col items-start text-left">
        <span className="text-sm text-gray-700">Message</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 rounded border px-3 py-2 w-full"
          placeholder="Write your message here"
        />
      </label>

      <div className="mt-2 flex items-center justify-between w-full">
        <Button
          type="submit"
          disabled={loading}
          title={loading ? "Sending..." : "Send message"}
          containerClass="mt-0 !bg-[#13294B] !text-[#FF5F05] px-6 py-2 disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-600"
        >
          Cancel
        </button>
      </div>

      {status && (
        <div
          className={`mt-2 rounded p-2 text-sm ${status.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {status.msg}
        </div>
      )}
    </form>
  );
};

