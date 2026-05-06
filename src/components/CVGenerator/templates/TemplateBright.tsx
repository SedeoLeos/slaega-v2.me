/**
 * Template BRIGHT — Sidebar accent vive + main blanc
 *
 * Style app moderne : sidebar 38% en couleur palette.accent (vive),
 * contenu blanc épuré sur la droite.
 *
 * Sidebar : photo, nom, titre, contact, compétences
 * Main    : tagline, résumé, expériences, projets
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

export default function TemplateBright({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L = CV_LABELS[lang];

  /* Couleurs */
  const ACC = palette.accent; // sidebar background
  const DARK = palette.primary; // main titles
  const TEXT = "#1a1a1a";
  const MUTED = "#6B7280";
  const WHITE = "#ffffff";
  const PAPER = "#FAFAFA";

  const tagline = sections.tagline.text ?? data.tagline ?? data.jobTitle;
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: PAPER, fontFamily: "Helvetica" },
    body: { flexDirection: "row", height: "100%" },

    /* ─── Sidebar (accent color) ─── */
    sidebar: {
      width: "38%",
      backgroundColor: ACC,
      paddingTop: 32,
      paddingHorizontal: 18,
      paddingBottom: 20,
    },

    /* Photo circulaire */
    photoWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      overflow: "hidden",
      marginBottom: 14,
      alignSelf: "center",
    },
    photo: { width: 72, height: 72, objectFit: "cover" },

    /* Nom + titre */
    sName: {
      fontSize: 17,
      fontFamily: "Helvetica-Bold",
      color: WHITE,
      textAlign: "center",
      letterSpacing: -0.3,
      lineHeight: 1.15,
      marginBottom: 4,
    },
    sJob: {
      fontSize: 8.5,
      color: "rgba(255,255,255,0.75)",
      textAlign: "center",
      letterSpacing: 0.3,
      textTransform: "uppercase",
      marginBottom: 18,
    },

    /* Divider sur sidebar */
    sDivider: {
      height: 0.5,
      backgroundColor: "rgba(255,255,255,0.25)",
      marginBottom: 14,
    },

    /* Section label sidebar */
    sLabel: {
      fontSize: 7.5,
      fontFamily: "Helvetica-Bold",
      color: "rgba(255,255,255,0.6)",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 9,
    },

    /* Contact */
    contactItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 7,
      gap: 7,
    },
    contactDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: WHITE,
      marginTop: 2.5,
      flexShrink: 0,
    },
    contactText: {
      fontSize: 8.5,
      color: "rgba(255,255,255,0.85)",
      flex: 1,
      lineHeight: 1.4,
    },

    /* Skills chips on sidebar */
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    skillChip: {
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 3,
      backgroundColor: "rgba(255,255,255,0.18)",
      marginBottom: 4,
    },
    skillChipRel: {
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 3,
      backgroundColor: WHITE,
      marginBottom: 4,
    },
    skillText: { fontSize: 7.5, color: "rgba(255,255,255,0.85)" },
    skillTextRel: { fontSize: 7.5, color: ACC, fontFamily: "Helvetica-Bold" },

    /* ─── Main ─── */
    main: {
      flex: 1,
      backgroundColor: WHITE,
      paddingTop: 32,
      paddingHorizontal: 22,
      paddingBottom: 20,
    },

    /* Tagline accent */
    tagline: {
      fontSize: 9.5,
      color: ACC,
      fontFamily: "Helvetica-Oblique",
      lineHeight: 1.55,
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
      borderBottomStyle: "solid",
    },

    /* Résumé */
    summary: {
      fontSize: 9,
      color: MUTED,
      lineHeight: 1.65,
      marginBottom: 18,
    },

    /* Section header main */
    mSecRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 8,
    },
    mSecDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACC },
    mSecTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    mSecLine: { flex: 1, height: 0.5, backgroundColor: "#EBEBEB" },

    /* Expérience */
    expItem: {
      marginBottom: 13,
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: ACC,
      borderLeftStyle: "solid",
    },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 2,
    },
    expTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      flex: 1,
    },
    expDate: {
      fontSize: 8,
      color: MUTED,
      fontFamily: "Helvetica-Oblique",
      flexShrink: 0,
      marginLeft: 6,
    },
    expCompany: {
      fontSize: 8.5,
      color: ACC,
      fontFamily: "Helvetica-Bold",
      marginBottom: 4,
    },
    expDesc: { fontSize: 8.5, color: TEXT, lineHeight: 1.5 },

    /* Projets — grille 2 colonnes */
    projGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
    projCard: {
      width: "47.5%",
      backgroundColor: PAPER,
      borderRadius: 6,
      padding: 9,
      borderTopWidth: 2,
      borderTopColor: ACC,
      borderTopStyle: "solid",
    },
    projTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      marginBottom: 3,
    },
    projDesc: { fontSize: 8, color: MUTED, lineHeight: 1.45 },
    projTags: { fontSize: 7, color: ACC, marginTop: 4 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.body}>
          {/* ═══ SIDEBAR ═══ */}
          <View style={s.sidebar}>
            {/* Photo */}
            <View style={s.photoWrap}>
              <Image src={CV_PROFILE.photo} style={s.photo} />
            </View>

            {/* Nom + titre */}
            <Text style={s.sName}>
              {CV_PROFILE.name}
              {"\n"}
              {CV_PROFILE.surname}
            </Text>
            <Text style={s.sJob}>{data.jobTitle}</Text>

            <View style={s.sDivider} />

            {/* Contact */}
            {sections.contact.visible && (
              <>
                <Text style={s.sLabel}>{L.contact}</Text>
                {[CV_PROFILE.email, CV_PROFILE.phone, CV_PROFILE.linkedin].map(
                  (v, i) => (
                    <View key={i} style={s.contactItem}>
                      <View style={s.contactDot} />
                      <Text style={s.contactText}>{v}</Text>
                    </View>
                  ),
                )}
                <View style={s.sDivider} />
              </>
            )}

            {/* Compétences */}
            {sections.skills.visible && data.allSkills.length > 0 && (
              <>
                <Text style={s.sLabel}>{L.skills}</Text>
                <View style={s.skillsWrap}>
                  {data.allSkills.slice(0, 16).map((sk) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={sk} style={rel ? s.skillChipRel : s.skillChip}>
                        <Text style={rel ? s.skillTextRel : s.skillText}>
                          {sk}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>

          {/* ═══ MAIN ═══ */}
          <View style={s.main}>
            {/* Tagline */}
            {sections.tagline.visible && tagline && (
              <Text style={s.tagline}>{tagline}</Text>
            )}

            {/* Résumé */}
            {sections.summary.visible && summary && (
              <Text style={s.summary}>{summary}</Text>
            )}

            {/* Capacités */}
            {sections.capabilities.visible && caps.length > 0 && (
              <>
                <View style={s.mSecRow}>
                  <View style={s.mSecDot} />
                  <Text style={s.mSecTitle}>{L.canDo}</Text>
                  <View style={s.mSecLine} />
                </View>
                {caps.slice(0, 5).map((c, i) => (
                  <Text
                    key={i}
                    style={{
                      fontSize: 8.5,
                      color: TEXT,
                      lineHeight: 1.5,
                      marginBottom: 4,
                      paddingLeft: 10,
                    }}
                  >
                    • {c}
                  </Text>
                ))}
                <View style={{ height: 14 }} />
              </>
            )}

            {/* Expérience */}
            {sections.experience.visible && data.experiences.length > 0 && (
              <>
                <View style={s.mSecRow}>
                  <View style={s.mSecDot} />
                  <Text style={s.mSecTitle}>{L.experience}</Text>
                  <View style={s.mSecLine} />
                </View>
                {data.experiences.map((exp) => (
                  <View key={exp.id} style={s.expItem}>
                    <View style={s.expHeader}>
                      <Text style={s.expTitle}>{exp.role}</Text>
                      <Text style={s.expDate}>
                        {formatMonth(exp.startDate, false, lang, L.present)} –{" "}
                        {formatMonth(exp.endDate, exp.current, lang, L.present)}
                      </Text>
                    </View>
                    <Text style={s.expCompany}>
                      {exp.company}
                      {exp.location ? `  ·  ${exp.location}` : ""}
                    </Text>
                    <Text style={s.expDesc}>
                      {stripHtml(exp.description).slice(0, 180)}
                    </Text>
                  </View>
                ))}
                <View style={{ height: 10 }} />
              </>
            )}

            {/* Projets — 2 colonnes */}
            {sections.projects.visible && data.projects.length > 0 && (
              <>
                <View style={s.mSecRow}>
                  <View style={s.mSecDot} />
                  <Text style={s.mSecTitle}>{L.projects}</Text>
                  <View style={s.mSecLine} />
                </View>
                <View style={s.projGrid}>
                  {data.projects.slice(0, 4).map((p) => (
                    <View key={p.slug} style={s.projCard}>
                      <Text style={s.projTitle}>{p.title}</Text>
                      <Text style={s.projDesc}>
                        {stripHtml(p.desc).slice(0, 90)}
                      </Text>
                      {p.tags.length > 0 && (
                        <Text style={s.projTags}>
                          {p.tags.slice(0, 3).join(" · ")}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
