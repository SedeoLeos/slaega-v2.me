import { faqRepository } from "@/features/faq/repositories/faq.repository";

const DEFAULT_ITEMS = [
  { id: "1", question: "Disponible pour des missions freelance ?", answer: "Oui, je suis disponible pour des missions freelance en développement web et mobile. N'hésitez pas à me contacter via le formulaire pour discuter de votre projet.", order: 0, published: true },
  { id: "2", question: "Quelles sont tes technologies principales ?", answer: "Je travaille principalement avec React, Next.js, TypeScript côté front, Node.js / NestJS côté back, et React Native pour le mobile. Je maîtrise également PostgreSQL, Prisma, Docker et les pipelines CI/CD.", order: 1, published: true },
  { id: "3", question: "Comment se passe une collaboration ?", answer: "Tout commence par un appel de découverte pour comprendre vos besoins. Ensuite je propose une architecture, un planning et un devis. On itère ensemble jusqu'à la livraison finale, avec des démos régulières.", order: 2, published: true },
  { id: "4", question: "Peux-tu travailler à distance ?", answer: "Absolument. Je travaille 100% en remote depuis plusieurs années. J'utilise Slack, Notion, Linear et Figma pour une collaboration fluide, quelle que soit votre timezone.", order: 3, published: true },
  { id: "5", question: "Dans quels délais peux-tu livrer un projet ?", answer: "Ça dépend de la complexité. Un MVP simple peut être prêt en 2-4 semaines. Un produit complet prend généralement 2-3 mois. Je fournis toujours un planning détaillé dès le démarrage.", order: 4, published: true },
];

export default async function FAQ() {
  const dbItems = await faqRepository.getPublished().catch(() => []);
  const items = dbItems.length > 0 ? dbItems : DEFAULT_ITEMS;

  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-content mx-auto px-10 md:px-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-green-app/30 text-green-app bg-green-app/8">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FAQ
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-14 leading-tight text-foreground">
          Questions fréquentes.
        </h2>

        {/* Accordion — native details/summary, zero JS */}
        <div className="max-w-3xl mx-auto space-y-0">
          {items.map((item, idx) => (
            <details
              key={item.id}
              className="group border-b border-border"
            >
              <summary className="flex items-center gap-5 py-6 cursor-pointer list-none select-none">
                {/* Number */}
                <span className="text-xs font-mono font-bold tracking-widest flex-shrink-0 w-6 text-green-app">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {/* Question */}
                <span className="flex-1 text-base font-semibold leading-snug text-foreground">
                  {item.question}
                </span>
                {/* Chevron */}
                <svg
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-open:rotate-180 text-secondary"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              {/* Answer */}
              <div className="pb-6 pl-11 pr-8">
                <p className="text-sm leading-relaxed text-secondary">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
