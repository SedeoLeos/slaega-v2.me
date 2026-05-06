/**
 * Template HELLO — Photo hero + "Hello," large text overlay
 *
 * Header: full-width photo with "Hello," overlaid in large bold text + name/contact right side
 * Accent band: quote / tagline
 * Body left (40%): Personal values, Languages (progress bars), Skills 2-col list
 * Body right (60%): Education timeline, Work Experience list with bullet points
 */
import {
  Page, Document, View, Text, Image, StyleSheet, Svg, Rect,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; palette: CVPalette; sections: CVSections };

export default function TemplateHello({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const tagline = sections.tagline.text ?? data.tagline ?? "";
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const ACC  = palette.accent;
  const NAVY = palette.primary;
  const BG   = "#f5f5f5";
  const CARD = "#ffffff";

  const s = StyleSheet.create({
    page: { backgroundColor: BG, fontFamily: "Helvetica" },

    /* ── Hero header ── */
    hero: { flexDirection: "row", height: 130 },
    heroPhotoWrap: { width: "42%", position: "relative", overflow: "hidden" },
    heroPhoto: { width: "100%", height: 130, objectFit: "cover" },
    /* "Hello," overlay — in-flow positioned View on top using absolute */
    helloOverlay: {
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: "flex-end", paddingLeft: 10, paddingBottom: 8,
    },
    helloText: {
      fontSize: 44, fontFamily: "Helvetica-Bold", color: CARD,
      opacity: 0.92, lineHeight: 1, letterSpacing: -1,
    },
    heroRight: {
      flex: 1, backgroundColor: CARD,
      paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10,
      justifyContent: "center",
    },
    heroName: {
      fontSize: 18, fontFamily: "Helvetica-Bold",
      color: NAVY, letterSpacing: -0.3, lineHeight: 1.15, marginBottom: 2,
    },
    heroJobTitle: {
      fontSize: 10, fontFamily: "Helvetica-Bold",
      color: ACC, letterSpacing: 0.3, marginBottom: 8,
    },
    heroContactRow: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 3 },
    heroContactDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: ACC },
    heroContactText: { fontSize: 7.5, color: "#555" },

    /* ── Accent band ── */
    band: {
      backgroundColor: ACC, paddingHorizontal: 24, paddingVertical: 7,
      flexDirection: "row", alignItems: "center",
    },
    bandQuote: { fontSize: 8, color: "#fff", fontFamily: "Helvetica-Oblique", flex: 1 },

    /* ── Body ── */
    body: { flexDirection: "row", flex: 1 },

    /* Left col */
    bodyLeft: {
      width: "38%", backgroundColor: CARD,
      borderRightWidth: 1, borderRightColor: "#ebebeb", borderRightStyle: "solid",
      paddingTop: 16, paddingHorizontal: 16, paddingBottom: 16,
    },

    /* Right col */
    bodyRight: {
      flex: 1, paddingTop: 16, paddingHorizontal: 18, paddingBottom: 16,
    },

    /* Section title */
    secTitle: {
      fontSize: 8, fontFamily: "Helvetica-Bold", color: NAVY,
      textTransform: "uppercase", letterSpacing: 1.5,
      marginBottom: 7, marginTop: 10,
    },
    secDivider: { height: 0.5, backgroundColor: "#e0e0e0", marginBottom: 8 },

    /* Personal values — 2 columns */
    valuesGrid: { flexDirection: "row", gap: 4 },
    valCol: { flex: 1, flexDirection: "column", gap: 3 },
    valText: { fontSize: 7, color: "#555" },

    /* Languages with progress bars */
    langRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 },
    langName: { fontSize: 7.5, color: NAVY, width: 50 },
    langBarBg: { flex: 1, height: 4, backgroundColor: "#e0e0e0", borderRadius: 2 },
    langBarFill: { height: 4, backgroundColor: ACC, borderRadius: 2 },

    /* Skills list — 2 columns */
    skillsGrid: { flexDirection: "row", gap: 8 },
    skillCol: { flex: 1, flexDirection: "column", gap: 2.5 },
    skillItem: { fontSize: 7, color: "#555" },
    skillItemRel: { fontSize: 7, color: ACC, fontFamily: "Helvetica-Bold" },

    /* Capabilities */
    capItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 3 },
    capDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: ACC, marginTop: 3, marginRight: 5, flexShrink: 0 },
    capText: { fontSize: 7.5, color: "#555", flex: 1, lineHeight: 1.45 },

    /* Right: Education */
    eduItem: { marginBottom: 9 },
    eduType:   { fontSize: 6.5, color: "#999", textTransform: "uppercase", letterSpacing: 1 },
    eduTitle:  { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: NAVY, lineHeight: 1.3 },
    eduSchool: { fontSize: 7, color: ACC, marginBottom: 1 },
    eduDate:   { fontSize: 6.5, color: "#aaa" },

    /* Right: Experience */
    expItem: { marginBottom: 9 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    expTitle:  { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: NAVY, flex: 1 },
    expDate:   { fontSize: 6.5, color: "#aaa", fontFamily: "Helvetica-Oblique", flexShrink: 0, marginLeft: 4 },
    expCompany: { fontSize: 7, color: ACC, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    expDesc:   { fontSize: 7, color: "#555", lineHeight: 1.5 },

    /* Right: Projects */
    projItem: { marginBottom: 6, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: ACC, borderLeftStyle: "solid" },
    projTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: NAVY },
    projDesc:  { fontSize: 7, color: "#555", lineHeight: 1.4 },
    projTags:  { fontSize: 6.5, color: "#aaa", marginTop: 1 },
  });

  /* Language "fluency" mapped from keyword matching */
  const langLevels = [
    { name: "Français", level: 1.0 },
    { name: "Anglais",  level: 0.75 },
    { name: "Espagnol", level: 0.45 },
  ];

  /* Split skills into two columns */
  const half = Math.ceil(data.allSkills.length / 2);
  const skillLeft  = data.allSkills.slice(0, half);
  const skillRight = data.allSkills.slice(half);

  /* Split caps into two value columns */
  const capsHalf = Math.ceil(caps.length / 2);
  const capsLeft  = caps.slice(0, capsHalf);
  const capsRight = caps.slice(capsHalf);

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ HERO ═══ */}
        <View style={s.hero}>
          {/* Photo + Hello overlay */}
          <View style={s.heroPhotoWrap}>
            <Image src={CV_PROFILE.photo} style={s.heroPhoto} />
            <View style={s.helloOverlay}>
              <Text style={s.helloText}>Hello,</Text>
            </View>
          </View>

          {/* Name + contact */}
          <View style={s.heroRight}>
            <Text style={s.heroName}>{CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}</Text>
            <Text style={s.heroJobTitle}>
              {sections.tagline.visible && tagline ? tagline : data.jobTitle}
            </Text>
            <View style={s.heroContactRow}>
              <View style={s.heroContactDot} />
              <Text style={s.heroContactText}>{CV_PROFILE.email}</Text>
            </View>
            <View style={s.heroContactRow}>
              <View style={s.heroContactDot} />
              <Text style={s.heroContactText}>{CV_PROFILE.phone}</Text>
            </View>
            <View style={s.heroContactRow}>
              <View style={s.heroContactDot} />
              <Text style={s.heroContactText}>{CV_PROFILE.linkedin}</Text>
            </View>
          </View>
        </View>

        {/* ═══ ACCENT BAND ═══ */}
        <View style={s.band}>
          <Text style={s.bandQuote}>
            {summary ? `" ${summary.slice(0, 100)}${summary.length > 100 ? "…" : ""} "` : `" ${data.jobTitle} "`}
          </Text>
        </View>

        {/* ═══ BODY ═══ */}
        <View style={s.body}>

          {/* ── Left col ── */}
          <View style={s.bodyLeft}>

            {/* Capabilities as "values" */}
            {sections.capabilities.visible && caps.length > 0 && (
              <>
                <Text style={s.secTitle}>{L.canDo}</Text>
                <View style={s.secDivider} />
                <View style={s.valuesGrid}>
                  <View style={s.valCol}>
                    {capsLeft.map((c, i) => (
                      <View key={i} style={s.capItem}>
                        <View style={s.capDot} />
                        <Text style={s.valText}>{c}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={s.valCol}>
                    {capsRight.map((c, i) => (
                      <View key={i} style={s.capItem}>
                        <View style={s.capDot} />
                        <Text style={s.valText}>{c}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Languages */}
            <Text style={[s.secTitle, { marginTop: 12 }]}>Langues</Text>
            <View style={s.secDivider} />
            {langLevels.map((l) => (
              <View key={l.name} style={s.langRow}>
                <Text style={s.langName}>{l.name}</Text>
                <View style={s.langBarBg}>
                  <View style={[s.langBarFill, { width: `${l.level * 100}%` }]} />
                </View>
              </View>
            ))}

            {/* Skills */}
            {sections.skills.visible && data.allSkills.length > 0 && (
              <>
                <Text style={[s.secTitle, { marginTop: 12 }]}>{L.skills}</Text>
                <View style={s.secDivider} />
                <View style={s.skillsGrid}>
                  <View style={s.skillCol}>
                    {skillLeft.map((sk) => {
                      const rel = data.relevantSkills.includes(sk);
                      return <Text key={sk} style={rel ? s.skillItemRel : s.skillItem}>· {sk}</Text>;
                    })}
                  </View>
                  <View style={s.skillCol}>
                    {skillRight.map((sk) => {
                      const rel = data.relevantSkills.includes(sk);
                      return <Text key={sk} style={rel ? s.skillItemRel : s.skillItem}>· {sk}</Text>;
                    })}
                  </View>
                </View>
              </>
            )}
          </View>

          {/* ── Right col ── */}
          <View style={s.bodyRight}>

            {/* Experience */}
            {sections.experience.visible && data.experiences.length > 0 && (
              <>
                <Text style={s.secTitle}>{L.experience}</Text>
                <View style={s.secDivider} />
                {data.experiences.map((exp) => (
                  <View key={exp.id} style={s.expItem}>
                    <View style={s.expHeader}>
                      <Text style={s.expTitle}>{exp.role}</Text>
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
                <Text style={[s.secTitle, { marginTop: 4 }]}>{L.projects}</Text>
                <View style={s.secDivider} />
                {data.projects.slice(0, 4).map((p) => (
                  <View key={p.slug} style={s.projItem}>
                    <Text style={s.projTitle}>{p.title}</Text>
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
