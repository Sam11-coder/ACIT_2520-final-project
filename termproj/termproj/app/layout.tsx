import type { Metadata } from "next";
import "@picocss/pico/css/pico.classless.min.css"; // PicoCSS first
import "./globals.css"; // Your overrides second

export const metadata: Metadata = {
  title: "BCITimes",
  description: "Communities within BCIT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
