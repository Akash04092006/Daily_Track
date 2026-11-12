import { TopNav } from "@/components/features/top-nav";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="mx-auto w-[min(1100px,calc(100%-1.5rem))] py-8">{children}</main>
    </>
  );
}
