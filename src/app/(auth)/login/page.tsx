import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your daily habits and logs.
        </p>
      </div>

      <form className="space-y-4" onSubmit={undefined}>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-75"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <span className="text-xs text-muted-foreground cursor-not-allowed">
              Forgot password?
            </span>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-75"
          />
        </div>

        <button
          id="login-submit"
          type="button"
          disabled
          className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-not-allowed"
        >
          Sign In (Placeholder)
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Don&apos;t have an account?{" "}
        <Link
          id="login-to-register"
          href="/register"
          className="text-primary hover:underline font-semibold ml-1"
        >
          Create one now
        </Link>
      </div>
    </div>
  );
}
