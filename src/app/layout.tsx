import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily_Track — Minimalist Habit & Daily Routine Tracker",
  description:
    "Track daily habits, build streaks, and maintain momentum with an intuitive, privacy-first tracker.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
