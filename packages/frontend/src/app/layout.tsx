import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";
import StoreProvider from "@/components/StoreProvider";
import ScrollToTopButton from "@/components/Scrolltotop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Promixity Service",
  description: "Generated by QKIT intern team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/03244eb91d.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        <ScrollToTopButton />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
