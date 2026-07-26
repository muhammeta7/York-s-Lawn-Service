import type { Metadata } from "next";
import "./globals.css";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: `${BUSINESS.name} | ${BUSINESS.serviceArea}`,
  description: `Lawn mowing, leaf cleanup, mulch, and trimming in ${BUSINESS.serviceArea}. Request a free estimate or book a job online.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
