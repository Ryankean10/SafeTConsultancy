"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("sent");
      setForm({ name: "", email: "", project: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
        <input
          required
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light"
          placeholder="name@company.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Vessel / project type</label>
        <input
          name="project"
          value={form.project}
          onChange={handleChange}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light"
          placeholder="e.g. 45m refit, MGN 681 review"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
        <textarea
          required
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light"
          placeholder="Tell us about your project"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-md bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
      {status === "sent" && (
        <p className="text-sm text-neutral-500">
          Thanks - your enquiry has been sent. We typically respond within 1 business day.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong sending that. Please email admin@safetconsultancy.co.uk directly.
        </p>
      )}
    </form>
  );
}
