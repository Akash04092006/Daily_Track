"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  ["Today", "/dashboard"],
  ["Habits", "/habits"],
  ["Calendar", "/calendar"],
  ["Analytics", "/analytics"],
  ["Goals", "/goals"],
  ["Settings", "/settings"],
] as const;

export function TopNav() {
  const path = usePathname();
  return (
    <header className="sticky top-3 z-50 mx-auto w-[min(1100px,calc(100%-1.5rem))]">
      <nav aria-label="Main" className="glass-strong flex items-center gap-2 px-3 py-2">
        <Link href="/dashboard" className="px-3 font-bold tracking-tight">
          Daily_Track
        </Link>
        <ul className="no-scrollbar ml-auto flex gap-1 overflow-x-auto">
          {LINKS.map(([label, href]) => {
            const on = path.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={`block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${on ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
