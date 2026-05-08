/**
 * Carte décorative de la République du Congo (Congo-Brazzaville) avec ses 12 départements.
 * Positionnée en bas de la sidebar, partiellement visible.
 *
 * Départements :
 *  Sangha · Likouala · Cuvette · Cuvette-Ouest · Plateaux
 *  Niari · Lékoumou · Bouenza · Pool · Kouilou · Brazzaville · Pointe-Noire
 */
export default function CongoBadge() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden"
      style={{ height: '200px' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 165 215"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
        style={{
          position: 'absolute',
          bottom: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '195px',
          opacity: 0.28,
        }}
      >
        <defs>
          {/* Clip à la silhouette du pays */}
          <clipPath id="rcb-outline">
            <path d={OUTLINE} />
          </clipPath>
        </defs>

        {/* ── Fond plein (vert drapeau RdC) ── */}
        <path d={OUTLINE} fill="#009A00" />

        {/* ── Lignes de départements ── */}
        <g
          clipPath="url(#rcb-outline)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.8"
          fill="none"
          strokeLinejoin="round"
        >
          {DEPT_LINES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* ── Légère teinte alternée par département ── */}
        <g clipPath="url(#rcb-outline)" fillOpacity="0.06">
          {DEPT_FILLS.map(({ d, fill }, i) => (
            <path key={i} d={d} fill={fill} />
          ))}
        </g>

        {/* ── Contour extérieur ── */}
        <path
          d={OUTLINE}
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* ── Labels des départements ── */}
        <g
          fontSize="5"
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
          fill="rgba(255,255,255,0.82)"
          textAnchor="middle"
        >
          {DEPT_LABELS.map(({ x, y, name }) => (
            <text key={name} x={x} y={y}>{name}</text>
          ))}
        </g>

        {/* ── Capitales (points) ── */}
        <g fill="rgba(255,255,255,0.9)">
          {CAPITALS.map(({ x, y, name }) => (
            <circle key={name} cx={x} cy={y} r="1.8" />
          ))}
        </g>

        {/* ── Brazzaville (capitale nationale, point plus grand) ── */}
        <circle cx={BZVILLE.x} cy={BZVILLE.y} r="3" fill="#FBDE4A" opacity="0.9" />
        <circle cx={BZVILLE.x} cy={BZVILLE.y} r="1.4" fill="white" />

        {/* ── Étiquette pays ── */}
        <text
          x="82"
          y="210"
          fontSize="6.5"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fill="rgba(255,255,255,0.55)"
          textAnchor="middle"
          letterSpacing="2"
        >
          CONGO
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Silhouette extérieure – République du Congo (Congo-Brazzaville)
// viewBox 0 0 165 215 — nord en haut.
//
// Repères géographiques clés :
//  • Frontière N avec le Cameroun : coin NW (~46,26) → coin NE (~158,10)
//  • Frontière NE/E avec la RCA puis fleuve Oubangui : côté droit, sinueux
//  • Fleuve Congo : frontière SE jusqu'à Brazzaville (~130,165)
//  • Côte Atlantique (Kouilou / Pointe-Noire) : SW, très courte (~10,185→28,215)
//  • Frontière O avec le Gabon : concave, côté gauche
// ─────────────────────────────────────────────────────────────────────────────
const OUTLINE = `
  M 46,26
  C 62,18 82,12 102,10
  C 118,8  138,7  158,10
  C 165,14 167,26 164,40
  C 162,54 158,68 154,82
  C 150,96 145,110 140,123
  C 134,137 125,150 115,160
  C 107,168 98,174 87,176
  C 76,178 65,175 55,168
  C 44,160 36,148 29,133
  C 22,117 17,100 15,82
  C 13,64  14,48  18,36
  C 23,26  34,22  46,26
  Z
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
// Lignes internes des frontières de département (approximatives)
//
// Découpages principaux :
//  Bande nord  (y ≈ 10–80) : Sangha (W) | Likouala (E)  — séparateur x≈100
//  Bande milieu (y ≈ 80–130) : Cuvette-Ouest | Cuvette | Plateaux
//  Bande sud   (y ≈ 130–170) : Niari | Lékoumou | Bouenza | Pool
//  Bande littorale (y ≈ 170–210) : Kouilou + PNR | Pool-bas | Brazzaville
// ─────────────────────────────────────────────────────────────────────────────
const DEPT_LINES: string[] = [
  // ── Bande nord → milieu (y≈80) ─────────────────────────────────────────
  // Limite horizontale Sangha+Likouala / bande milieu
  `M 15,82 C 40,80 68,80 98,80 C 118,80 140,82 154,82`,

  // Séparateur Sangha | Likouala (vertical ≈ x=100, du nord vers y=80)
  `M 100,10 C 100,30 100,55 98,80`,

  // ── Bande milieu (y≈80 → y≈130) ────────────────────────────────────────
  // Limite milieu / bande sud
  `M 18,130 C 40,128 62,128 87,130 C 108,132 128,132 140,123`,

  // Séparateur Cuvette-Ouest | Cuvette (x≈58)
  `M 56,80 C 56,100 56,118 56,130`,

  // Séparateur Cuvette | Plateaux (x≈104)
  `M 100,80 C 102,100 104,116 105,130`,

  // ── Bande sud (y≈130 → y≈170) ──────────────────────────────────────────
  // Séparateur Niari | Lékoumou (x≈57)
  `M 56,130 C 56,145 56,158 57,168`,

  // Séparateur Lékoumou | Bouenza (x≈85)
  `M 87,130 C 86,145 85,158 86,170`,

  // Séparateur Bouenza | Pool (x≈110)
  `M 105,130 C 108,142 110,155 112,165`,

  // ── Bande littorale (y≈170 → bas) ──────────────────────────────────────
  // Limite basse / littorale (de gauche, NW du Pool vers Brazzaville)
  `M 29,168 C 42,170 57,170 70,170 C 84,170 100,168 112,165`,

  // Séparateur Kouilou | Pool-bas (x≈57, y≈170–210)
  `M 57,168 C 54,182 50,196 46,210`,

  // Séparateur Pool-bas | Brazzaville (x≈112, y≈165–200)
  `M 112,165 C 116,175 120,185 122,198`,

  // Pointe-Noire (petite entité côtière, ligne courte)
  `M 20,185 C 26,183 36,182 46,183`,
];

// ─────────────────────────────────────────────────────────────────────────────
// Fills légers pour alterner visuellement les départements
// ─────────────────────────────────────────────────────────────────────────────
const DEPT_FILLS: { d: string; fill: string }[] = [
  // Sangha
  { fill: '#ffffff', d: `M 18,36 C 23,26 34,22 46,26 C 62,18 82,12 100,10 L 98,80 C 68,80 40,80 15,82 Z` },
  // Likouala
  { fill: '#000000', d: `M 100,10 C 118,8 138,7 158,10 C 165,14 167,26 164,40 C 162,54 158,68 154,82 L 98,80 Z` },
  // Cuvette-Ouest
  { fill: '#000000', d: `M 15,82 C 40,80 56,80 56,80 L 56,130 C 40,128 28,132 18,130 Z` },
  // Cuvette
  { fill: '#ffffff', d: `M 56,80 C 68,80 100,80 100,80 L 105,130 C 87,130 56,130 56,130 Z` },
  // Plateaux
  { fill: '#000000', d: `M 100,80 C 118,80 140,82 154,82 C 150,96 145,110 140,123 L 105,130 Z` },
  // Niari
  { fill: '#ffffff', d: `M 18,130 C 40,128 56,128 56,130 L 57,168 C 45,164 36,155 29,142 C 22,132 18,130 18,130 Z` },
  // Lékoumou
  { fill: '#000000', d: `M 56,130 C 68,128 87,130 87,130 L 86,170 C 70,170 57,168 57,168 Z` },
  // Bouenza
  { fill: '#ffffff', d: `M 87,130 C 100,130 105,130 105,130 L 112,165 C 100,168 86,170 86,170 Z` },
  // Pool
  { fill: '#000000', d: `M 105,130 C 118,132 128,132 140,123 C 134,137 125,150 115,160 C 112,163 112,165 112,165 L 86,170 Z` },
  // Kouilou + PNR
  { fill: '#ffffff', d: `M 29,168 C 42,170 57,168 57,168 L 46,210 C 32,212 18,205 14,192 C 14,180 20,170 29,168 Z` },
  // Brazzaville
  { fill: '#000000', d: `M 112,165 C 115,160 115,160 115,160 C 125,150 134,137 140,123 C 145,137 150,152 155,168 C 145,176 132,180 122,198 L 112,165 Z` },
];

// ─────────────────────────────────────────────────────────────────────────────
// Labels des 12 départements (abrégés pour tenir dans la carte)
// ─────────────────────────────────────────────────────────────────────────────
const DEPT_LABELS: { x: number; y: number; name: string }[] = [
  { x: 52,  y: 50,  name: 'SANGHA'       },
  { x: 128, y: 48,  name: 'LIKOUALA'     },
  { x: 36,  y: 106, name: 'CUV.-OUEST'  },
  { x: 78,  y: 105, name: 'CUVETTE'      },
  { x: 128, y: 106, name: 'PLATEAUX'     },
  { x: 36,  y: 150, name: 'NIARI'        },
  { x: 70,  y: 152, name: 'LÉKOUMOU'    },
  { x: 97,  y: 152, name: 'BOUENZA'      },
  { x: 124, y: 148, name: 'POOL'         },
  { x: 38,  y: 190, name: 'KOUILOU'      },
  { x: 25,  y: 200, name: 'P.-NOIRE'     },
  { x: 130, y: 182, name: 'BZV'          },
];

// ─────────────────────────────────────────────────────────────────────────────
// Capitales / chefs-lieux de département
// ─────────────────────────────────────────────────────────────────────────────
const CAPITALS: { x: number; y: number; name: string }[] = [
  { x: 44,  y: 52,  name: 'Ouesso'     }, // Sangha
  { x: 130, y: 42,  name: 'Impfondo'   }, // Likouala
  { x: 35,  y: 108, name: 'Ewo'        }, // Cuvette-Ouest
  { x: 76,  y: 108, name: 'Owando'     }, // Cuvette
  { x: 124, y: 108, name: 'Djambala'   }, // Plateaux
  { x: 34,  y: 148, name: 'Dolisie'    }, // Niari
  { x: 69,  y: 152, name: 'Sibiti'     }, // Lékoumou
  { x: 95,  y: 152, name: 'Madingou'   }, // Bouenza
  { x: 119, y: 148, name: 'Kinkala'    }, // Pool
  { x: 37,  y: 185, name: 'Pointe-N.'  }, // Kouilou/PNR
];

// Brazzaville — capitale nationale (traitement spécial, point jaune)
const BZVILLE = { x: 130, y: 165, name: 'Brazzaville' };
