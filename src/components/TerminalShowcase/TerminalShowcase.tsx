import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";

export default async function TerminalShowcase() {
  const cfg = await siteConfigRepository.getTerminal().catch(() => null);
  if (!cfg || !cfg.enabled) return null;

  return (
    <section
      className="w-full py-24 relative overflow-hidden"
      style={{ backgroundColor: '#141414' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-content mx-auto px-10 md:px-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border"
            style={{ color: '#E5533C', borderColor: 'rgba(229,83,60,0.3)', backgroundColor: 'rgba(229,83,60,0.08)' }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {cfg.badge}
          </span>
        </div>

        {/* Heading */}
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-center mb-16 leading-tight"
          style={{ color: '#F0EDE6' }}
        >
          {cfg.heading}
        </h2>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">

          {/* Left annotations */}
          <div className="hidden lg:flex flex-col gap-8 items-end text-right">
            {cfg.leftAnnotations.map((ann) => (
              <div key={ann.label} className="flex items-center gap-3">
                <div>
                  <p className="text-xs font-bold tracking-widest" style={{ color: '#F0EDE6' }}>
                    {ann.label}
                  </p>
                  <p className="text-[10px] font-mono tracking-wider mt-0.5" style={{ color: 'rgba(240,237,230,0.35)' }}>
                    {ann.sublabel}
                  </p>
                </div>
                {/* Horizontal line pointing right */}
                <div className="w-12 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#E5533C' }} />
              </div>
            ))}
          </div>

          {/* Center: terminal window */}
          <div
            className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#141414' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F56' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFBD2E' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27C93F' }} />
              </div>
              <span
                className="text-[10px] font-mono tracking-widest"
                style={{ color: 'rgba(240,237,230,0.25)' }}
              >
                PORTFOLIO://LOCALHOST · ONLINE
              </span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#05796B' }}
              />
            </div>

            {/* Terminal body */}
            <div className="p-6 font-mono text-sm space-y-2.5" style={{ minHeight: '240px' }}>
              {/* Prompt */}
              <div className="flex items-center gap-2 mb-4">
                <span style={{ color: '#E5533C' }}>λ</span>
                <span style={{ color: '#F0EDE6' }}>portfolio init</span>
              </div>

              {/* Lines */}
              {cfg.terminalLines.map((line, i) => {
                const isOK   = line.includes('OK');
                const isReady = line.startsWith('✓');
                const isPrompt = line.endsWith('_');

                if (isPrompt) {
                  return (
                    <div key={i} className="flex items-center gap-2 pt-2">
                      <span style={{ color: '#E5533C' }}>λ</span>
                      <span className="animate-pulse" style={{ color: 'rgba(240,237,230,0.5)' }}>▋</span>
                    </div>
                  );
                }

                return (
                  <p key={i} style={{ color: isReady ? '#27C93F' : 'rgba(240,237,230,0.5)' }}>
                    {isOK ? (
                      <>
                        {line.replace('OK', '')}
                        <span style={{ color: '#27C93F' }}>OK</span>
                      </>
                    ) : line.includes('ON') ? (
                      <>
                        {line.split('ON').map((part, j, arr) => (
                          <span key={j}>
                            {part}
                            {j < arr.length - 1 && <span style={{ color: '#27C93F' }}>ON</span>}
                          </span>
                        ))}
                      </>
                    ) : line}
                  </p>
                );
              })}
            </div>

            {/* Bottom status bar */}
            <div
              className="flex items-center justify-between px-5 py-2.5 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#111' }}
            >
              <span className="text-[9px] font-mono tracking-widest" style={{ color: 'rgba(240,237,230,0.2)' }}>
                SLAEGA.ME
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-mono" style={{ color: 'rgba(240,237,230,0.2)' }}>ONLINE</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest" style={{ color: 'rgba(240,237,230,0.2)' }}>
                FULL-STACK DEV
              </span>
            </div>
          </div>

          {/* Right annotations */}
          <div className="hidden lg:flex flex-col gap-8 items-start">
            {cfg.rightAnnotations.map((ann) => (
              <div key={ann.label} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#E5533C' }} />
                <div className="w-12 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                <div>
                  <p className="text-xs font-bold tracking-widest" style={{ color: '#F0EDE6' }}>
                    {ann.label}
                  </p>
                  <p className="text-[10px] font-mono tracking-wider mt-0.5" style={{ color: 'rgba(240,237,230,0.35)' }}>
                    {ann.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: annotations below */}
        <div className="lg:hidden mt-10 grid grid-cols-2 gap-4">
          {[...cfg.leftAnnotations, ...cfg.rightAnnotations].map((ann) => (
            <div key={ann.label} className="flex flex-col gap-1">
              <p className="text-xs font-bold tracking-widest" style={{ color: '#F0EDE6' }}>{ann.label}</p>
              <p className="text-[10px] font-mono" style={{ color: 'rgba(240,237,230,0.35)' }}>{ann.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
