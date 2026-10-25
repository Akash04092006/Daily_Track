export default function HabitsPage() {
  const habits = [
    {
      id: "h1",
      title: "Morning Meditation",
      description: "Mindfulness session to start the morning clear-headed",
      category: "Wellness",
      streak: 12,
      frequency: "Daily",
    },
    {
      id: "h2",
      title: "Read 20 Pages",
      description: "Non-fiction books on philosophy, design, and science",
      category: "Learning",
      streak: 8,
      frequency: "Daily",
    },
    {
      id: "h3",
      title: "Running / Cardio",
      description: "Minimum 5km outdoor run or interval sprint session",
      category: "Health",
      streak: 5,
      frequency: "3x / Week",
    },
    {
      id: "h4",
      title: "Review Architecture & Code",
      description: "Weekly audit of personal open-source projects",
      category: "Productivity",
      streak: 4,
      frequency: "Weekly",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Habit Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Manage your daily routines, targets, and recurring goals.
          </p>
        </div>

        <button
          id="habits-create-button"
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-not-allowed"
        >
          <span>+</span>
          <span>New Habit (Placeholder)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-sm">
        <button className="px-3 py-1 font-semibold text-primary border-b-2 border-primary -mb-2.5">
          All Habits ({habits.length})
        </button>
        <button className="px-3 py-1 text-muted-foreground hover:text-foreground">
          Daily
        </button>
        <button className="px-3 py-1 text-muted-foreground hover:text-foreground">
          Weekly
        </button>
        <button className="px-3 py-1 text-muted-foreground hover:text-foreground">
          Archived
        </button>
      </div>

      {/* Grid of Habits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-semibold">
                  {habit.category}
                </span>
                <h3 className="font-bold text-lg mt-1">{habit.title}</h3>
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {habit.frequency}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {habit.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="text-emerald-500 font-semibold">
                🔥 {habit.streak} Day Streak
              </span>
              <span className="text-muted-foreground">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
