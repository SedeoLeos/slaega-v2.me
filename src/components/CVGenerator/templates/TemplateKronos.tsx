/**
 * Template KRONOS — Template de base (PDF de référence)
 *
 * Design : fond watermark bleu géométrique (cv-bg.png) côté gauche
 * Layout monocolonne :
 *   Header  → titre small-caps + nom très grand + photo circulaire
 *   Contact → 3 colonnes (EMAIL | TÉLÉPHONE | LINKEDIN)
 *   Section → CE QUE JE PEUX RÉALISER
 *   Section → EXPÉRIENCE (marqueur carré bleu)
 *   Section → PROJETS
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

    /* ── Background watermark (absolute, gauche) ── */
    bgWrap: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "42%",
      height: "100%",
    },
    bgImg: { width: "100%", height: "100%", objectFit: "cover" },

    /* ── Content ── */
    content: {
      paddingHorizontal: 36,
      paddingTop: 22,
      paddingBottom: 24,
    },

    /* ── Top thin line + job title + thin line ── */
    topLine: { height: 0.6, backgroundColor: DIVIDER, marginBottom: 5 },
    bottomLine: {
      height: 0.6,
      backgroundColor: DIVIDER,
      marginTop: 5,
      marginBottom: 12,
    },
    jobTitleText: {
      fontSize: 7.5,
      color: ACC,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      textAlign: "center",
    },

    /* ── Name + photo ── */
    namePhotoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    nameBlock: { flex: 1, paddingRight: 12 },
    nameText: {
      fontSize: 34,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      letterSpacing: -0.8,
      lineHeight: 1.08,
    },
    photoWrap: {
      width: 74,
      height: 74,
      borderRadius: 37,
      overflow: "hidden",
      borderWidth: 2.5,
      borderColor: ACC,
      borderStyle: "solid",
      flexShrink: 0,
    },
    photo: { width: 74, height: 74, objectFit: "cover" },

    /* ── Summary ── */
    summaryText: {
      fontSize: 8,
      color: TEXT,
      lineHeight: 1.65,
      marginTop: 10,
      marginBottom: 14,
    },

    /* ── Contact ── */
    contactDivider: { height: 0.6, backgroundColor: DIVIDER, marginBottom: 8 },
    contactRow: { flexDirection: "row", marginBottom: 8 },
    contactCol: { flex: 1 },
    contactLabel: {
      fontSize: 6.5,
      fontFamily: "Helvetica-Bold",
      color: MUTED,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 1.5,
    },
    contactValue: { fontSize: 7.5, color: TEXT },

    /* ── Capabilities ── */
    capsTitle: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 6,
      marginTop: 10,
    },
    capItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 3,
    },
    capDot: { fontSize: 8, color: ACC, marginRight: 5 },
    capText: { fontSize: 8, color: TEXT, flex: 1, lineHeight: 1.45 },

    /* ── Section header ── */
    secRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 14,
      marginBottom: 2,
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
    secDivider: { height: 0.5, backgroundColor: DIVIDER, marginBottom: 10 },

    /* ── Experience item ── */
    expItem: {
      marginBottom: 11,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    expSquare: {
      width: 6,
      height: 6,
      backgroundColor: ACC,
      marginRight: 8,
      marginTop: 2.5,
      flexShrink: 0,
    },
    expContent: { flex: 1 },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    expTitle: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      color: DARK,
      flex: 1,
    },
    expDate: {
      fontSize: 7.5,
      color: MUTED,
      fontFamily: "Helvetica-Oblique",
      flexShrink: 0,
      marginLeft: 6,
    },
    expCompany: { fontSize: 7.5, color: MUTED, marginBottom: 3 },
    expBullet: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 2,
    },
    expBulletDot: { fontSize: 8, color: TEXT, marginRight: 4 },
    expBulletText: { fontSize: 7.5, color: TEXT, flex: 1, lineHeight: 1.4 },

    /* ── Project item ── */
    projItem: { marginBottom: 7 },
    projTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: DARK },
    projDesc: { fontSize: 7.5, color: TEXT, lineHeight: 1.45, marginTop: 1 },
    projTags: { fontSize: 6.5, color: ACC, marginTop: 2 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Background watermark ── */}
        <View style={s.bgWrap}>
          <Image src="/cv-bg.png" style={s.bgImg} />
        </View>

        {/* ── All content ── */}
        <View style={s.content}>
          {/* Thin line + job title + thin line */}
          <View style={s.topLine} />
          <Text style={s.jobTitleText}>{tagline}</Text>
          <View style={s.bottomLine} />

          {/* Name + circular photo */}
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

          {/* Summary */}
          {sections.summary.visible && summary ? (
            <Text style={s.summaryText}>{summary}</Text>
          ) : null}

          {/* Contact bar */}
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

          {/* Capabilities */}
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

          {/* Experience */}
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
                  .map((s) => s.trim())
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
                        .slice(0, 6)
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

          {/* Projects */}
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
