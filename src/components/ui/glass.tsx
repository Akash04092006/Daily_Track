import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export function GlassCard({ className, ...p }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("glass p-5 sm:p-6", className)} {...p} />;
}

export function GlassButton({
  variant = "ghost", className, ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" }) {
  return (
    <button
      className={cx(
        "rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50",
        variant === "solid"
          ? "bg-accent text-accent-fg hover:brightness-110"
          : "border border-[var(--glass-border)] hover:bg-[var(--glass)]",
        className,
      )}
      {...p}
    />
  );
}

/** The signature element: today's completion ring. */
export function ProgressRing({ done, total, size = 168 }: { done: number; total: number; size?: number }) {
  const r = (size - 16) / 2, c = 2 * Math.PI * r, pct = total ? done / total : 0;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}
         role="img" aria-label={`${done} of ${total} habits done today`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--glass-border)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
                style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-bold tabular-nums">{done}<span className="text-muted">/{total}</span></div>
        <div className="text-xs text-muted">done today</div>
      </div>
    </div>
  );
}
