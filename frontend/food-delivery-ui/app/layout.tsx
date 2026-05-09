import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="uk" className={inter.variable}>
      <body className="font-sans bg-gray-bg antialiased flex flex-col min-h-screen">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
