Portfolio de **Seba Gedeon Matsoula Malonga** (slaega) — [slaega.com](https://slaega.com). Projet [Next.js](https://nextjs.org).

## 🔌 API publique — données de carrière (pour génération de CV par IA)

Un point d'entrée **public et sans clé API** expose toute la matière de carrière du
portfolio (profil, expériences, projets & POC, certifications, compétences,
formation). But : donner cette URL — ou son contenu — à **n'importe quel modèle
d'IA** pour générer un CV à partir de **données réelles**, même sans clé API.

| Endpoint | Description |
| --- | --- |
| `GET /api/cv` | JSON agrégé complet (projets = résumé) + bloc `_meta` |
| `GET /api/cv?full=1` | + le contenu détaillé de chaque projet |
| `GET /api/cv?format=md` | Un document **Markdown** prêt à coller dans un modèle |
| `GET /api/experience` | Expériences seules |
| `GET /api/projects` | Projets publiés seuls |
| `GET /api/stats` | Chiffres clés |

- **CORS ouvert** (lecture publique), cache CDN ~1 h. Aucune donnée privée exposée
  (numéro de téléphone volontairement exclu).
- Les données proviennent de la base (seed `prisma/seed-prod.ts` + fiches
  `src/content/project/*.mdx`) — donc mettre à jour le portfolio met à jour l'API.

### Exemples

```bash
# JSON complet
curl https://slaega.com/api/cv

# Markdown prêt pour un modèle
curl "https://slaega.com/api/cv?format=md"
```

Prompt type pour un modèle :

> Récupère mes données sur `https://slaega.com/api/cv?format=md` et génère-moi un
> CV d'une page pour un poste de **[intitulé]** chez **[entreprise]**. N'invente
> aucun fait : utilise uniquement ces données. Mets en avant **[angle]**.

(Si le modèle ne navigue pas : ouvre l'URL `?format=md`, copie le contenu, colle-le
dans le modèle avec le même prompt.)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
