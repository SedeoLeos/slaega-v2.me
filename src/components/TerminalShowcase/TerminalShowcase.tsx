import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";

export default async function TerminalShowcase() {
  const cfg = await siteConfigRepository.getTerminal().catch(() => null);
  if (!cfg || !cfg.enabled) return null;

  return (
    <section className="w-full py-24 relative overflow-hidden bg-card">
      {/* Subtle grid texture using theme foreground color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-content mx-auto px-10 md:px-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-green-app/30 text-green-app bg-green-app/8">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {cfg.badge}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-16 leading-tight text-foreground">
          {cfg.heading}
        </h2>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">

          {/* Left annotations */}
          <div className="hidden lg:flex flex-col gap-8 items-end text-right">
            {cfg.leftAnnotations.map((ann) => (
              <div key={ann.label} className="flex items-center gap-3">
                <div>
                  <p className="text-xs font-bold tracking-widest text-foreground">{ann.label}</p>
                  <p className="text-[10px] font-mono tracking-wider mt-0.5 text-secondary">{ann.sublabel}</p>
                </div>
                <div className="w-12 h-px bg-border" />
                <div className="w-1 h-1 rounded-full flex-shrink-0 bg-green-app" />
              </div>
            ))}
          </div>

          {/* Center: terminal window — always dark, it's a terminal UI */}
          <div className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid rgba(0,0,0,0.15)' }}>
            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-500">
                PORTFOLIO://LOCALHOST · ONLINE
              </span>
              <div className="w-2 h-2 rounded-full bg-green-app" />
            </div>

            {/* Terminal body */}
            <div className="p-6 font-mono text-sm space-y-2.5 bg-zinc-950" style={{ minHeight: '240px' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-app">λ</span>
                <span className="text-zinc-200">portfolio init</span>
              </div>
              {cfg.terminalLines.map((line, i) => {
                const isOK    = line.includes('OK');
                const isReady = line.startsWith('✓');
                const isPrompt = line.endsWith('_');

                if (isPrompt) return (
                  <div key={i} className="flex items-center gap-2 pt-2">
                    <span className="text-green-app">λ</span>
                    <span className="animate-pulse text-zinc-600">▋</span>
                  </div>
                );
                return (
                  <p key={i} className={isReady ? "text-[#27C93F]" : "text-zinc-500"}>
                    {isOK ? (
                      <>{line.replace('OK', '')}<span className="text-[#27C93F]">OK</span></>
                    ) : line.includes('ON') ? (
                      line.split('ON').map((part, j, arr) => (
                        <span key={j}>{part}{j < arr.length - 1 && <span className="text-[#27C93F]">ON</span>}</span>
                      ))
                    ) : line}
                  </p>
                );
              })}
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-900 border-t border-zinc-800">
              <span className="text-[9px] font-mono tracking-widest text-zinc-600">SLAEGA.ME</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-mono text-zinc-600">ONLINE</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-600">FULL-STACK DEV</span>
            </div>
          </div>

          {/* Right annotations */}
          <div className="hidden lg:flex flex-col gap-8 items-start">
            {cfg.rightAnnotations.map((ann) => (
              <div key={ann.label} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full flex-shrink-0 bg-green-app" />
                <div className="w-12 h-px bg-border" />
                <div>
                  <p className="text-xs font-bold tracking-widest text-foreground">{ann.label}</p>
                  <p className="text-[10px] font-mono tracking-wider mt-0.5 text-secondary">{ann.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: annotations below */}
        <div className="lg:hidden mt-10 grid grid-cols-2 gap-4">
          {[...cfg.leftAnnotations, ...cfg.rightAnnotations].map((ann) => (
            <div key={ann.label} className="flex flex-col gap-1">
              <p className="text-xs font-bold tracking-widest text-foreground">{ann.label}</p>
              <p className="text-[10px] font-mono text-secondary">{ann.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
