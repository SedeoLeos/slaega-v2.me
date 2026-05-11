import PageTransition from "@/components/animations/PageTransition";

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full relative overflow-hidden bg-background flex flex-col mt-20">
      <PageTransition>
        {children}
      </PageTransition>
    </main>
  );
}
