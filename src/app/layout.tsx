import type { Metadata } from "next";
import "./globals.css";
import {Header} from "@/app/components/Header";

export const metadata: Metadata = {
  title: {
    template: "%s - EmotiSense",
    default: "EmotiSense",
  },
  description: "Detector de emociones en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
