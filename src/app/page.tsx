import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
              D
            </div>
            <span className="font-semibold text-lg tracking-tight">DailyTrack</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium ml-1">
              Phase 1 Foundation
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              id="nav-link-login"
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              id="nav-link-register"
              href="/register"
              className="text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 px-3.5 py-1.5 rounded-lg transition-opacity"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Foundation setup verified • SQLite & Next.js 16
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Build consistency, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              one day at a time.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            DailyTrack helps you stay accountable with minimal friction, fast daily
            logging, and streak insights.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              id="cta-dashboard"
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow hover:opacity-90 transition-all"
            >
              Enter Dashboard
            </Link>
            <Link
              id="cta-habits"
              href="/habits"
              className="px-6 py-2.5 rounded-xl border border-border bg-card hover:bg-muted font-medium text-sm transition-colors"
            >
              Explore Habits Route
            </Link>
            <Link
              id="cta-settings"
              href="/settings"
              className="px-6 py-2.5 rounded-xl border border-border bg-card hover:bg-muted font-medium text-sm transition-colors"
            >
              Settings Route
            </Link>
          </div>
        </div>

        {/* Feature Grid / Route Showcase */}
        <section className="mt-16 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow">
            <div className="text-primary font-bold text-sm uppercase tracking-wider mb-1">
              (app) /dashboard
            </div>
            <h3 className="font-semibold text-base mb-1">Central Hub</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time daily progress, active streaks, and quick habit check-in actions.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow">
            <div className="text-primary font-bold text-sm uppercase tracking-wider mb-1">
              (app) /habits
            </div>
            <h3 className="font-semibold text-base mb-1">Habit Tracking</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Create, categorize, and monitor habit consistency across customizable
              schedules.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow">
            <div className="text-primary font-bold text-sm uppercase tracking-wider mb-1">
              (auth) /login & /register
            </div>
            <h3 className="font-semibold text-base mb-1">Authentication Group</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Isolated route group for secure onboarding, session management, and auth
              layouts.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>DailyTrack Foundation Architecture • Phase 1</p>
      </footer>
    </div>
  );
}
