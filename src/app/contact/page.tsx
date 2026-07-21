import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Safe-T Consultancy",
  description:
    "Get in touch with Safe-T Consultancy for superyacht technical, safety, and project management enquiries. Available worldwide.",
};

export default function Contact() {
  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs tracking-widest text-accent uppercase mb-4">Contact</p>
          <h1 className="text-3xl md:text-4xl font-semibold">Discuss your project</h1>
          <p className="mt-4 text-white/80 max-w-xl mx-auto">
            For project enquiries or technical consultancy support, get in touch below. Available
            worldwide across the superyacht circuit - Mediterranean, Caribbean, Middle East, and
            beyond.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-lg font-medium text-navy mb-4">Send an enquiry</h2>
          <ContactForm />
        </div>

        <div>
          <h2 className="text-lg font-medium text-navy mb-4">Direct contact</h2>
          <div className="space-y-3 text-sm text-neutral-700">
            <p>
              <a href="mailto:admin@safetconsultancy.co.uk" className="text-navy-light hover:underline">
                admin@safetconsultancy.co.uk
              </a>
            </p>
            <p>
              <a href="tel:+447598242015" className="text-navy-light hover:underline">
                +44 7598 242 015
              </a>
            </p>
            <p className="text-neutral-500">Typical response time: within 1 business day.</p>
          </div>

          <div className="mt-8 rounded-lg border border-black/10 p-6 bg-sand">
            <p className="text-sm font-medium text-navy mb-2">Prefer to book directly?</p>
            <p className="text-sm text-neutral-600 mb-4">
              Book a consultation slot directly on the calendar, no need to wait for an email
              reply.
            </p>
            <a
              href="https://calendar.app.google/JFuVWgQ9Bscr2YdT6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-navy-light hover:underline"
            >
              Book a consultation -&gt;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
