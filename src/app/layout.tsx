import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NFF Fag",
  description: "Fagportal for dommerklipp og konklusjoner",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" className={inter.variable}>
      <body>
        <header className="globalHeader">
          <div className="headerInner">
            <Link className="brand" href="/">
              <Image src="/nff-logo.png" alt="NFF logo" width={50} height={50} priority />
              <span>NFF fag</span>
            </Link>
            <Link className="loginBtn" href="/admin/login">
              Logg inn
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
