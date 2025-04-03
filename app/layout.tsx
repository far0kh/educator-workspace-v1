import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs'

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UserSync } from "@/components/auth/UserSync";

import ButtonGradient from "@/components/ui-custom/button-custom/button-gradient";

import './globals.css';

export const metadata: Metadata = {
  title: "AI-powered Workspace for Educators",
  description: "Make AI helpful for your students. Simplified lesson planning, resource creation, and feedback.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geist.variable} ${geistMono.variable}`}
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: THEME_COLOR_SCRIPT,
            }}
          />
        </head>
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" />
            <div className="flex h-full min-h-screen lg:h-screen w-full overflow-scroll bg-background">
              <div className="flex flex-col flex-1 min-w-0 justify-between">
                {/* <Header /> */}
                <UserSync />
                {children}
                <ButtonGradient />
                <Toaster />
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
