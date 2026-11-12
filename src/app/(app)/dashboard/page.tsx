"use client";
import { useState } from "react";
import { GlassCard, ProgressRing } from "@/components/ui/glass";

// TODO (Phase 4): replace MOCK with GET /api/today and toggle via PUT /api/habits/[id]/logs/[date].
const MOCK = [
  {
    id: "1",
    title: "Morning run",
    category: "fitness",
    unit: "km",
    target: 1,
    streak: 12,
  },
  {
    id: "2",
    title: "Drink water",
    category: "health",
    unit: "glasses",
    target: 8,
    streak: 5,
  },
  {
    id: "3",
    title: "Read 20 pages",
    category: "learning",
    unit: "pages",
    target: 20,
    streak: 9,
  },
  {
    id: "4",
    title: "Meditate",
    category: "mindfulness",
    unit: "min",
    target: 10,
    streak: 3,
  },
];

export default function DashboardPage() {
  const [done, setDone] = useState<Record<string, boolean>>({ "1": true });
  const count = MOCK.filter((h) => done[h.id]).length;
  return (
    <div className="grid gap-5 md:grid-cols-[auto_1fr]">
      <GlassCard className="grid place-items-center gap-3 md:row-span-2">
        <ProgressRing done={count} total={MOCK.length} />
        <p className="max-w-[16ch] text-center text-sm text-muted">
          {count === MOCK.length
            ? "All done. Nice work today."
            : `${MOCK.length - count} left to go.`}
        </p>
      </GlassCard>
      <GlassCard>
        <h1 className="text-2xl font-bold tracking-tight">Today</h1>
        <ul className="mt-4 divide-y divide-[var(--glass-border)]">
          {MOCK.map((h) => (
            <li key={h.id} className="flex items-center gap-3 py-3">
              <button
                role="checkbox"
                aria-checked={!!done[h.id]}
                aria-label={`Mark ${h.title} done`}
                onClick={() => setDone((d) => ({ ...d, [h.id]: !d[h.id] }))}
                className={`grid size-7 place-items-center rounded-full border transition-colors ${
                  done[h.id]
                    ? "border-transparent bg-accent text-accent-fg"
                    : "border-[var(--glass-border)]"
                }`}
              >
                {done[h.id] && "✓"}
              </button>
              <div className="min-w-0 flex-1">
                <div
                  className={`font-medium ${done[h.id] ? "text-muted line-through" : ""}`}
                >
                  {h.title}
                </div>
                <div className="text-xs text-muted">
                  {h.target} {h.unit} · {h.category}
                </div>
              </div>
              <span className="text-sm text-muted tabular-nums">
                {h.streak} day streak
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
      <GlassCard>
        <h2 className="font-semibold">How are you feeling?</h2>
        <p className="mt-1 text-sm text-muted">Log mood, energy and focus for today.</p>
      </GlassCard>
    </div>
  );
}
