/**
 * Template MOSAIC — Fond mosaïque bleu fixe (pas de palette)
 *
 * Header : mosaïque bleue (gauche) + identité + contact (droite)
 * Body   : sidebar sombre (compétences) | main blanc (expériences, projets)
 *
 * ⚠️ Ce template utilise des couleurs fixes — la palette n'est PAS appliquée.
 */
import {
  Page, Document, View, Text, Image, StyleSheet, Svg, Rect,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; sections: CVSections };

// ── Fixed blue palette ────────────────────────────────────────────────────────
const BLUE_DARK   = "#0a1f5e";   // sidebar bg, header text
const BLUE_MED    = "#2855b8";   // accent, section titles
const BLUE_LIGHT  = "#4a7de4";   // accent light
const BLUE_PALE   = "#b8cef5";   // tile base
const WHITE       = "#ffffff";
const OFF_WHITE   = "#f8faff";   // page bg
const BORDER      = "#dde8fb";

// ── Mosaic SVG (deterministic — no Math.random) ───────────────────────────────
const SHADES = [
  "#b8cef5", "#c8d9f7", "#9ab8f0", "#d8e7fb",
  "#aac5f3", "#e0ecfc", "#bad2f6", "#cde0f8",
  "#7aa2eb", "#8ab1ee", "#d0e5fb", "#e8f2fd",
];

// Pre-baked grid parameters (deterministic)
const GRID_COLS = 5;
const GRID_ROWS = 14;

function MosaicSvg({ width, height }: { width: number; height: number }) {
  const tw = width  / GRID_COLS;
  const th = height / GRID_ROWS;

  // Deterministic offsets & color indices (no random)
  const DX = [ 0,  0.18, -0.12,  0.22,  0.05, -0.18,  0.10,  0.28, -0.08,  0.15,  0.25, -0.05,  0.12, -0.20];
  const DY = [ 0.05, -0.08, 0.15, -0.10, 0.02, 0.18, -0.05, 0.08, -0.15, 0.12, -0.02, 0.20, -0.18, 0.04];
  const CI = [ 0, 2, 4, 1, 3, 5, 6, 2, 0, 4, 7, 3, 8, 1, 5, 9, 2, 6, 10, 0, 3, 11, 4, 7, 1, 5, 8, 2, 9, 6];

  const tiles: { x: number; y: number; w: number; h: number; fill: string; op: number }[] = [];

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const idx = r * GRID_COLS + c;
      const ci  = CI[idx % CI.length];
      // Opacity fades from ~0.95 at top to ~0.15 at bottom
      const fade = 1 - (r / (GRID_ROWS - 1)) * 0.82;
      const op   = Math.max(0.12, fade - (c % 3) * 0.07);
      const dx   = DX[r % DX.length] * tw;
      const dy   = DY[c % DY.length] * th;

      tiles.push({
        x:  c * tw + dx,
        y:  r * th + dy,
        w:  tw * 0.84,
        h:  th * 0.84,
        fill: SHADES[ci],
        op,
      });
    }
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Rect x={0} y={0} width={width} height={height} fill={BLUE_DARK} />
      {tiles.map((t, i) => (
        <Rect key={i} x={t.x} y={t.y} width={t.w} height={t.h} fill={t.fill} opacity={t.op} rx={3} />
      ))}
    </Svg>
  );
}

// ── Section marker (sun/star style) ──────────────────────────────────────────
function SectionMarker() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      {[0, 45, 90, 135].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1  = 6 + Math.cos(rad) * 5;
        const y1  = 6 + Math.sin(rad) * 5;
        const x2  = 6 - Math.cos(rad) * 5;
        const y2  = 6 - Math.sin(rad) * 5;
        return <Rect key={deg} x={x2 - 0.4} y={y2 - 0.4} width={x1 - x2 + 0.8} height={0.8} fill={BLUE_MED} rx={0.4} />;
      })}
      <Rect x={4} y={4} width={4} height={4} fill={BLUE_MED} rx={1} />
    </Svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TemplateMosaic({ data, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const tagline = sections.tagline.text ?? data.tagline ?? "";
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: OFF_WHITE, fontFamily: "Helvetica" },

    /* ── TOP HEADER ── */
    header: { flexDirection: "row", height: 148 },
    mosaicCol: { width: "38%" },   // mosaic fills this column entirely
    identityCol: {
      flex: 1, backgroundColor: BLUE_DARK,
      paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12,
      justifyContent: "center",
    },
    photoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
    photo: {
      width: 52, height: 52, borderRadius: 26, objectFit: "cover",
      borderWidth: 2, borderColor: BLUE_LIGHT, borderStyle: "solid",
    },
    nameBlock: { flex: 1 },
    headerName: {
      fontSize: 14, fontFamily: "Helvetica-Bold",
      color: WHITE, letterSpacing: -0.2, lineHeight: 1.15, marginBottom: 2,
    },
    headerJob: {
      fontSize: 7.5, color: BLUE_PALE,
      fontFamily: "Helvetica-Bold", letterSpacing: 1.2, textTransform: "uppercase",
    },
    contactRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
    contactDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: BLUE_LIGHT },
    contactText: { fontSize: 7, color: "rgba(255,255,255,0.75)" },

    /* ── BODY ── */
    body: { flexDirection: "row", flex: 1 },

    /* Sidebar */
    sidebar: {
      width: "38%", backgroundColor: BLUE_DARK,
      paddingTop: 14, paddingHorizontal: 14, paddingBottom: 20,
    },
    sSecLabel: {
      fontSize: 6, fontFamily: "Helvetica-Bold", color: BLUE_PALE,
      letterSpacing: 2, textTransform: "uppercase", marginBottom: 7,
    },
    sDivider: { height: 0.5, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 10 },

    /* Skills with dots */
    skRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
    skName: { fontSize: 7.5, color: WHITE, flex: 1 },
    skDots: { flexDirection: "row", gap: 3 },

    /* Caps */
    capItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
    capBullet: { width: 3, height: 3, backgroundColor: BLUE_LIGHT, borderRadius: 1.5, marginTop: 3.5, marginRight: 6, flexShrink: 0 },
    capText: { fontSize: 7.5, color: "rgba(255,255,255,0.75)", flex: 1, lineHeight: 1.45 },

    /* ── Main ── */
    main: {
      flex: 1, backgroundColor: WHITE,
      paddingTop: 14, paddingHorizontal: 20, paddingBottom: 20,
    },

    /* Section heading (marker + title + line) */
    secRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, marginTop: 6 },
    secLine: { flex: 1, height: 0.5, backgroundColor: BORDER },
    secLabel: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: BLUE_DARK },

    /* Bio/summary */
    bio: { fontSize: 8, color: "#555", lineHeight: 1.55, marginBottom: 10 },

    /* Jobs */
    job:     { marginBottom: 10, paddingLeft: 10, borderLeftWidth: 1.5, borderLeftColor: BORDER, borderLeftStyle: "solid" },
    jobDot:  { width: 5, height: 5, backgroundColor: BLUE_MED, borderRadius: 1, marginLeft: -13.5, marginBottom: 2, flexShrink: 0 },
    jobTop:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    jobName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: BLUE_DARK, flex: 1 },
    jobDate: { fontSize: 6.5, color: "#aaa", fontFamily: "Helvetica-Oblique", flexShrink: 0, marginLeft: 4 },
    jobCo:   { fontSize: 7.5, color: BLUE_MED, fontFamily: "Helvetica-Bold", letterSpacing: 0.3, marginBottom: 3 },
    jobDesc: { fontSize: 7.5, color: "#555", lineHeight: 1.5 },
    jobTags: { fontSize: 6.5, color: "#aaa", fontFamily: "Helvetica-Oblique", marginTop: 2 },

    /* Skills in main */
    chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    chip: {
      paddingHorizontal: 6, paddingVertical: 2.5, borderRadius: 3,
      borderWidth: 1, borderColor: BORDER, borderStyle: "solid",
    },
    chipHL: {
      paddingHorizontal: 6, paddingVertical: 2.5, borderRadius: 3,
      backgroundColor: BLUE_MED + "18",
    },
    chipText:   { fontSize: 6.5, color: "#666" },
    chipTextHL: { fontSize: 6.5, color: BLUE_MED, fontFamily: "Helvetica-Bold" },
  });

  function SkillDots({ filled }: { filled: number }) {
    return (
      <View style={s.skDots}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: i <= filled ? BLUE_LIGHT : "rgba(255,255,255,0.15)",
          }} />
        ))}
      </View>
    );
  }

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ HEADER ═══ */}
        <View style={s.header}>
          {/* Mosaic column — full height of header */}
          <View style={s.mosaicCol}>
            <MosaicSvg width={226} height={148} />
          </View>

          {/* Identity */}
          <View style={s.identityCol}>
            <View style={s.photoRow}>
              <Image src={CV_PROFILE.photo} style={s.photo} />
              <View style={s.nameBlock}>
                <Text style={s.headerName}>{CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}</Text>
                <Text style={s.headerJob}>
                  {sections.tagline.visible && tagline ? tagline : data.jobTitle}
                </Text>
              </View>
            </View>
            {sections.contact.visible && (
              <>
                <View style={s.contactRow}>
                  <View style={s.contactDot} />
                  <Text style={s.contactText}>{CV_PROFILE.email}</Text>
                </View>
                <View style={s.contactRow}>
                  <View style={s.contactDot} />
                  <Text style={s.contactText}>{CV_PROFILE.phone}</Text>
                </View>
                <View style={s.contactRow}>
                  <View style={s.contactDot} />
                  <Text style={s.contactText}>{CV_PROFILE.linkedin}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* ═══ BODY ═══ */}
        <View style={s.body}>

          {/* ── Sidebar ── */}
          <View style={s.sidebar}>

            {/* Capabilities */}
            {sections.capabilities.visible && caps.length > 0 && (
              <>
                <Text style={s.sSecLabel}>{L.canDo}</Text>
                {caps.map((c, i) => (
                  <View key={i} style={s.capItem}>
                    <View style={s.capBullet} />
                    <Text style={s.capText}>{c}</Text>
                  </View>
                ))}
                <View style={s.sDivider} />
              </>
            )}

            {/* Skills with dot ratings */}
            {sections.skills.visible && data.allSkills.length > 0 && (
              <>
                <Text style={s.sSecLabel}>{L.skills}</Text>
                {data.allSkills.slice(0, 12).map((sk) => (
                  <View key={sk} style={s.skRow}>
                    <Text style={s.skName}>{sk}</Text>
                    <SkillDots filled={data.relevantSkills.includes(sk) ? 3 : 2} />
                  </View>
                ))}
              </>
            )}
          </View>

          {/* ── Main ── */}
          <View style={s.main}>

            {/* Bio */}
            {sections.summary.visible && summary && (
              <Text style={s.bio}>{summary}</Text>
            )}

            {/* Experience */}
            {sections.experience.visible && data.experiences.length > 0 && (
              <>
                <View style={s.secRow}>
                  <SectionMarker />
                  <Text style={s.secLabel}>{L.experience}</Text>
                  <View style={s.secLine} />
                </View>
                {data.experiences.map((exp) => (
                  <View key={exp.id} style={s.job}>
                    <View style={s.jobDot} />
                    <View style={s.jobTop}>
                      <Text style={s.jobName}>{exp.role}</Text>
                      <Text style={s.jobDate}>
                        {formatMonth(exp.startDate, false, lang, L.present)} – {formatMonth(exp.endDate, exp.current, lang, L.present)}
                      </Text>
                    </View>
                    <Text style={s.jobCo}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                    </Text>
                    <Text style={s.jobDesc}>{stripHtml(exp.description)}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Projects */}
            {sections.projects.visible && data.projects.length > 0 && (
              <>
                <View style={s.secRow}>
                  <SectionMarker />
                  <Text style={s.secLabel}>{L.projects}</Text>
                  <View style={s.secLine} />
                </View>
                {data.projects.slice(0, 4).map((p) => (
                  <View key={p.slug} style={s.job}>
                    <View style={s.jobDot} />
                    <Text style={s.jobName}>{p.title}</Text>
                    <Text style={s.jobDesc}>{stripHtml(p.desc)}</Text>
                    {p.tags.length > 0 && (
                      <Text style={s.jobTags}>{p.tags.slice(0, 6).join(" · ")}</Text>
                    )}
                  </View>
                ))}
              </>
            )}

            {/* Skills chips in main */}
            {sections.skills.visible && data.allSkills.length > 0 && (
              <>
                <View style={s.secRow}>
                  <SectionMarker />
                  <Text style={s.secLabel}>{L.skills}</Text>
                  <View style={s.secLine} />
                </View>
                <View style={s.chipWrap}>
                  {data.allSkills.map((sk) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={sk} style={rel ? s.chipHL : s.chip}>
                        <Text style={rel ? s.chipTextHL : s.chipText}>{sk}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>
        </View>

      </Page>
    </Document>
  );
}
