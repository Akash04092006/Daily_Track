import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { label: "Tracked Habits", value: "6", change: "+1 this week" },
    { label: "Today's Completion", value: "83%", change: "5 of 6 done" },
    { label: "Longest Streak", value: "14 Days", change: "Personal best" },
    { label: "Active Days", value: "28/30", change: "93% consistency" },
  ];

  const placeholderHabits = [
    { id: "1", title: "Morning Meditation (15 min)", time: "07:30 AM", status: "Done" },
    { id: "2", title: "Read 20 Pages", time: "01:00 PM", status: "Done" },
    { id: "3", title: "Daily Run (5km)", time: "05:00 PM", status: "Pending" },
    { id: "4", title: "Deep Work Session (90 min)", time: "10:00 AM", status: "Done" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here is your daily momentum overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            id="dashboard-new-habit"
            href="/habits"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <span>+</span>
            <span>Add Habit</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </div>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <div className="text-xs text-primary font-medium">{stat.change}</div>
          </div>
        ))}
      </section>

      {/* Main Content Area */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit List */}
        <div className="lg:col-span-2 border border-border bg-card rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Today&apos;s Habits</h2>
            <span className="text-xs text-muted-foreground">Placeholder Data</span>
          </div>

          <div className="space-y-2">
            {placeholderHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                      habit.status === "Done"
                        ? "bg-emerald-500 text-white"
                        : "border border-border"
                    }`}
                  >
                    {habit.status === "Done" ? "✓" : ""}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{habit.title}</p>
                    <p className="text-xs text-muted-foreground">{habit.time}</p>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    habit.status === "Done"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {habit.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar / Quick Insights */}
        <div className="border border-border bg-card rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold">Weekly Streak</h2>
          <div className="p-4 rounded-xl bg-accent text-accent-foreground text-xs space-y-2">
            <p className="font-semibold">🔥 7-Day Consistency Streak!</p>
            <p className="opacity-90">
              You haven&apos;t missed your priority habits this entire week. Keep the
              momentum going!
            </p>
          </div>

          <div className="pt-2 border-t border-border space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Environment</span>
              <span className="font-mono text-foreground">Local SQLite</span>
            </div>
            <div className="flex justify-between">
              <span>Phase Status</span>
              <span className="font-mono text-foreground">Phase 1 Complete</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
