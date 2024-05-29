import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ConvexClientProvider from "@/components/convex-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin CMS for Event site",
  description: "Admin CMS for Event site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
