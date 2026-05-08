/**
 * Template NOVA — Bold dark header + two-column body
 *
 * Header band: palette.sidebar bg, very large bold name, photo
 * Body:  left sidebar (info, capabilities) · right main (experience, projects, skills)
 */
import {
  Page, Document, View, Text, Image, StyleSheet,
  Svg, Path, Line,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; palette: CVPalette; sections: CVSections };

// ── Decorative branch SVG (in-flow, no absolute) ─────────────────────────────
function BranchSvg({ color }: { color: string }) {
  return (
    <Svg width={60} height={40} viewBox="0 0 60 40">
      <Path d="M5,35 Q20,10 55,5" stroke={color} strokeWidth={1} fill="none" />
      <Path d="M15,28 Q22,20 28,16" stroke={color} strokeWidth={0.7} fill="none" />
      <Path d="M25,22 Q30,15 35,10" stroke={color} strokeWidth={0.7} fill="none" />
      <Path d="M38,14 Q44,10 50,7" stroke={color} strokeWidth={0.7} fill="none" />
      <Path d="M10,31 Q12,24 18,22" stroke={color} strokeWidth={0.6} fill="none" />
      <Line x1={20} y1={25} x2={14} y2={21} stroke={color} strokeWidth={0.5} />
      <Line x1={30} y1={19} x2={24} y2={15} stroke={color} strokeWidth={0.5} />
      <Line x1={42} y1={12} x2={37} y2={8}  stroke={color} strokeWidth={0.5} />
    </Svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TemplateNova({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const tagline = sections.tagline.text ?? data.tagline ?? "";
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: palette.paper, fontFamily: "Helvetica" },

    /* ── Header band ── */
    header: {
      backgroundColor: palette.sidebar,
      paddingTop: 22, paddingBottom: 20,
      paddingHorizontal: 30,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: { flex: 1 },
    headerName: {
      fontSize: 28, fontFamily: "Helvetica-Bold",
      color: palette.onDark, letterSpacing: -0.5, lineHeight: 1.05,
      textTransform: "uppercase",
    },
    headerJob: {
      fontSize: 8, color: palette.accent, fontFamily: "Helvetica-Bold",
      letterSpacing: 2, textTransform: "uppercase", marginTop: 5,
    },
    headerPhoto: {
      width: 72, height: 72, borderRadius: 36, objectFit: "cover",
      borderWidth: 2.5, borderColor: palette.accent, borderStyle: "solid",
    },
    headerBranch: { marginLeft: 12, opacity: 0.4 },

    /* Accent bottom strip on header */
    accentStrip: { height: 3, backgroundColor: palette.accent },

    /* ── Body ── */
    body: { flexDirection: "row", flex: 1 },

    /* Sidebar */
    sidebar: {
      width: "30%",
      backgroundColor: `${palette.sidebar}22`,
      borderRightWidth: 1, borderRightColor: palette.border, borderRightStyle: "solid",
      paddingTop: 22, paddingHorizontal: 16, paddingBottom: 24,
    },
    sSecWrap:  { marginBottom: 14 },
    sSecTitle: {
      fontSize: 6, fontFamily: "Helvetica-Bold", color: palette.primary,
      letterSpacing: 2, textTransform: "uppercase", marginBottom: 7,
    },
    sDivider: { height: 0.5, backgroundColor: palette.border, marginVertical: 10 },

    /* Contact */
    cItem:  { marginBottom: 7 },
    cLabel: { fontSize: 6, color: palette.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 1 },
    cVal:   { fontSize: 7.5, color: palette.body },

    /* Summary in sidebar */
    sSummary: { fontSize: 7.5, color: palette.body, lineHeight: 1.55, marginBottom: 10 },

    /* Capabilities */
    capItem:   { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
    capBullet: {
      width: 3.5, height: 3.5, backgroundColor: palette.accent, borderRadius: 1,
      marginTop: 3, marginRight: 6, flexShrink: 0,
    },
    capText: { fontSize: 7.5, color: palette.body, flex: 1, lineHeight: 1.45 },

    /* ── Main ── */
    main: { flex: 1, paddingTop: 22, paddingHorizontal: 22, paddingBottom: 24 },

    secWrap: { marginBottom: 14 },
    secRow:  { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    secBar:  { width: 3, height: 14, backgroundColor: palette.accent, borderRadius: 1, marginRight: 7 },
    secLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: 0.4 },

    /* Jobs */
    job:     { marginBottom: 11, paddingLeft: 12, borderLeftWidth: 1.5, borderLeftColor: palette.border, borderLeftStyle: "solid", flexDirection: "column" },
    jobDot:  { width: 5, height: 5, backgroundColor: palette.accent, borderRadius: 1, marginLeft: -15, marginBottom: 3, flexShrink: 0 },
    jobTop:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    jobName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: palette.primary, flex: 1 },
    jobDate: { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", flexShrink: 0, marginLeft: 4 },
    jobCo:   { fontSize: 7.5, color: palette.accent, fontFamily: "Helvetica-Bold", letterSpacing: 0.3, marginBottom: 3 },
    jobDesc: { fontSize: 7.5, color: palette.body, lineHeight: 1.5 },
    jobTags: { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", marginTop: 2 },

    /* Skills grid */
    skillGrid: { flexDirection: "row", flexWrap: "wrap" },
    skillItem: { width: "33%", flexDirection: "row", alignItems: "center", marginBottom: 5, paddingRight: 6 },
    skillDot:  { width: 3.5, height: 3.5, borderRadius: 1, marginRight: 5, flexShrink: 0 },
    skillText: { fontSize: 7.5, color: palette.body },
    skillBold: { fontSize: 7.5, color: palette.primary, fontFamily: "Helvetica-Bold" },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ HEADER BAND ═══ */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.headerName}>
              {CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}
            </Text>
            <Text style={s.headerJob}>
              {sections.tagline.visible && tagline ? tagline : data.jobTitle}
            </Text>
          </View>
          <View style={s.headerBranch}>
            <BranchSvg color={palette.onDark} />
          </View>
          <Image src={CV_PROFILE.photo} style={s.headerPhoto} />
        </View>
        <View style={s.accentStrip} />

        {/* ═══ BODY ═══ */}
        <View style={s.body}>

          {/* ── Sidebar ── */}
          <View style={s.sidebar}>

            {/* Summary */}
            {sections.summary.visible && summary && (
              <>
                <Text style={s.sSummary}>{summary}</Text>
                <View style={s.sDivider} />
              </>
            )}

            {/* Contact */}
            {sections.contact.visible && (
              <View style={s.sSecWrap}>
                <Text style={s.sSecTitle}>{L.contact}</Text>
                <View style={s.cItem}>
                  <Text style={s.cLabel}>{L.email}</Text>
                  <Text style={s.cVal}>{CV_PROFILE.email}</Text>
                </View>
                <View style={s.cItem}>
                  <Text style={s.cLabel}>{L.phone}</Text>
                  <Text style={s.cVal}>{CV_PROFILE.phone}</Text>
                </View>
                <View style={s.cItem}>
                  <Text style={s.cLabel}>{L.linkedin}</Text>
                  <Text style={s.cVal}>{CV_PROFILE.linkedin}</Text>
                </View>
              </View>
            )}

            <View style={s.sDivider} />

            {/* Capabilities */}
            {sections.capabilities.visible && caps.length > 0 && (
              <View style={s.sSecWrap}>
                <Text style={s.sSecTitle}>{L.canDo}</Text>
                {caps.map((c, i) => (
                  <View key={i} style={s.capItem}>
                    <View style={s.capBullet} />
                    <Text style={s.capText}>{c}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ── Main ── */}
          <View style={s.main}>

            {/* Experience */}
            {sections.experience.visible && data.experiences.length > 0 && (
              <View style={s.secWrap}>
                <View style={s.secRow}>
                  <View style={s.secBar} />
                  <Text style={s.secLabel}>{L.experience}</Text>
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
              </View>
            )}

            {/* Projects */}
            {sections.projects.visible && data.projects.length > 0 && (
              <View style={s.secWrap}>
                <View style={s.secRow}>
                  <View style={s.secBar} />
                  <Text style={s.secLabel}>{L.projects}</Text>
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
              </View>
            )}

            {/* Skills */}
            {sections.skills.visible && data.allSkills.length > 0 && (
              <View style={s.secWrap}>
                <View style={s.secRow}>
                  <View style={s.secBar} />
                  <Text style={s.secLabel}>{L.skills}</Text>
                </View>
                <View style={s.skillGrid}>
                  {data.allSkills.map((sk) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={sk} style={s.skillItem}>
                        <View style={[s.skillDot, { backgroundColor: rel ? palette.accent : palette.border }]} />
                        <Text style={rel ? s.skillBold : s.skillText}>{sk}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </View>

      </Page>
    </Document>
  );
}
