import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Start tracking your daily progress and building sustainable habits.
        </p>
      </div>

      <form className="space-y-4" onSubmit={undefined}>
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Alex Smith"
            disabled
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-75"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-email"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            disabled
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-75"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-password"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-75"
          />
        </div>

        <button
          id="register-submit"
          type="button"
          disabled
          className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-not-allowed"
        >
          Sign Up (Placeholder)
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Already have an account?{" "}
        <Link
          id="register-to-login"
          href="/login"
          className="text-primary hover:underline font-semibold ml-1"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
