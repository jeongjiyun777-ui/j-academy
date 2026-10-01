import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "./(components)/chatbot/chatbot";
import Footer from "./(components)/footer/footer";


export const metadata: Metadata = {
  title: "학원 관리 시스템",
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
      className="h-full antialiased"
    >
      <body className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>

        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}

