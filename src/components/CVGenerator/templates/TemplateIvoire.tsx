/**
 * Template IVOIRE — Sidebar sombre (#1D1D1D) + accents crème (#FAF1D6)
 *
 * Inspiré du design cv-2/light/no-pic.svg
 *
 * Layout (A4 portrait) :
 *   Header : band crème pleine largeur (nom, titre, tagline) + contact inline
 *   Body   : sidebar gauche 27% (dark #1D1D1D) | main droite (blanc, sections)
 *
 * ⚠️ Ce template n'utilise PAS la CVPalette — couleurs fixes crème/sombre.
 */
import {
  Page, Document, View, Text, Image, StyleSheet, Svg, Rect, Line,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; sections: CVSections };

// ── Palette fixe crème-sombre ─────────────────────────────────────────────────
const DARK   = "#1D1D1D";
const CREAM  = "#FAF1D6";
const CREAM2 = "#F0E2B6";   // cream foncé pour hover/divider
const WHITE  = "#ffffff";
const MUTED  = "#888888";
const SUBTLE = "#444444";

// ── Decorative line cluster (SVG in-flow) ────────────────────────────────────
function LineCluster({ width = 48, color = CREAM2 }: { width?: number; color?: string }) {
  return (
    <Svg width={width} height={6} viewBox={`0 0 ${width} 6`} style={{ display: "flex" }}>
      <Line x1="0" y1="1.5" x2={width} y2="1.5" stroke={color} strokeWidth="1.5" />
      <Line x1="0" y1="4"   x2={width * 0.6} y2="4" stroke={color} strokeWidth="0.7" />
    </Svg>
  );
}

export default function TemplateIvoire({ data, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const tagline = sections.tagline.text     ?? data.tagline ?? "";
  const summary = sections.summary.text     ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: WHITE, fontFamily: "Helvetica" },

    /* ── Header band ── */
    header: {
      backgroundColor: CREAM,
      paddingHorizontal: 28,
      paddingTop: 22,
      paddingBottom: 14,
    },
    headerTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    headerLeft: { flex: 1 },
    headerName: {
      fontSize: 22, fontFamily: "Helvetica-Bold", color: DARK,
      letterSpacing: -0.5, lineHeight: 1.1,
    },
    headerJobTitle: {
      fontSize: 8.5, color: SUBTLE, letterSpacing: 1.8,
      textTransform: "uppercase", marginTop: 2,
    },
    headerTagline: {
      fontSize: 8, color: DARK, fontFamily: "Helvetica-Oblique",
      marginTop: 6, lineHeight: 1.4,
    },
    headerLogo: {
      width: 36, height: 36, borderRadius: 2,
      backgroundColor: DARK, marginLeft: 10,
      alignItems: "center", justifyContent: "center",
    },
    headerLogoInner: {
      width: 24, height: 24, borderRadius: 1,
      backgroundColor: CREAM2,
    },
    contactRow: {
      flexDirection: "row", gap: 16, marginTop: 10,
      flexWrap: "wrap",
    },
    contactItem: { flexDirection: "row", alignItems: "center", gap: 3 },
    contactDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: DARK },
    contactText: { fontSize: 7, color: SUBTLE },

    /* ── Body ── */
    body: { flexDirection: "row", flex: 1 },

    /* Sidebar */
    sidebar: {
      width: "27%",
      backgroundColor: DARK,
      paddingTop: 20,
      paddingHorizontal: 14,
      paddingBottom: 16,
    },
    sideSecTitle: {
      fontSize: 7, fontFamily: "Helvetica-Bold",
      color: CREAM, letterSpacing: 1.8,
      textTransform: "uppercase", marginBottom: 6,
    },
    sideDivider: { height: 0.5, backgroundColor: "rgba(250,241,214,0.2)", marginBottom: 8 },
    sideText: { fontSize: 7, color: "rgba(250,241,214,0.75)", lineHeight: 1.5 },
    sideCapItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5, gap: 5 },
    sideCapDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: CREAM2, marginTop: 2.5, flexShrink: 0 },

    skillChip: {
      borderWidth: 0.5, borderColor: "rgba(250,241,214,0.25)", borderStyle: "solid",
      borderRadius: 2, paddingHorizontal: 5, paddingVertical: 2,
      marginBottom: 3, marginRight: 3,
    },
    skillChipRel: {
      borderWidth: 0.5, borderColor: CREAM2, borderStyle: "solid",
      borderRadius: 2, paddingHorizontal: 5, paddingVertical: 2,
      backgroundColor: "rgba(250,241,214,0.08)",
      marginBottom: 3, marginRight: 3,
    },
    skillChipText: { fontSize: 6.5, color: "rgba(250,241,214,0.65)" },
    skillChipTextRel: { fontSize: 6.5, color: CREAM },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap" },

    /* Main */
    main: {
      flex: 1,
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    secTitle: {
      fontSize: 7.5, fontFamily: "Helvetica-Bold", color: DARK,
      textTransform: "uppercase", letterSpacing: 1.6, marginBottom: 2,
    },
    secDivider: { height: 0.5, backgroundColor: CREAM2, marginBottom: 9 },
    sectionGap: { marginTop: 14 },

    /* Experience */
    expItem: { marginBottom: 10 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    expRole: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: DARK, flex: 1 },
    expDate: { fontSize: 6.5, color: MUTED, fontFamily: "Helvetica-Oblique", marginLeft: 4, flexShrink: 0 },
    expCompany: { fontSize: 7, color: SUBTLE, marginBottom: 2 },
    expDesc: { fontSize: 7, color: "#555", lineHeight: 1.5 },
    expDot: {
      width: 5, height: 5, borderRadius: 2.5,
      backgroundColor: CREAM2, marginRight: 6, marginTop: 2.5, flexShrink: 0,
    },
    expRow: { flexDirection: "row", alignItems: "flex-start" },
    expContent: { flex: 1 },

    /* Projects */
    projItem: {
      marginBottom: 7,
      paddingLeft: 8,
      borderLeftWidth: 2, borderLeftColor: CREAM2, borderLeftStyle: "solid",
    },
    projTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: DARK },
    projDesc:  { fontSize: 7, color: "#555", lineHeight: 1.4 },
    projTags:  { fontSize: 6.5, color: MUTED, marginTop: 1 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ HEADER ═══ */}
        <View style={s.header}>
          <View style={s.headerTopRow}>
            <View style={s.headerLeft}>
              <Text style={s.headerName}>{CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}</Text>
              <Text style={s.headerJobTitle}>{data.jobTitle}</Text>
              {sections.tagline.visible && tagline ? (
                <Text style={s.headerTagline}>" {tagline.slice(0, 90)}{tagline.length > 90 ? '…' : ''} "</Text>
              ) : null}
            </View>
            {/* Geometric logo mark */}
            <View style={s.headerLogo}>
              <View style={s.headerLogoInner} />
            </View>
          </View>

          {sections.contact.visible && (
            <View style={s.contactRow}>
              {[
                { label: CV_PROFILE.email },
                { label: CV_PROFILE.phone },
                { label: CV_PROFILE.linkedin },
              ].map((c, i) => (
                <View key={i} style={s.contactItem}>
                  <View style={s.contactDot} />
                  <Text style={s.contactText}>{c.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ═══ BODY ═══ */}
        <View style={s.body}>

          {/* ── Sidebar ── */}
          <View style={s.sidebar}>

            {/* Summary */}
            {sections.summary.visible && summary ? (
              <>
                <Text style={s.sideSecTitle}>Profil</Text>
                <View style={s.sideDivider} />
                <Text style={[s.sideText, { marginBottom: 14 }]}>{summary.slice(0, 220)}{summary.length > 220 ? '…' : ''}</Text>
              </>
            ) : null}

            {/* Capabilities */}
            {sections.capabilities.visible && caps.length > 0 && (
              <>
                <Text style={s.sideSecTitle}>{L.canDo}</Text>
                <View style={s.sideDivider} />
                <View style={{ marginBottom: 14 }}>
                  {caps.slice(0, 6).map((c, i) => (
                    <View key={i} style={s.sideCapItem}>
                      <View style={s.sideCapDot} />
                      <Text style={s.sideText}>{c}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Skills */}
            {sections.skills.visible && data.allSkills.length > 0 && (
              <>
                <Text style={s.sideSecTitle}>{L.skills}</Text>
                <View style={s.sideDivider} />
                <View style={s.skillsWrap}>
                  {data.allSkills.slice(0, 20).map((sk) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={sk} style={rel ? s.skillChipRel : s.skillChip}>
                        <Text style={rel ? s.skillChipTextRel : s.skillChipText}>{sk}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>

          {/* ── Main ── */}
          <View style={s.main}>

            {/* Experience */}
            {sections.experience.visible && data.experiences.length > 0 && (
              <>
                <Text style={s.secTitle}>{L.experience}</Text>
                <LineCluster width={40} color={CREAM2} />
                <View style={[s.secDivider, { marginTop: 4 }]} />
                {data.experiences.map((exp) => (
                  <View key={exp.id} style={s.expItem}>
                    <View style={s.expRow}>
                      <View style={s.expDot} />
                      <View style={s.expContent}>
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
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* Projects */}
            {sections.projects.visible && data.projects.length > 0 && (
              <View style={s.sectionGap}>
                <Text style={s.secTitle}>{L.projects}</Text>
                <LineCluster width={32} color={CREAM2} />
                <View style={[s.secDivider, { marginTop: 4 }]} />
                {data.projects.slice(0, 5).map((p) => (
                  <View key={p.slug} style={s.projItem}>
                    <Text style={s.projTitle}>{p.title}</Text>
                    <Text style={s.projDesc}>{stripHtml(p.desc)}</Text>
                    {p.tags.length > 0 && (
                      <Text style={s.projTags}>{p.tags.slice(0, 5).join(" · ")}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

          </View>
        </View>

      </Page>
    </Document>
  );
}
