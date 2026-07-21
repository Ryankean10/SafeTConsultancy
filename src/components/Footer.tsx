import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">Safe-T Consultancy</p>
          <p className="mt-2 text-sm text-white/70 max-w-xs">
            Engineering-led safety, technical and project management for superyachts.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-white/90">Site</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-white/70">
            <Link href="/services" className="hover:text-white">Services</Link>
            <Link href="/mgn-681" className="hover:text-white">MGN 681</Link>
            <Link href="/track-record" className="hover:text-white">Track Record</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-white/90">Contact</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-white/70">
            <a href="mailto:admin@safetconsultancy.co.uk" className="hover:text-white">
              admin@safetconsultancy.co.uk
            </a>
            <a href="tel:+447598242015" className="hover:text-white">+44 7598 242 015</a>
            <p className="text-white/50 mt-2">Available worldwide across the superyacht circuit.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        <span>(c) Safe-T Consultancy. All rights reserved.</span>
        <span className="mx-2" aria-hidden="true">·</span>
        <Link href="/admin/login" className="hover:text-white/80 transition-colors">
          Staff login
        </Link>
      </div>
    </footer>
  );
}
