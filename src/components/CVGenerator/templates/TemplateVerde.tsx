/**
 * Template VERDE — Forêt verte foncée (#00332E) + cyan (#00FFE5)
 *
 * Inspiré du design A4-1.svg
 *
 * Layout (A4 portrait) :
 *   Header : photo top-left (149×180 area) + identité + contact right
 *   Band   : bande sage (#C1CFCE) pleine largeur — séparateur visuel
 *   Body   : gauche 38% (summary, capabilities, skills) | droite (experience, projects)
 *
 * ⚠️ Ce template utilise des couleurs fixes — palette non appliquée.
 */
import {
  Page, Document, View, Text, Image, StyleSheet, Svg, Rect, Circle, Path,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; sections: CVSections };

// ── Palette fixe verde-cyan ────────────────────────────────────────────────────
const FOREST  = "#00332E";   // primary dark (header, sidebar)
const FOREST2 = "#004d45";   // slightly lighter forest
const CYAN    = "#00FFE5";   // accent
const SAGE    = "#C1CFCE";   // muted sage (band, subtle)
const WHITE   = "#ffffff";
const OFF     = "#f7faf9";   // page background
const MUTED   = "#6d8884";
const TEXT    = "#1a2e2c";   // dark text

// ── Leaf / branch ornament SVG ────────────────────────────────────────────────
function LeafMark({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" style={{ display: "flex" }}>
      {/* Stem */}
      <Path d="M10,18 L10,8" stroke={CYAN} strokeWidth="1.2" fill="none" />
      {/* Leaf 1 */}
      <Path d="M10,10 Q6,6 8,2 Q12,5 10,10" fill={FOREST2} stroke={CYAN} strokeWidth="0.5" />
      {/* Leaf 2 */}
      <Path d="M10,13 Q14,9 16,11 Q13,15 10,13" fill={FOREST2} stroke={CYAN} strokeWidth="0.5" />
      {/* Root dot */}
      <Circle cx="10" cy="18" r="1" fill={CYAN} />
    </Svg>
  );
}

// ── Hexagon marker ────────────────────────────────────────────────────────────
function HexDot({ size = 7, color = CYAN }: { size?: number; color?: string }) {
  const r = size / 2;
  const x = r;
  const y = r;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${x + r * 0.85 * Math.cos(a)},${y + r * 0.85 * Math.sin(a)}`;
  }).join(" ");
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "flex" }}>
      <Path d={`M${pts}Z`} fill={color} />
    </Svg>
  );
}

export default function TemplateVerde({ data, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const tagline = sections.tagline.text ?? data.tagline ?? "";
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: OFF, fontFamily: "Helvetica" },

    /* ── Header ── */
    header: { flexDirection: "row", height: 160, backgroundColor: FOREST },

    /* Photo side */
    photoWrap: { width: 145, height: 160, overflow: "hidden", position: "relative" },
    photo: { width: 145, height: 160, objectFit: "cover" },
    /* Cyan tint overlay */
    photoOverlay: {
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: CYAN, opacity: 0.12,
    },

    /* Identity side */
    identity: {
      flex: 1, paddingLeft: 20, paddingRight: 16,
      paddingTop: 18, paddingBottom: 12,
      justifyContent: "center",
    },
    identName: {
      fontSize: 20, fontFamily: "Helvetica-Bold", color: WHITE,
      letterSpacing: -0.3, lineHeight: 1.15, marginBottom: 2,
    },
    identJob: {
      fontSize: 8.5, color: CYAN, fontFamily: "Helvetica-Bold",
      letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8,
    },
    identTagline: {
      fontSize: 7.5, color: SAGE, fontFamily: "Helvetica-Oblique",
      lineHeight: 1.4, marginBottom: 10,
    },
    contactRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
    contactDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: CYAN },
    contactText: { fontSize: 7, color: "rgba(255,255,255,0.75)" },

    /* Ornament placement */
    ornamentWrap: {
      position: "absolute", top: 12, right: 14,
    },

    /* ── Sage band ── */
    band: { height: 8, backgroundColor: SAGE },
    cyanBar: { height: 2, backgroundColor: CYAN },

    /* ── Body ── */
    body: { flexDirection: "row", flex: 1 },

    /* Left col */
    bodyLeft: {
      width: "38%",
      backgroundColor: WHITE,
      borderRightWidth: 1, borderRightColor: "#dde8e6", borderRightStyle: "solid",
      paddingTop: 16, paddingHorizontal: 15, paddingBottom: 16,
    },

    /* Right col */
    bodyRight: {
      flex: 1, paddingTop: 16, paddingHorizontal: 18, paddingBottom: 16,
    },

    /* Section titles */
    secTitle: {
      fontSize: 7.5, fontFamily: "Helvetica-Bold", color: FOREST,
      textTransform: "uppercase", letterSpacing: 1.6,
      marginBottom: 2, marginTop: 12,
    },
    secDivider: { height: 0.5, backgroundColor: SAGE, marginBottom: 8 },

    /* Summary */
    summaryText: { fontSize: 7.5, color: TEXT, lineHeight: 1.55 },

    /* Capabilities */
    capItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4, gap: 5 },
    capText: { fontSize: 7.5, color: TEXT, flex: 1, lineHeight: 1.4 },

    /* Skills */
    skillsGrid: { flexDirection: "row", gap: 6 },
    skillCol: { flex: 1, flexDirection: "column", gap: 2.5 },
    skillItem: { fontSize: 7, color: MUTED },
    skillItemRel: { fontSize: 7, color: FOREST, fontFamily: "Helvetica-Bold" },

    /* Experience */
    expItem: { marginBottom: 10 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    expRole: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: FOREST, flex: 1 },
    expDate: { fontSize: 6.5, color: MUTED, fontFamily: "Helvetica-Oblique", flexShrink: 0, marginLeft: 4 },
    expCompany: { fontSize: 7, color: FOREST2, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    expDesc: { fontSize: 7, color: TEXT, lineHeight: 1.5 },
    expBorder: {
      paddingLeft: 8,
      borderLeftWidth: 1.5, borderLeftColor: SAGE, borderLeftStyle: "solid",
    },

    /* Projects */
    projItem: { marginBottom: 7 },
    projRow: { flexDirection: "row", alignItems: "flex-start", gap: 5, marginBottom: 1 },
    projTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: FOREST },
    projDesc: { fontSize: 7, color: TEXT, lineHeight: 1.4 },
    projTags: { fontSize: 6.5, color: MUTED, marginTop: 1 },
  });

  /* Split skills into 2 cols */
  const half = Math.ceil(data.allSkills.length / 2);
  const skillLeft  = data.allSkills.slice(0, half);
  const skillRight = data.allSkills.slice(half);

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ HEADER ═══ */}
        <View style={s.header}>
          {/* Photo */}
          <View style={s.photoWrap}>
            <Image src={CV_PROFILE.photo} style={s.photo} />
            <View style={s.photoOverlay} />
          </View>

          {/* Identity */}
          <View style={s.identity}>
            <Text style={s.identName}>{CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}</Text>
            <Text style={s.identJob}>{data.jobTitle}</Text>
            {sections.tagline.visible && tagline ? (
              <Text style={s.identTagline}>{tagline.slice(0, 80)}{tagline.length > 80 ? '…' : ''}</Text>
            ) : null}
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

          {/* Leaf ornament — top right */}
          <View style={s.ornamentWrap}>
            <LeafMark size={28} />
          </View>
        </View>

        {/* ═══ BAND ═══ */}
        <View style={s.band} />
        <View style={s.cyanBar} />

        {/* ═══ BODY ═══ */}
        <View style={s.body}>

          {/* ── Left ── */}
          <View style={s.bodyLeft}>

            {/* Summary */}
            {sections.summary.visible && summary ? (
              <>
                <Text style={[s.secTitle, { marginTop: 0 }]}>Profil</Text>
                <View style={s.secDivider} />
                <Text style={s.summaryText}>{summary.slice(0, 280)}{summary.length > 280 ? '…' : ''}</Text>
              </>
            ) : null}

            {/* Capabilities */}
            {sections.capabilities.visible && caps.length > 0 && (
              <>
                <Text style={s.secTitle}>{L.canDo}</Text>
                <View style={s.secDivider} />
                {caps.slice(0, 6).map((c, i) => (
                  <View key={i} style={s.capItem}>
                    <HexDot size={7} color={CYAN} />
                    <Text style={s.capText}>{c}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Skills */}
            {sections.skills.visible && data.allSkills.length > 0 && (
              <>
                <Text style={s.secTitle}>{L.skills}</Text>
                <View style={s.secDivider} />
                <View style={s.skillsGrid}>
                  <View style={s.skillCol}>
                    {skillLeft.map((sk) => {
                      const rel = data.relevantSkills.includes(sk);
                      return <Text key={sk} style={rel ? s.skillItemRel : s.skillItem}>▸ {sk}</Text>;
                    })}
                  </View>
                  <View style={s.skillCol}>
                    {skillRight.map((sk) => {
                      const rel = data.relevantSkills.includes(sk);
                      return <Text key={sk} style={rel ? s.skillItemRel : s.skillItem}>▸ {sk}</Text>;
                    })}
                  </View>
                </View>
              </>
            )}
          </View>

          {/* ── Right ── */}
          <View style={s.bodyRight}>

            {/* Experience */}
            {sections.experience.visible && data.experiences.length > 0 && (
              <>
                <Text style={[s.secTitle, { marginTop: 0 }]}>{L.experience}</Text>
                <View style={s.secDivider} />
                {data.experiences.map((exp) => (
                  <View key={exp.id} style={[s.expItem, s.expBorder]}>
                    <View style={s.expHeader}>
                      <Text style={s.expRole}>{exp.role}</Text>
                      <Text style={s.expDate}>
                        {formatMonth(exp.startDate, false, lang, L.present)} – {formatMonth(exp.endDate, exp.current, lang, L.present)}
                      </Text>
                    </View>
                    <Text style={s.expCompany}>
                      {exp.company}{exp.location ? `  ·  ${exp.location}` : ""}
                    </Text>
                    <Text style={s.expDesc}>{stripHtml(exp.description)}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Projects */}
            {sections.projects.visible && data.projects.length > 0 && (
              <>
                <Text style={s.secTitle}>{L.projects}</Text>
                <View style={s.secDivider} />
                {data.projects.slice(0, 4).map((p) => (
                  <View key={p.slug} style={s.projItem}>
                    <View style={s.projRow}>
                      <HexDot size={6} color={FOREST2} />
                      <Text style={s.projTitle}>{p.title}</Text>
                    </View>
                    <Text style={s.projDesc}>{stripHtml(p.desc)}</Text>
                    {p.tags.length > 0 && (
                      <Text style={s.projTags}>{p.tags.slice(0, 5).join(" · ")}</Text>
                    )}
                  </View>
                ))}
              </>
            )}

          </View>
        </View>

      </Page>
    </Document>
  );
}
