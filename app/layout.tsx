import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Star Wars Browser",
  description:
    "A Star Wars Browser containing all characters, ships, and planets from the Star Wars universe.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
