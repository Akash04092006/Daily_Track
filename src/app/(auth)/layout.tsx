import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link
          id="auth-brand-link"
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            D
          </div>
          <span>DailyTrack</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-border bg-card p-6 sm:p-8 rounded-2xl shadow-sm">
          {children}
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-muted-foreground">
        <p>© DailyTrack • Secure Authentication Group</p>
      </footer>
    </div>
  );
}
