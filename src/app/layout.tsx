import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const headingFont = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NFF Fag V2",
  description: "Fagportal for dommerklipp og konklusjoner",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <header className="globalHeader">
          <div className="headerInner">
            <Link className="brand" href="/">
              <Image src="/nff-logo.png" alt="NFF logo" width={44} height={44} priority />
              <span>NFF fag</span>
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
