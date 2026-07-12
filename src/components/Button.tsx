import Link from "next/link";
import { ReactNode } from "react";

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-navy hover:bg-sand transition-colors"
    >
      {children}
    </Link>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </Link>
  );
}

export function DarkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light transition-colors"
    >
      {children}
    </Link>
  );
}
