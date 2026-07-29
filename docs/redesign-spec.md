# Slaega — Portfolio · Refonte complète UX/UI + Rewriting

> Document de cadrage. On fige ici la **direction design**, le **système de motion**,
> la **refonte section par section** et le **contenu réécrit** — avant d'implémenter par batches.
> Analyse faite depuis le code (source de vérité du site en ligne `slaega.vercel.app`).

---

## 0. Principes directeurs (Design DNA)

Inspiré du concept « minimalist luxury / free-flow », adapté à un portfolio d'**architecte logiciel senior**.

1. **Éditorial, pas décoratif** — l'espace, l'échelle typographique et le **contraste** portent le design. Zéro superflu.
2. **Free-flow** — pas de cages : les sections respirent et s'enchaînent par **changement de fond**, pas par bordures/lignes.
3. **Angles nets** — on abandonne les arrondis. **Radius max 2 px** (boutons, puces, images = **0 px**). Aucun `rounded-xl/2xl/full` décoratif.
4. **Contraste comme profondeur** — cartes = fond blanc sur off-white ; **pas d'ombres portées**. La hiérarchie vient du contraste et de l'échelle.
5. **Tout est vivant** — chaque élément a une **entrée au scroll**, certains une **sortie**. Rien de statique.
6. **Un seul accent** — l'émeraude. Utilisé avec intention (liens, hovers, focus), jamais en décoration.

---

## 1. Design System

### 1.1 Couleurs (déjà appliquées — Batch 1)
```
--background: #F5F4EF   /* canvas off-white */
--foreground: #14140F   /* encre profonde */
--secondary:  #8A897F   /* labels / méta */
--accent:     #0B6E5B   /* émeraude — accent unique */
--card:       #FFFFFF   /* cartes (contraste, sans bordure) */
--border:     rgba(20,20,15,0.07)  /* séparateurs fonctionnels only */
--ink-hi:     #0B0B08   /* pour titres massifs / sections sombres */
```
Section sombre (rythme) : fond `#0F0F0C`, texte `#F5F4EF`, accent inchangé.

### 1.2 Typographie — échelle cinématique
- **Display** : `Space Grotesk` 700 — titres héro & sections. `clamp()`.
  - Hero : `clamp(2.75rem, 8vw, 6.5rem)`, `line-height .92`, `letter-spacing -.03em`
  - Section : `clamp(2rem, 5vw, 4rem)`
- **Corps** : `Inter` 400–500, 16–18px, `line-height 1.7`
- **Labels** : `Inter` 600 **uppercase**, 11px, `letter-spacing .22em`, `--secondary`
- **Mono** (accents techniques : steps, terminal, méta) : `ui-monospace`

### 1.3 Formes & profondeur — RÈGLES STRICTES
- `border-radius`: **2 px max** (`rounded-[2px]`). Images/avatars/puces → **0 px**.
- `box-shadow`: **aucune**. Remplacée par contraste + fine bordure `--border` **uniquement quand structurellement nécessaire**.
- Bordures : jamais pour « encadrer » une carte — seulement comme **séparateur fonctionnel** (1px `--border`) ou **barre d'accent** (2–4px `--accent`, structurel).
- Inputs : fond `#FFFFFF`/`#F0EFEA`, **pas de bordure**, `border-bottom: 1.5px` transparent → `--accent` au focus. Radius 0.

### 1.4 Boutons
- Primaire : fond `--accent`, texte blanc, radius 2px, hover = `scale(1.02)` + assombrissement léger. Pas d'ombre.
- Ghost : bordure 1px `--foreground`, hover = fond `--foreground` / texte `--background`.

---

## 2. Système de MOTION (nouveau — cœur de la refonte)

Basé sur Framer Motion. On généralise et on structure.

### 2.1 Primitives (réutilisables, définies globalement)
| Nom | Effet | Usage |
|---|---|---|
| `fadeInUp` | y:40→0, opacity 0→1, .7s | entrée par défaut de tout bloc texte |
| `stagger` | enfants décalés de .08s | listes, grilles, cartes |
| `revealClip` | `inset(100% 0 0 0)`→`inset(0)` + scale settle | images (déjà: `Reveal.tsx`) |
| `scaleIn` | .8→1 | stats, chiffres |
| `countUp` | compteur 0→valeur | stats (déjà: `AnimatedCounter.tsx`) |
| `textReveal` | mot par mot | titres héro / sections |
| `marquee` | boucle continue | ticker (déjà) |
| `parallaxY` | vitesses différentes au scroll | héro, blocs image |
| `exitFade` | sortie au démontage (AnimatePresence) | transitions de page |

### 2.2 Comportements globaux
- **Entrée au scroll PARTOUT** : chaque section wrap dans un observer `whileInView`, `once:true`, marge `-15%`.
- **Sortie** : transitions de **page** via `AnimatePresence mode="wait"` (exit fade + slight y). Éléments pinnés qui sortent en fondu.
- **Navbar** : shrink au scroll (déjà) + ligne d'accent qui progresse.
- **Curseur custom** : déjà en place (dot qui suit + vire émeraude sur hover) — on l'étend aux nouveaux éléments interactifs via `data-cursor`.
- **`prefers-reduced-motion`** : toutes les primitives dégradent proprement (déjà géré dans les composants existants).

### 2.3 Loader custom (NOUVEAU — « moderne, puissant »)
- Overlay plein écran au **premier chargement** + sur **transitions de route**.
- Concept : fond `--background`, monogramme **« S »** en `Space Grotesk` massif qui se **révèle en clipPath** ; sous lui une **barre de progression** fine émeraude ; micro-texte mono `> initializing…`.
- Sortie : l'overlay **remonte** (`inset` / `translateY`) en révélant la page (effet rideau).
- Techno : composant client monté dans le layout, piloté par un petit provider (état `loading`), + `loading.tsx` par route pour les segments serveur.
- Accessibilité : `aria-busy`, respecte reduced-motion (fondu simple).

---

## 3. Refonte SECTION PAR SECTION (Home)

Rythme de fonds (free-flow, transitions par couleur) :
`Hero (off-white) → Stats (off-white) → About (blanc) → Ticker (sombre) → Services (off-white) → Terminal (sombre) → Value (blanc) → Projets (off-white) → Process (blanc) → FAQ (off-white) → Contact (sombre)`

### 3.1 Hero
- Layout éditorial : **titre massif à gauche** (display, `textReveal` mot par mot), à droite portrait qui **bleed** (radius 0) avec `revealClip`. Le cercle tournant devient un **filet mono** discret autour du portrait (moins « gadget »).
- Sous-titre : rôle + localisation en label mono. 2 CTA (primaire émeraude + ghost).
- Parallaxe légère du portrait au scroll. Filets d'accent conservés mais plus fins.

### 3.2 Stats (Banner)
- Fin des « strips » de largeurs fixes. → **4 chiffres qui flottent** dans l'espace (pas de boîtes), `countUp` + `scaleIn`, label mono dessous. Séparateurs verticaux 1px `--border` seulement.
- Carte « disponible » : radius 0, sans ombre, point pulsé émeraude conservé.

### 3.3 About (preview)
- 2 colonnes : image qui **bleed** au bord (radius 0, `revealClip`) + texte. Titre display. Highlights en liste avec **tiret émeraude** (pas de puces rondes).

### 3.4 Ticker
- Conservé (marquee) mais sur **fond sombre** (`#0F0F0C`), texte off-white, séparateur `·` émeraude. Transition douce depuis About.

### 3.5 Services
- Colonne gauche **sticky** (label + titre display + intro). Droite : **lignes de service** séparées par whitespace (pas de bordures), grand **numéro fantôme** en fond, hover = nom glisse +8px & vire émeraude, flèche animée. `stagger` à l'entrée.

### 3.6 Terminal Showcase
- Sur fond sombre, fenêtre terminal radius 2px, lignes qui s'écrivent (`stagger`). Annotations latérales en label mono. Déjà proche — on aligne au system.

### 3.7 Value Cards
- 3 blocs **sans bordure ni ombre** sur fond blanc — contraste + label mono + titre. Hover `scale(1.02)`. `stagger`.

### 3.8 Projets (voir §4)

### 3.9 Process
- 4 steps horizontaux reliés par **un seul filet** 2px `--border` (structurel). Numéros display géants en fond. Entrée séquentielle. Radius 0.

### 3.10 FAQ
- Accordéon `details/summary` (déjà, zéro-JS) — séparateur 1px `--border` uniquement, numéro mono, chevron animé. Titre display.

### 3.11 Contact (bloc home) → renvoie vers page /contact refondue (voir §6).

---

## 4. PROJETS — logique + refonte

### 4.1 Aperçu (carte)
- **Avec lien** → **preview live** du vrai site (mShots, runtime) — déjà en place (Batch 1).
- **Sans lien** → **schéma du projet** = `ProjectGraph` (composant existant) rendu à la place de l'image. (Aujourd'hui déjà : `src` absent ⇒ `ProjectGraph`. On s'assure que les projets sans lien n'ont PAS d'`image` placeholder, pour tomber sur le schéma.)
- Carte : radius 2px→**0/2px**, **sans ombre**, hover `scale(1.02)` + barre d'accent latérale (déjà). Chip catégorie carré.

### 4.2 Page projet `/project/[slug]`
- **Hero projet** : image/preview qui bleed en pleine largeur + titre display en overlay, méta (date, catégories, **stack**) en labels mono. Radius 0.
- Corps : contenu Markdown (déjà riche — Batch 1) avec `border-left` 3px émeraude sur les citations, titres display, rythme de lecture soigné.
- Bloc **stack technique** en puces carrées. Lien « Voir le projet » (si dispo).
- Projets liés en bas.

### 4.3 Correctifs STACK (factuels — à appliquer au seed)
| Projet | Stack CORRIGÉE |
|---|---|
| **societe.cg** | **WordPress** |
| **bralima.net** | **WordPress** |
| **ordre des pharmaciens** | **WordPress** |
| **io life science** | **WordPress** (+ infra/DevOps : provisioning, Coolify, Nginx) |
| **Civis (CMS)** | **Strapi + Next.js** |
| **Focus Suite** | **NestJS + Next.js + OpenFGA** |
| Nutrisports / Retailix / Societe | à confirmer (par défaut : WordPress si vitrine/e-comm WP, sinon Next/Nest) |

> ⚠️ Les stacks que j'avais générées (Next/Nest partout) étaient fausses pour les sites WordPress. Corrigées ci-dessus + à refléter dans le **contenu** des case-studies.

---

## 5. EXPÉRIENCES — dédup + pages détail

### 5.1 Déduplication
- Source unique = **LinkedIn** (10 postes). Vérifier qu'aucune n'apparaît en double (ex. Ministère e-Bourse vs Ministère alternance = **2 postes distincts**, OK ; s'assurer qu'il n'y a pas de doublon d'`id`/slug). Un seul enregistrement par (entreprise + période).

### 5.2 Page liste `/experience` (refonte)
- **Timeline éditoriale** : filet vertical 2px `--accent` (structurel), chaque poste = entrée `fadeInUp` : période mono à gauche, entreprise+rôle display, courte accroche, tags stack carrés, lien « Détails → ».
- Postes actuels mis en avant (badge « En cours »).

### 5.3 Pages détail `/experience/[id]` (NOUVEAU)
- Évite l'affichage tassé des données. Chaque poste a sa page :
  - Hero : entreprise + rôle (display), période, lieu, badge statut.
  - Sections : **Contexte**, **Ce que j'ai fait** (bullets), **Réalisations** (ex. les projets Nanocreatives reliés), **Stack**.
  - CTA contact.
- Data : le modèle `Experience` a déjà `description`, `skills`, etc. On ajoute éventuellement un `content` (Markdown) optionnel pour le détail (migration mineure) OU on structure la description. → **à décider** (voir Questions).

---

## 6. Page CONTACT (refonte)

- Split **60/40** sans bordure de séparation : formulaire à gauche, infos à droite.
- **Inputs plats** : fond `#F0EFEA`, radius 0, `border-bottom` 1.5px → émeraude au focus, label mono flottant.
- Champs pilotés par `ContactField` (déjà dynamique). Bouton primaire carré. Message « Réponse sous 24h » en label émeraude.
- Infos : email, réseaux (label mono), dispo — texte net, **pas de cartes**.
- Entrée `stagger` des champs.

---

## 7. Rewriting (extraits — ton éditorial, FR)

- **Hero** : « Architecte logiciel & ingénieur full-stack. Je conçois des systèmes fiables, sécurisés et à l'échelle — du mobile à l'infrastructure. »
- **Services** : titres courts + une phrase qui vend le bénéfice, pas la techno.
- **Projets** : case-studies déjà réécrites (Batch 1) — **corriger les stacks** (WordPress / Strapi / OpenFGA) dans le texte.
- **Process** : Analyse → Architecture → Développement → Livraison, une phrase chacun.
- **FAQ / About / Contact** : conservés/affinés au ton éditorial.
> Le rewriting complet section par section est détaillé au fil de l'implémentation de chaque batch.

---

## 8. Plan d'implémentation (batches) — après validation de ce spec

- **B2 — Fondations motion + Loader** : primitives motion centralisées, `PageTransition` (exit), **loader custom**, radius global → 0/2px (purge des `rounded-*`), tokens.
- **B3 — Hero + Stats + About** (home haut).
- **B4 — Services + Terminal + Value + Process + FAQ** (home bas).
- **B5 — Projets** : cartes (lien→preview / sans lien→schéma), page projet, **stacks corrigées**.
- **B6 — Expériences** : dédup, page liste timeline, **pages détail**.
- **B7 — Contact** : refonte formulaire plat + infos.
- **B8 — Passe finale** : cohérence, contrastes, accessibilité, perf, QA.

Chaque batch = commit + PR + merge → visible sur le déploiement pour validation.

---

## 9. Questions ouvertes (à trancher avant B2)
1. **Expériences détail** : on ajoute un champ `content` (Markdown) au modèle `Experience` (migration) pour un vrai contenu détaillé, ou on se contente de structurer `description` + `skills` ? *(reco : ajouter `content` optionnel.)*
2. **Stacks** Nutrisports / Retailix / Societe.cg : WordPress aussi, ou Next/Nest ? (préciser)
3. **Fond sombre** pour Ticker/Terminal/Contact : OK pour ce rythme clair→sombre, ou tout garder clair ?
4. **Loader** : monogramme « S » — ok, ou vous préférez le mot « SLAEGA » / autre ?
