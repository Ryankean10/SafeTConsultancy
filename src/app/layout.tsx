import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://safetconsultancy.co.uk"),
  title: "Safe-T Consultancy | Superyacht Safety, Technical & Project Management",
  description:
    "Engineering-led safety, technical and project management consultancy for superyachts. New builds, refits, commissioning and MGN 681 lithium-ion compliance, worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
