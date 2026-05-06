/**
 * Template HELLO — Photo sombre + "Hello," overlay + contenu deux colonnes
 *
 * Inspiré du design A4-1.jpg (Julien vander Woerd / Hello template)
 *
 * Layout A4 :
 *   Gauche (42%) : photo pleine hauteur, "Hello," en overlay, éducation timeline
 *   Droite (58%) : nom, job title, social icons, bio, skills hashtags, intérêts, contact
 */
import {
  Page,
  Document,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; palette: CVPalette; sections: CVSections };

export default function TemplateHello({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L = CV_LABELS[lang];

  const ACC = palette.accent;
  const DARK = palette.sidebar; // côté gauche sombre
  const LIGHT = palette.onDark; // texte sur fond sombre
  const TEXT = "#1a1a1a";
  const MUTED = "#6B7280";
  const BG = "#F9FAFB";

  const tagline = sections.tagline.text ?? data.tagline ?? data.jobTitle;
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  /* Skills groupés : relevant = accent, autres = muted */
  const skills = data.allSkills.slice(0, 18);

  const s = StyleSheet.create({
    page: { backgroundColor: BG, fontFamily: "Helvetica" },

    /* ── Deux colonnes côte-à-côte ── */
    columns: { flexDirection: "row", height: "100%" },

    /* ── Colonne gauche ── */
    left: { width: "42%", backgroundColor: DARK, position: "relative" },
    leftPhoto: { width: "100%", height: "100%", objectFit: "cover" },
    /* Overlay dégradé sombre bas */
    leftOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: DARK,
    },
    helloWrap: {
      position: "absolute",
      top: 20,
      left: 14,
    },
    helloText: {
      fontSize: 42,
      fontFamily: "Helvetica-Bold",
      color: "#ffffff",
      opacity: 0.95,
      lineHeight: 1,
    },
    helloAccent: {
      width: 32,
      height: 3,
      backgroundColor: ACC,
      marginTop: 4,
    },

    /* Expériences dans la col gauche (bas) */
    leftContent: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 14,
      paddingBottom: 18,
      paddingTop: 10,
    },
    leftSecTitle: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: ACC,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    expItem: { marginBottom: 9 },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    expTitle: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: "#fff",
      flex: 1,
    },
    expDate: {
      fontSize: 6.5,
      color: "rgba(255,255,255,0.55)",
      flexShrink: 0,
      marginLeft: 4,
    },
    expComp: { fontSize: 7, color: ACC, marginBottom: 2 },
    expDesc: { fontSize: 6.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 },

    /* ── Colonne droite ── */
    right: {
      flex: 1,
      backgroundColor: "#ffffff",
      paddingTop: 28,
      paddingHorizontal: 18,
      paddingBottom: 18,
    },

    /* Identity block */
    identName: {
      fontSize: 19,
      fontFamily: "Helvetica-Bold",
      color: TEXT,
      letterSpacing: -0.3,
      lineHeight: 1.1,
    },
    identJob: {
      fontSize: 8.5,
      color: ACC,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 0.5,
      marginTop: 2,
      marginBottom: 10,
    },

    /* Tagline */
    taglineText: {
      fontSize: 7.5,
      color: MUTED,
      fontFamily: "Helvetica-Oblique",
      lineHeight: 1.5,
      marginBottom: 10,
    },

    /* Contact pills */
    contactWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginBottom: 10,
    },
    contactPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      borderWidth: 0.5,
      borderColor: "#E5E7EB",
      borderStyle: "solid",
      borderRadius: 20,
      paddingHorizontal: 6,
      paddingVertical: 2.5,
    },
    contactDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: ACC },
    contactText: { fontSize: 6.5, color: MUTED },

    /* Divider */
    divider: { height: 0.5, backgroundColor: "#E5E7EB", marginVertical: 8 },

    /* Summary */
    summaryText: {
      fontSize: 7.5,
      color: TEXT,
      lineHeight: 1.6,
      marginBottom: 8,
    },

    /* Section label */
    secLabel: {
      fontSize: 6.5,
      fontFamily: "Helvetica-Bold",
      color: MUTED,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 6,
      marginTop: 10,
    },

    /* Capabilities */
    capItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 3,
    },
    capDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: ACC,
      marginTop: 2.5,
      marginRight: 5,
      flexShrink: 0,
    },
    capText: { fontSize: 7.5, color: TEXT, flex: 1, lineHeight: 1.4 },

    /* Skills hashtags */
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
    skillChip: {
      borderRadius: 3,
      paddingHorizontal: 5,
      paddingVertical: 2,
      marginBottom: 2,
    },
    skillChipRel: {
      backgroundColor: ACC,
      borderRadius: 3,
      paddingHorizontal: 5,
      paddingVertical: 2,
      marginBottom: 2,
    },
    skillText: { fontSize: 6.5, color: MUTED },
    skillTextRel: {
      fontSize: 6.5,
      color: "#ffffff",
      fontFamily: "Helvetica-Bold",
    },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.columns}>
          {/* ══ Colonne gauche ══ */}
          <View style={s.left}>
            {/* Photo pleine */}
            <Image src={CV_PROFILE.photo} style={s.leftPhoto} />
            {/* Overlay sombre */}
            <View style={[s.leftOverlay, { opacity: 0.45 }]} />

            {/* "Hello," en haut à gauche */}
            <View style={s.helloWrap}>
              <Text style={s.helloText}>Hello,</Text>
              <View style={s.helloAccent} />
            </View>

            {/* Expériences en bas */}
            {sections.experience.visible && data.experiences.length > 0 && (
              <View style={s.leftContent}>
                <Text style={s.leftSecTitle}>{L.experience}</Text>
                {data.experiences.slice(0, 3).map((exp) => (
                  <View key={exp.id} style={s.expItem}>
                    <View style={s.expHeader}>
                      <Text style={s.expTitle}>{exp.role}</Text>
                      <Text style={s.expDate}>
                        {formatMonth(exp.startDate, false, lang, L.present)}
                      </Text>
                    </View>
                    <Text style={s.expComp}>{exp.company}</Text>
                    <Text style={s.expDesc}>
                      {stripHtml(exp.description).slice(0, 100)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ══ Colonne droite ══ */}
          <View style={s.right}>
            {/* Nom + job */}
            <Text style={s.identName}>
              {CV_PROFILE.name}
              {"\n"}
              {CV_PROFILE.surname}
            </Text>
            <Text style={s.identJob}>{data.jobTitle}</Text>

            {/* Tagline */}
            {sections.tagline.visible && tagline ? (
              <Text style={s.taglineText}>{tagline}</Text>
            ) : null}

            {/* Contact pills */}
            {sections.contact.visible && (
              <View style={s.contactWrap}>
                {[CV_PROFILE.email, CV_PROFILE.phone, CV_PROFILE.linkedin].map(
                  (v, i) => (
                    <View key={i} style={s.contactPill}>
                      <View style={s.contactDot} />
                      <Text style={s.contactText}>{v}</Text>
                    </View>
                  ),
                )}
              </View>
            )}

            <View style={s.divider} />

            {/* Summary */}
            {sections.summary.visible && summary ? (
              <Text style={s.summaryText}>
                {summary.slice(0, 300)}
                {summary.length > 300 ? "…" : ""}
              </Text>
            ) : null}

            {/* Capabilities */}
            {sections.capabilities.visible && caps.length > 0 && (
              <>
                <Text style={s.secLabel}>{L.canDo}</Text>
                {caps.slice(0, 5).map((c, i) => (
                  <View key={i} style={s.capItem}>
                    <View style={s.capDot} />
                    <Text style={s.capText}>{c}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Skills hashtags */}
            {sections.skills.visible && skills.length > 0 && (
              <>
                <Text style={s.secLabel}>{L.skills}</Text>
                <View style={s.skillsWrap}>
                  {skills.map((sk) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={sk} style={rel ? s.skillChipRel : s.skillChip}>
                        <Text style={rel ? s.skillTextRel : s.skillText}>
                          {rel ? "#" : ""}
                          {sk}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* Projets */}
            {sections.projects.visible && data.projects.length > 0 && (
              <>
                <Text style={s.secLabel}>{L.projects}</Text>
                {data.projects.slice(0, 3).map((p) => (
                  <View key={p.slug} style={{ marginBottom: 5 }}>
                    <Text
                      style={{
                        fontSize: 8,
                        fontFamily: "Helvetica-Bold",
                        color: TEXT,
                      }}
                    >
                      {p.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 7,
                        color: MUTED,
                        lineHeight: 1.4,
                        marginTop: 1,
                      }}
                    >
                      {stripHtml(p.desc).slice(0, 80)}
                    </Text>
                    {p.tags.length > 0 && (
                      <Text style={{ fontSize: 6.5, color: ACC, marginTop: 1 }}>
                        {p.tags.slice(0, 4).join(" · ")}
                      </Text>
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
