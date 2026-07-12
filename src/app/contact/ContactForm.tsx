"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: this currently opens the visitor's email client with a pre-filled message.
    // Replace with a real form backend (e.g. Formspree, Resend, or a Vercel API route)
    // before launch so submissions land reliably without depending on the visitor's
    // local mail client being configured.
    const subject = encodeURIComponent(`Enquiry from ${form.name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nProject: ${form.project}\n\n${form.message}`
    );
    window.location.href = `mailto:admin@safetconsultancy.co.uk?subject=${subject}&body=${body}`;
    setSent(true);
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
        className="inline-flex items-center justify-center rounded-md bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light transition-colors"
      >
        Send enquiry
      </button>
      {sent && (
        <p className="text-sm text-neutral-500">
          Opening your email client to send this - if nothing opens, email
          admin@safetconsultancy.co.uk directly.
        </p>
      )}
    </form>
  );
}
