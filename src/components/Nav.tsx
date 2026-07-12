import Link from "next/link";

const links = [
  { href: "/services", label: "Services" },
  { href: "/mgn-681", label: "MGN 681" },
  { href: "/track-record", label: "Track Record" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="border-b border-black/10 bg-white/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-navy tracking-tight">
          Safe-T Consultancy
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-700">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-navy transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light transition-colors"
        >
          Book a consultation
        </Link>
        <nav className="flex md:hidden items-center gap-4 text-sm text-neutral-700">
          <Link href="/services">Services</Link>
          <Link href="/contact" className="text-navy font-medium">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
