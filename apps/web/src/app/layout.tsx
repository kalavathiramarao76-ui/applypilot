import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zypply - Your AI Career Copilot",
  description:
    "Stop getting rejected by robots. Zypply uses AI to tailor your resume, write cover letters, and beat ATS systems so you land more interviews.",
  keywords: ["AI resume", "ATS optimization", "job application", "cover letter generator", "resume tailor", "Zypply"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Zypply - Your AI Career Copilot",
    description:
      "Stop getting rejected by robots. Zypply uses AI to tailor your resume, write cover letters, and beat ATS systems so you land more interviews.",
    type: "website",
    siteName: "Zypply",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zypply - Your AI Career Copilot",
    description:
      "Stop getting rejected by robots. Zypply uses AI to tailor your resume, write cover letters, and beat ATS systems so you land more interviews.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
