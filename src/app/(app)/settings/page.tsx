import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure application preferences, storage settings, and view environment
          diagnostics.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <section className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Theme & Appearance</h2>
              <p className="text-xs text-muted-foreground">
                Toggle between Light and Dark interface modes.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Database Status Section */}
        <section className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold">Database & Storage</h2>
            <p className="text-xs text-muted-foreground">
              Local persistent storage configuration powered by Prisma ORM and SQLite.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1">
              <span className="text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                Database Engine
              </span>
              <p className="font-semibold text-foreground">SQLite (Local Embedded)</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1">
              <span className="text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                Connection Pattern
              </span>
              <p className="font-semibold text-foreground">Global Singleton (HMR-safe)</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1">
              <span className="text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                ORM Client
              </span>
              <p className="font-semibold text-foreground">Prisma Client v6.19.3</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1">
              <span className="text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                Schema Models
              </span>
              <p className="font-semibold text-foreground">
                Zero models (Phase 1 Baseline)
              </p>
            </div>
          </div>
        </section>

        {/* System & Architecture Section */}
        <section className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold">System Diagnostics</h2>
            <p className="text-xs text-muted-foreground">
              Environment integrity and runtime stack.
            </p>
          </div>

          <ul className="divide-y divide-border text-xs">
            <li className="py-2.5 flex items-center justify-between">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-mono font-medium">Next.js 16.4.3 (Turbopack)</span>
            </li>
            <li className="py-2.5 flex items-center justify-between">
              <span className="text-muted-foreground">UI Library</span>
              <span className="font-mono font-medium">React 19.3.0</span>
            </li>
            <li className="py-2.5 flex items-center justify-between">
              <span className="text-muted-foreground">CSS Engine</span>
              <span className="font-mono font-medium">
                Tailwind CSS v4 (Design Tokens)
              </span>
            </li>
            <li className="py-2.5 flex items-center justify-between">
              <span className="text-muted-foreground">Environment Validator</span>
              <span className="font-mono font-medium">Zod v4</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
