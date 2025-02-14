import type { Metadata } from "next";
import SideBar from "./components/sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white flex`}
      >
        <SideBar/>
        <div className="bg-green-200 flex flex-col flex-1 min-h-screen ml-16">
          <header className="bg-black-100 p-10">
            <h1 className="font-bold text-Black text-center dark:invert text-3xl">Header, need to Change Later</h1>
          </header>
          <main className ="m-auto p-4">{children}</main>
          <footer className="bg-gray-800 text-white text-center p-2">
            &copy; Taeseok Lee
          </footer>
        </div>
      </body>
    </html>
  );
}
