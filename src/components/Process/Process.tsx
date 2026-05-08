import { processRepository } from "@/features/process/repositories/process.repository";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerChildren";

const DEFAULT_STEPS = [
  {
    id: "1", stepNumber: 1, label: "STEP 01",
    title: "Analyse & Découverte",
    description: "Écoute active de vos besoins, cadrage du projet, définition des objectifs et contraintes techniques. On aligne la vision avant d'écrire la première ligne.",
    order: 0, published: true,
  },
  {
    id: "2", stepNumber: 2, label: "STEP 02",
    title: "Design & Architecture",
    description: "Wireframes, choix de la stack, modélisation des données et prototypage rapide. L'architecture est pensée pour durer, pas juste pour démarrer.",
    order: 1, published: true,
  },
  {
    id: "3", stepNumber: 3, label: "STEP 03",
    title: "Développement & Livraison",
    description: "Implémentation itérative avec démos régulières, tests, review de code et déploiement. Livraison propre, documentée et maintenable.",
    order: 2, published: true,
  },
];

export default async function Process() {
  const dbSteps = await processRepository.getPublished().catch(() => []);
  const steps = dbSteps.length > 0 ? dbSteps : DEFAULT_STEPS;

  return (
    <section
      className="w-full py-24 relative overflow-hidden"
      style={{ background: '#1A1F14' }}
    >
      {/* Decorative corner glow */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(5,121,107,0.08) 0%, transparent 65%)' }}
      />

      <div className="relative max-w-content mx-auto px-10 md:px-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border"
            style={{ color: '#05796B', borderColor: 'rgba(5,121,107,0.35)', backgroundColor: 'rgba(5,121,107,0.08)' }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            MON APPROCHE
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            La méthode prime sur la vitesse.
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto leading-relaxed">
            Chaque projet suit un processus éprouvé — de la découverte à la livraison,
            sans approximations.
          </p>
        </div>

        {/* Steps layout: left list + right sticky card */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">

          {/* Left: step list */}
          <StaggerContainer className="space-y-0">
            {steps.map((step, idx) => (
              <StaggerItem key={step.id}>
                <div
                  className="border-t py-8 group"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  {/* Step label */}
                  <p
                    className="text-[10px] font-mono font-bold tracking-[0.25em] mb-3"
                    style={{ color: '#05796B' }}
                  >
                    {step.label}
                  </p>

                  {/* Title */}
                  <h3
                    className="text-2xl sm:text-3xl font-extrabold text-white leading-snug mb-3 group-hover:text-green-app transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/50 text-sm leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
                {/* Last item also has a bottom border */}
                {idx === steps.length - 1 && (
                  <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Right: sticky detail card */}
          <div className="lg:sticky lg:top-24">
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Card header */}
              <p
                className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                POURQUOI CETTE MÉTHODE
              </p>

              {/* Checklist */}
              {[
                "Alignement clair avant tout développement",
                "Architecture pensée pour la scalabilité",
                "Livraisons itératives avec feedback continu",
                "Code propre, testé et documenté",
                "Déploiement accompagné, pas abandonné",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{ color: '#05796B' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {point}
                  </p>
                </div>
              ))}

              {/* Separator */}
              <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "30+", label: "Projets" },
                  { value: "5+", label: "Ans d'exp." },
                  { value: "100%", label: "Remote OK" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-extrabold" style={{ color: '#F0EDE6' }}>{stat.value}</p>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
