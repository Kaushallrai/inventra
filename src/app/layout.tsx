import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/providers/ReduxProvider";

import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "./context/AuthProvider";

export const metadata: Metadata = {
  title: "Inventra",
  description: "Generated by create next app",
};
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body className={poppins.className}>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <div>{children}</div>
              <Toaster
                richColors
                closeButton
                position="top-right"
                duration={3000}
              />
            </ThemeProvider>
          </ReduxProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
