import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApplyPilot - AI-Powered Job Application Copilot",
  description:
    "Stop getting rejected by robots. ApplyPilot uses AI to tailor your resume, write cover letters, and beat ATS systems so you land more interviews.",
  keywords: ["AI resume", "ATS optimization", "job application", "cover letter generator", "resume tailor"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
