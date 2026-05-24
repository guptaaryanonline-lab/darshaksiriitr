import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dr. Darshak Bhatt | RISHI Lab",
  description: "RF microelectronics, analog circuit design, and RISHI Lab at IIT Roorkee."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
