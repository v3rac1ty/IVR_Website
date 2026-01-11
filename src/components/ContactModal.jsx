import { useState } from "react";

const ContactModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);

      const res = await fetch("https://formsubmit.co/ajax/60d5184cffd06c5c654909b93314e04c", {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div
        className="relative z-60 w-11/12 max-w-2xl transform rounded-lg bg-white p-6 shadow-lg transition-all duration-500 ease-out"
        style={{
          transformOrigin: "center",
        }}
      >
        <button
          className="absolute right-4 top-4 text-gray-600"
          onClick={onClose}
        >
          Close
        </button>

        <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex flex-col">
            <span className="text-sm text-gray-700">Your Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 rounded border px-3 py-2"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700">Subject</span>
            <input
              required
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 rounded border px-3 py-2"
              placeholder="Brief subject"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700">Message</span>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 rounded border px-3 py-2"
              placeholder="Write your message here"
            />
          </label>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-violet-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send message"}
            </button>

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
      </div>
    </div>
  );
};

export default ContactModal;
