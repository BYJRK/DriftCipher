import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drift Cipher - 简易加密解密工具",
  description: "一个简单易用的文本加密解密工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
