import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              id="app-nav-brand"
              href="/"
              className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                D
              </div>
              <span>DailyTrack</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
              <Link
                id="nav-dashboard"
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Dashboard
              </Link>
              <Link
                id="nav-habits"
                href="/habits"
                className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Habits
              </Link>
              <Link
                id="nav-calendar"
                href="/calendar"
                className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Calendar
              </Link>
              <Link
                id="nav-analytics"
                href="/analytics"
                className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Analytics
              </Link>
              <Link
                id="nav-goals"
                href="/goals"
                className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Goals
              </Link>
              <Link
                id="nav-settings"
                href="/settings"
                className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-xs flex items-center justify-center border border-border">
              DT
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav bar */}
      <div className="sm:hidden border-b border-border bg-card px-4 py-2 flex items-center justify-around text-xs font-medium overflow-x-auto">
        <Link
          id="mobile-nav-dashboard"
          href="/dashboard"
          className="py-1 px-2 text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Dashboard
        </Link>
        <Link
          id="mobile-nav-habits"
          href="/habits"
          className="py-1 px-2 text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Habits
        </Link>
        <Link
          id="mobile-nav-calendar"
          href="/calendar"
          className="py-1 px-2 text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Calendar
        </Link>
        <Link
          id="mobile-nav-analytics"
          href="/analytics"
          className="py-1 px-2 text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Analytics
        </Link>
        <Link
          id="mobile-nav-goals"
          href="/goals"
          className="py-1 px-2 text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Goals
        </Link>
        <Link
          id="mobile-nav-settings"
          href="/settings"
          className="py-1 px-2 text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Settings
        </Link>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>© DailyTrack App Group • Phase 1</p>
      </footer>
    </div>
  );
}
