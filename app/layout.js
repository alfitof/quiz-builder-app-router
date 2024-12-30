import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quiztify",
  description: "Quiztify",
  icon: "/favicon-32x32.png",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <body className={inter.className}>{children}</body>
      </NextIntlClientProvider>
    </html>
  );
}
