import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from "./(components)/chatbot/chatbot";
import Footer from "./(components)/footer/footer";
import RefreshSession from "./(components)/auth/refresh-session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "j-academy",
  description: "학생과 학원 업무를 관리하는 서비스",
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <RefreshSession />
        <div className="flex-1">{children}</div>

        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
