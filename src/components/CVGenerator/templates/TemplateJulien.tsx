/**
 * Template JULIEN — Style portfolio card (v.1 / v.2 référence)
 *
 * Design deux colonnes sur fond clair :
 *   Gauche (45%) : nom + job title header (couleur palette),
 *                  timeline éducation, timeline expérience
 *   Droite (55%) : bio, soft skills / capabilities, skills hashtags,
 *                  intérêts, projets, contact
 *
 * Les couleurs s'adaptent à la palette sélectionnée.
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

export default function TemplateJulien({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L = CV_LABELS[lang];

  const ACC = palette.accent;
  const DARK = palette.sidebar;
  const LIGHT = palette.onDark;
  const TEXT = "#1C1C1C";
  const MUTED = "#777777";
  const BG = "#F5F5F5";
  const CARD = "#FFFFFF";

  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);
  const skills = data.allSkills.slice(0, 20);

  const s = StyleSheet.create({
    page: { backgroundColor: BG, fontFamily: "Helvetica" },

    /* ── Layout principal ── */
    body: { flexDirection: "row", height: "100%" },

    /* ── Colonne gauche ── */
    left: {
      width: "45%",
      paddingTop: 0,
      paddingHorizontal: 0,
    },

    /* Header de la col gauche (coloré) */
    leftHeader: {
      backgroundColor: DARK,
      paddingTop: 28,
      paddingHorizontal: 18,
      paddingBottom: 20,
    },
    greeting: {
      fontSize: 9,
      color: LIGHT,
      opacity: 0.8,
      marginBottom: 3,
    },
    bigName: {
      fontSize: 18,
      fontFamily: "Helvetica-Bold",
      color: LIGHT,
      letterSpacing: -0.3,
      lineHeight: 1.15,
      marginBottom: 3,
    },
    jobChip: {
      alignSelf: "flex-start",
      backgroundColor: ACC,
      borderRadius: 3,
      paddingHorizontal: 7,
      paddingVertical: 3,
      marginTop: 4,
    },
    jobChipText: {
      fontSize: 7.5,
      color: CARD,
      fontFamily: "Helvetica-Bold",
    },

    /* Photo dans col gauche header */
    photoWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: ACC,
      borderStyle: "solid",
      marginBottom: 8,
    },
    photo: { width: 56, height: 56, objectFit: "cover" },

    /* Contenu bas col gauche */
    leftBody: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 14,
    },

    secLabel: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: TEXT,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 8,
      marginTop: 12,
    },
    secLabelFirst: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: TEXT,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 8,
      marginTop: 0,
    },

    /* Timeline */
    timelineItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 9,
    },
    timelineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: ACC,
      flexShrink: 0,
      marginRight: 8,
      marginTop: 2,
    },
    timelineDotSmall: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#ccc",
      flexShrink: 0,
      marginRight: 8,
      marginTop: 3,
    },
    timelineContent: { flex: 1 },
    timelineDate: { fontSize: 6.5, color: MUTED, marginBottom: 1 },
    timelineTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: TEXT },
    timelineSubtitle: { fontSize: 7, color: ACC, marginTop: 1 },
    timelineDesc: {
      fontSize: 6.5,
      color: MUTED,
      lineHeight: 1.4,
      marginTop: 1,
    },

    /* ── Colonne droite ── */
    right: {
      flex: 1,
      backgroundColor: CARD,
      paddingTop: 28,
      paddingHorizontal: 18,
      paddingBottom: 18,
    },

    summaryText: {
      fontSize: 7.5,
      color: TEXT,
      lineHeight: 1.65,
      marginBottom: 10,
    },

    /* Capabilities */
    capItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    capDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: ACC,
      marginTop: 2.5,
      marginRight: 6,
      flexShrink: 0,
    },
    capText: { fontSize: 7.5, color: TEXT, flex: 1, lineHeight: 1.4 },

    /* Skills hashtags */
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
    skillTag: {
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 2.5,
      backgroundColor: BG,
      marginBottom: 3,
    },
    skillTagRel: {
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 2.5,
      backgroundColor: ACC,
      marginBottom: 3,
    },
    skillTagText: { fontSize: 6.5, color: MUTED },
    skillTagTextRel: {
      fontSize: 6.5,
      color: CARD,
      fontFamily: "Helvetica-Bold",
    },

    /* Projets */
    projCard: {
      flexDirection: "column",
      borderRadius: 4,
      backgroundColor: BG,
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginBottom: 6,
      borderLeftWidth: 2,
      borderLeftColor: ACC,
      borderLeftStyle: "solid",
    },
    projTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: TEXT, marginBottom: 4 },
    projDesc: { fontSize: 7, color: MUTED, lineHeight: 1.5, marginTop: 0 },
    projTags: { fontSize: 6.5, color: ACC, marginTop: 4 },

    /* Contact */
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      gap: 5,
    },
    contactDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: ACC },
    contactText: { fontSize: 7, color: MUTED },

    divider: { height: 0.5, backgroundColor: "#E5E7EB", marginVertical: 8 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.body}>
          {/* ══ Colonne gauche ══ */}
          <View style={s.left}>
            {/* Header coloré */}
            <View style={s.leftHeader}>
              <View style={s.photoWrap}>
                <Image src={CV_PROFILE.photo} style={s.photo} />
              </View>
              <Text style={s.greeting}>Hello I'm</Text>
              <Text style={s.bigName}>
                {CV_PROFILE.name}
                {"\n"}
                {CV_PROFILE.surname}
              </Text>
              <View style={s.jobChip}>
                <Text style={s.jobChipText}>{data.jobTitle}</Text>
              </View>
            </View>

            {/* Contenu bas gauche */}
            <View style={s.leftBody}>
              {/* Éducation — ici on utilise les keywords comme compétences clés */}
              {sections.skills.visible && data.allSkills.length > 0 && (
                <>
                  <Text style={s.secLabelFirst}>{L.skills}</Text>
                  {data.allSkills.slice(0, 8).map((sk, i) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={i} style={s.timelineItem}>
                        <View
                          style={rel ? s.timelineDot : s.timelineDotSmall}
                        />
                        <View style={s.timelineContent}>
                          <Text
                            style={[s.timelineTitle, rel ? { color: ACC } : {}]}
                          >
                            {sk}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              )}

              {/* Expériences (résumé) */}
              {sections.experience.visible && data.experiences.length > 0 && (
                <>
                  <Text style={s.secLabel}>{L.experience}</Text>
                  {data.experiences.slice(0, 4).map((exp) => (
                    <View key={exp.id} style={s.timelineItem}>
                      <View style={s.timelineDot} />
                      <View style={s.timelineContent}>
                        <Text style={s.timelineDate}>
                          {formatMonth(exp.startDate, false, lang, L.present)} –{" "}
                          {formatMonth(
                            exp.endDate,
                            exp.current,
                            lang,
                            L.present,
                          )}
                        </Text>
                        <Text style={s.timelineTitle}>{exp.role}</Text>
                        <Text style={s.timelineSubtitle}>{exp.company}</Text>
                        <Text style={s.timelineDesc}>
                          {stripHtml(exp.description)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          </View>

          {/* ══ Colonne droite ══ */}
          <View style={s.right}>
            {/* Bio / Summary */}
            {sections.summary.visible && summary ? (
              <>
                <Text style={s.summaryText}>
                  {summary}
                </Text>
                <View style={s.divider} />
              </>
            ) : null}

            {/* Capabilities */}
            {sections.capabilities.visible && caps.length > 0 && (
              <>
                <Text style={[s.secLabelFirst, { marginBottom: 6 }]}>
                  {L.canDo}
                </Text>
                {caps.slice(0, 5).map((c, i) => (
                  <View key={i} style={s.capItem}>
                    <View style={s.capDot} />
                    <Text style={s.capText}>{c}</Text>
                  </View>
                ))}
                <View style={s.divider} />
              </>
            )}

            {/* Skills hashtags */}
            {sections.skills.visible && skills.length > 0 && (
              <>
                <Text style={[s.secLabel, { marginTop: 0 }]}>
                  Design & Tech
                </Text>
                <View style={s.skillsWrap}>
                  {skills.map((sk) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={sk} style={rel ? s.skillTagRel : s.skillTag}>
                        <Text style={rel ? s.skillTagTextRel : s.skillTagText}>
                          #{sk}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <View style={s.divider} />
              </>
            )}

            {/* Projets */}
            {sections.projects.visible && data.projects.length > 0 && (
              <>
                <Text style={[s.secLabel, { marginTop: 0 }]}>{L.projects}</Text>
                {data.projects.slice(0, 3).map((p) => (
                  <View key={p.slug} style={s.projCard}>
                    <Text style={s.projTitle}>{p.title}</Text>
                    <Text style={s.projDesc}>
                      {stripHtml(p.desc)}
                    </Text>
                    {p.tags.length > 0 && (
                      <Text style={s.projTags}>
                        {p.tags.slice(0, 4).join(" · ")}
                      </Text>
                    )}
                  </View>
                ))}
                <View style={s.divider} />
              </>
            )}

            {/* Contact */}
            {sections.contact.visible && (
              <>
                <Text style={[s.secLabel, { marginTop: 0 }]}>{L.contact}</Text>
                {[CV_PROFILE.email, CV_PROFILE.phone, CV_PROFILE.linkedin].map(
                  (v, i) => (
                    <View key={i} style={s.contactRow}>
                      <View style={s.contactDot} />
                      <Text style={s.contactText}>{v}</Text>
                    </View>
                  ),
                )}
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
