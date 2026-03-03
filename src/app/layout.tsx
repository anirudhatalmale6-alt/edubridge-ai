import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduBridge AI - Your Study Abroad Advisor",
  description: "AI-powered platform helping first-generation and low-income international students find realistic scholarship and university opportunities in the United States.",
  keywords: ["scholarships", "international students", "study abroad", "US universities", "financial aid"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
