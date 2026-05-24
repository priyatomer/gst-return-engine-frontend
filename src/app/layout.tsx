import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bhandari & Co. | GST Filing & Business Services",
  description:
    "Leading multi-business conglomerate offering expert GST filing services and cutting-edge software solutions. Trusted by thousands across India.",
  keywords: "GST filing, GST return, software company, business services, tax consultancy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`}>
      <body className="bg-[#0A0F1E] text-slate-100 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
