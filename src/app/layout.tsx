import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/Navbar";
import RouteProgress from "@/components/RouteProgress";

export const metadata: Metadata = {
  title: "Code Ladder · Learn SQL, HTML, CSS & JavaScript",
  description:
    "Self-study practice for SQL, HTML, CSS and JavaScript — guided roadmaps, categorized questions, hints, explanations and progress tracking.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('ll-theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <RouteProgress />
          <Navbar />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
          <footer className="no-print mx-auto w-full max-w-7xl px-4 pb-8 pt-4 text-center text-sm text-zinc-500 sm:px-6 lg:px-8">
            Built for self-study · Code Ladder
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
