export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Visual insights, streak breakdowns, and consistency metrics.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
          📊
        </div>
        <h2 className="text-lg font-bold">Coming soon</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          Analytics dashboards and habit heatmaps will be available in an upcoming phase.
        </p>
      </div>
    </div>
  );
}
