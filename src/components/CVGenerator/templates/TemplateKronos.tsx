/**
 * Template KRONOS — Template de base (PDF de référence)
 *
 * Fixes :
 *   - watermark réduit (35%, opacity 0.35) — plus discret
 *   - toutes les polices augmentées (~+1.5pt)
 *   - suppression du border/elevation sur la photo
 *   - sections capabilities + experience + projets bien visibles
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

export default function TemplateKronos({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L = CV_LABELS[lang];
  const ACC = palette.accent;
  const DARK = palette.primary;
  const TEXT = "#374151";
  const MUTED = "#6B7280";
  const DIVIDER = "#E5E7EB";

  const tagline = sections.tagline.text ?? data.tagline ?? data.jobTitle;
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: "#ffffff", fontFamily: "Helvetica" },

    /* ── Watermark (réduit, discret) ── */
    bgWrap: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "35%",
      height: "100%",
      opacity: 0.35,
    },
    bgImg: { width: "100%", height: "100%", objectFit: "cover" },

    /* ── Contenu principal ── */
    content: { paddingHorizontal: 36, paddingTop: 22, paddingBottom: 24 },

    /* ── Header : ligne fine + titre + ligne ── */
    topLine: { height: 0.8, backgroundColor: DIVIDER, marginBottom: 6 },
    bottomLine: {
      height: 0.8,
      backgroundColor: DIVIDER,
      marginTop: 6,
      marginBottom: 14,
    },
    jobTitleText: {
      fontSize: 9,
      color: ACC,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      textAlign: "center",
    },

    /* ── Nom + photo ── */
    namePhotoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    nameBlock: { flex: 1, paddingRight: 14 },
    nameText: {
      fontSize: 34,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      letterSpacing: -0.8,
      lineHeight: 1.1,
    },
    /* Photo sans border/elevation — simple circle crop */
    photoWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      overflow: "hidden",
      flexShrink: 0,
    },
    photo: { width: 72, height: 72, objectFit: "cover" },

    /* ── Résumé ── */
    summaryText: {
      fontSize: 9.5,
      color: TEXT,
      lineHeight: 1.65,
      marginTop: 12,
      marginBottom: 16,
    },

    /* ── Contact ── */
    contactDivider: { height: 0.8, backgroundColor: DIVIDER, marginBottom: 10 },
    contactRow: { flexDirection: "row", marginBottom: 10 },
    contactCol: { flex: 1 },
    contactLabel: {
      fontSize: 7.5,
      fontFamily: "Helvetica-Bold",
      color: MUTED,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    contactValue: { fontSize: 8.5, color: TEXT },

    /* ── Capacités ── */
    capsTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 7,
      marginTop: 12,
    },
    capItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    capDot: { fontSize: 9, color: ACC, marginRight: 6 },
    capText: { fontSize: 9, color: TEXT, flex: 1, lineHeight: 1.5 },

    /* ── En-tête de section ── */
    secRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      marginBottom: 3,
    },
    secTitle: {
      fontSize: 14,
      fontFamily: "Helvetica-Bold",
      color: ACC,
      letterSpacing: -0.2,
    },
    secLine: {
      flex: 1,
      height: 1,
      backgroundColor: ACC,
      marginLeft: 8,
      marginTop: 3,
    },
    secDivider: { height: 0.5, backgroundColor: DIVIDER, marginBottom: 12 },

    /* ── Expérience ── */
    expItem: {
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    expSquare: {
      width: 7,
      height: 7,
      backgroundColor: ACC,
      marginRight: 9,
      marginTop: 3,
      flexShrink: 0,
    },
    expContent: { flex: 1 },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    expTitle: {
      fontSize: 10.5,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      flex: 1,
    },
    expDate: {
      fontSize: 8.5,
      color: MUTED,
      fontFamily: "Helvetica-Oblique",
      flexShrink: 0,
      marginLeft: 6,
    },
    expCompany: { fontSize: 8.5, color: MUTED, marginBottom: 4 },
    expBullet: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 2.5,
    },
    expBulletDot: { fontSize: 9, color: TEXT, marginRight: 5 },
    expBulletText: { fontSize: 8.5, color: TEXT, flex: 1, lineHeight: 1.5 },

    /* ── Projets ── */
    projItem: { marginBottom: 9 },
    projTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: DARK,
    },
    projDesc: { fontSize: 8.5, color: TEXT, lineHeight: 1.5, marginTop: 1.5 },
    projTags: { fontSize: 7.5, color: ACC, marginTop: 2.5 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Watermark ── */}
        <View style={s.bgWrap}>
          <Image src="/cv-bg.png" style={s.bgImg} />
        </View>

        {/* ── Contenu ── */}
        <View style={s.content}>
          {/* Ligne + titre + ligne */}
          <View style={s.topLine} />
          <Text style={s.jobTitleText}>{tagline}</Text>
          <View style={s.bottomLine} />

          {/* Nom + photo (sans border) */}
          <View style={s.namePhotoRow}>
            <View style={s.nameBlock}>
              <Text style={s.nameText}>
                {CV_PROFILE.name}
                {"\n"}
                {CV_PROFILE.surname}
              </Text>
            </View>
            <View style={s.photoWrap}>
              <Image src={CV_PROFILE.photo} style={s.photo} />
            </View>
          </View>

          {/* Résumé */}
          {sections.summary.visible && summary ? (
            <Text style={s.summaryText}>{summary}</Text>
          ) : null}

          {/* Contact */}
          {sections.contact.visible && (
            <>
              <View style={s.contactDivider} />
              <View style={s.contactRow}>
                <View style={s.contactCol}>
                  <Text style={s.contactLabel}>{L.email}</Text>
                  <Text style={s.contactValue}>{CV_PROFILE.email}</Text>
                </View>
                <View style={s.contactCol}>
                  <Text style={s.contactLabel}>{L.phone}</Text>
                  <Text style={s.contactValue}>{CV_PROFILE.phone}</Text>
                </View>
                <View style={s.contactCol}>
                  <Text style={s.contactLabel}>{L.linkedin}</Text>
                  <Text style={s.contactValue}>{CV_PROFILE.linkedin}</Text>
                </View>
              </View>
              <View style={s.contactDivider} />
            </>
          )}

          {/* Capacités */}
          {sections.capabilities.visible && caps.length > 0 && (
            <>
              <Text style={s.capsTitle}>{L.canDo}</Text>
              {caps.slice(0, 6).map((c, i) => (
                <View key={i} style={s.capItem}>
                  <Text style={s.capDot}>•</Text>
                  <Text style={s.capText}>{c}</Text>
                </View>
              ))}
            </>
          )}

          {/* Expérience */}
          {sections.experience.visible && data.experiences.length > 0 && (
            <>
              <View style={s.secRow}>
                <Text style={s.secTitle}>{L.experience}</Text>
                <View style={s.secLine} />
              </View>
              <View style={s.secDivider} />
              {data.experiences.map((exp) => {
                const raw = stripHtml(exp.description);
                const bullets = raw
                  .split(/(?:\r?\n)+/)
                  .map((b) => b.trim())
                  .filter(Boolean);
                return (
                  <View key={exp.id} style={s.expItem}>
                    <View style={s.expSquare} />
                    <View style={s.expContent}>
                      <View style={s.expHeader}>
                        <Text style={s.expTitle}>{exp.role}</Text>
                        <Text style={s.expDate}>
                          {formatMonth(exp.startDate, false, lang, L.present)} –{" "}
                          {formatMonth(
                            exp.endDate,
                            exp.current,
                            lang,
                            L.present,
                          )}
                        </Text>
                      </View>
                      <Text style={s.expCompany}>
                        {exp.company}
                        {exp.location ? `  ·  ${exp.location}` : ""}
                      </Text>
                      {(bullets.length > 1 ? bullets : [raw])
                        .slice(0, 5)
                        .map((b, i) => (
                          <View key={i} style={s.expBullet}>
                            <Text style={s.expBulletDot}>•</Text>
                            <Text style={s.expBulletText}>{b}</Text>
                          </View>
                        ))}
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* Projets */}
          {sections.projects.visible && data.projects.length > 0 && (
            <>
              <View style={s.secRow}>
                <Text style={s.secTitle}>{L.projects}</Text>
                <View style={s.secLine} />
              </View>
              <View style={s.secDivider} />
              {data.projects.slice(0, 4).map((p) => (
                <View key={p.slug} style={s.projItem}>
                  <Text style={s.projTitle}>{p.title}</Text>
                  <Text style={s.projDesc}>{stripHtml(p.desc)}</Text>
                  {p.tags.length > 0 && (
                    <Text style={s.projTags}>
                      {p.tags.slice(0, 5).join(" · ")}
                    </Text>
                  )}
                </View>
              ))}
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}
