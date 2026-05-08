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
    <section className="w-full py-24 relative overflow-hidden bg-card">
      <div className="relative max-w-content mx-auto px-10 md:px-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-green-app/30 text-green-app bg-green-app/8">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            MON APPROCHE
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-foreground">
            La méthode prime sur la vitesse.
          </h2>
          <p className="text-secondary text-base max-w-xl mx-auto leading-relaxed">
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
                <div className="border-t border-border py-8 group">
                  <p className="text-[10px] font-mono font-bold tracking-[0.25em] mb-3 text-green-app">
                    {step.label}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-3 text-foreground group-hover:text-green-app transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
                {idx === steps.length - 1 && (
                  <div className="border-t border-border" />
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Right: sticky detail card */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl p-6 space-y-5 bg-background border border-border">
              <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-secondary">
                POURQUOI CETTE MÉTHODE
              </p>
              {[
                "Alignement clair avant tout développement",
                "Architecture pensée pour la scalabilité",
                "Livraisons itératives avec feedback continu",
                "Code propre, testé et documenté",
                "Déploiement accompagné, pas abandonné",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-app" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm leading-relaxed text-secondary">{point}</p>
                </div>
              ))}

              <div className="h-px bg-border" />

              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "30+", label: "Projets" },
                  { value: "5+",  label: "Ans d'exp." },
                  { value: "100%", label: "Remote OK" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-[10px] font-medium mt-0.5 text-secondary">{stat.label}</p>
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
