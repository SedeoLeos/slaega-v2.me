import PageTransition from "@/components/animations/PageTransition";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full relative overflow-hidden bg-background min-h-screen flex flex-col mt-20">
      <PageTransition>
        {children}
      </PageTransition>
    </main>
  );
}
