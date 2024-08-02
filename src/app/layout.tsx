import type { Metadata } from "next";
import {Noto_Sans_Mono} from "next/font/google";
import "./globals.css";

const noto_sans_mono = Noto_Sans_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlaylistPersona",
  description: "Discover your musical personality by entering your Spotify playlist URL!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto_sans_mono.className}>{children}</body>
    </html>
  );
}
