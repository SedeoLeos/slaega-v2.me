/**
 * Template DUO — Two-column sidebar CV
 *
 * Left sidebar  (38%): photo, name, tagline, bio, contact, skills (dot-rating)
 * Right main    (62%): experience, projects
 */
import {
  Page, Document, View, Text, Image, StyleSheet,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; palette: CVPalette; sections: CVSections };

// ── Dot-rating helper ─────────────────────────────────────────────────────────
function SkillDots({ filled, palette }: { filled: number; palette: CVPalette }) {
  return (
    <View style={{ flexDirection: "row", gap: 3 }}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: i <= filled ? palette.accent : "rgba(255,255,255,0.18)",
          }}
        />
      ))}
    </View>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TemplateDuo({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const tagline = sections.tagline.text  ?? data.tagline  ?? "";
  const summary = sections.summary.text  ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: palette.paper, fontFamily: "Helvetica", flexDirection: "row" },

    /* ── Sidebar ── */
    sidebar: {
      width: "38%",
      backgroundColor: palette.sidebar,
      paddingTop: 32, paddingHorizontal: 16, paddingBottom: 28,
    },
    photoWrap: { alignItems: "center", marginBottom: 12 },
    photo: {
      width: 76, height: 76, borderRadius: 38, objectFit: "cover",
      borderWidth: 3, borderColor: palette.accent, borderStyle: "solid",
    },
    sName: {
      fontSize: 15, fontFamily: "Helvetica-Bold", color: palette.onDark,
      letterSpacing: -0.2, textAlign: "center", lineHeight: 1.2, marginBottom: 4,
    },
    sJobTitle: {
      fontSize: 7, color: palette.accent, textAlign: "center",
      fontFamily: "Helvetica-Bold", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 9,
    },
    sSummary: {
      fontSize: 7.5, color: palette.onDarkMuted, lineHeight: 1.55,
      marginBottom: 12, textAlign: "center",
    },
    divider: { height: 0.5, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 11 },

    /* Sidebar section */
    sSecTitle: {
      fontSize: 6, fontFamily: "Helvetica-Bold", color: palette.accent,
      letterSpacing: 2, textTransform: "uppercase", marginBottom: 8,
    },
    sSecWrap: { marginBottom: 12 },

    /* Contact */
    cItem:  { marginBottom: 7 },
    cLabel: { fontSize: 6, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 1 },
    cVal:   { fontSize: 7.5, color: palette.onDark },

    /* Skills */
    skRow: {
      flexDirection: "row", alignItems: "center",
      justifyContent: "space-between", marginBottom: 6,
    },
    skName: { fontSize: 7.5, color: palette.onDark, flex: 1 },

    /* Capabilities */
    capItem:   { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
    capBullet: {
      width: 3, height: 3, backgroundColor: palette.accent, borderRadius: 1.5,
      marginTop: 3.5, marginRight: 7, flexShrink: 0,
    },
    capText: { fontSize: 7.5, color: palette.onDarkMuted, flex: 1, lineHeight: 1.45 },

    /* ── Main ── */
    main: { flex: 1, paddingTop: 32, paddingHorizontal: 20, paddingBottom: 28 },

    secWrap: { marginBottom: 16 },
    secRow:  { flexDirection: "row", alignItems: "center", marginBottom: 9 },
    secLabel: {
      fontSize: 8, fontFamily: "Helvetica-Bold", color: palette.primary,
      letterSpacing: 1.5, textTransform: "uppercase",
    },
    secLine: { flex: 1, height: 0.5, backgroundColor: palette.border, marginLeft: 8 },

    /* Jobs */
    job:        { marginBottom: 11, flexDirection: "column" },
    jobTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    jobTitle:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: palette.primary, flex: 1 },
    jobDate:    { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", flexShrink: 0, marginLeft: 4 },
    jobCo:      { fontSize: 7.5, color: palette.accent, fontFamily: "Helvetica-Bold", letterSpacing: 0.3, marginBottom: 3 },
    jobDesc:    { fontSize: 7.5, color: palette.body, lineHeight: 1.5 },
    jobTags:    { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", marginTop: 2 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ SIDEBAR ═══ */}
        <View style={s.sidebar}>

          <View style={s.photoWrap}>
            <Image src={CV_PROFILE.photo} style={s.photo} />
          </View>

          <Text style={s.sName}>
            {CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}
          </Text>

          {sections.tagline.visible && tagline
            ? <Text style={s.sJobTitle}>{tagline}</Text>
            : <Text style={s.sJobTitle}>{data.jobTitle}</Text>
          }

          {sections.summary.visible && summary
            ? <Text style={s.sSummary}>{summary}</Text>
            : null
          }

          <View style={s.divider} />

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

          <View style={s.divider} />

          {/* Skills with dots */}
          {sections.skills.visible && data.allSkills.length > 0 && (
            <View style={s.sSecWrap}>
              <Text style={s.sSecTitle}>{L.skills}</Text>
              {data.allSkills.slice(0, 11).map((sk) => (
                <View key={sk} style={s.skRow}>
                  <Text style={s.skName}>{sk}</Text>
                  <SkillDots filled={data.relevantSkills.includes(sk) ? 3 : 2} palette={palette} />
                </View>
              ))}
            </View>
          )}

          {/* Capabilities */}
          {sections.capabilities.visible && caps.length > 0 && (
            <>
              <View style={s.divider} />
              <View style={s.sSecWrap}>
                <Text style={s.sSecTitle}>{L.canDo}</Text>
                {caps.map((c, i) => (
                  <View key={i} style={s.capItem}>
                    <View style={s.capBullet} />
                    <Text style={s.capText}>{c}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ═══ MAIN ═══ */}
        <View style={s.main}>

          {/* Experience */}
          {sections.experience.visible && data.experiences.length > 0 && (
            <View style={s.secWrap}>
              <View style={s.secRow}>
                <Text style={s.secLabel}>{L.experience}</Text>
                <View style={s.secLine} />
              </View>
              {data.experiences.map((exp) => (
                <View key={exp.id} style={s.job}>
                  <View style={s.jobTop}>
                    <Text style={s.jobTitle}>{exp.role}</Text>
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
                <Text style={s.secLabel}>{L.projects}</Text>
                <View style={s.secLine} />
              </View>
              {data.projects.slice(0, 4).map((p) => (
                <View key={p.slug} style={s.job}>
                  <Text style={s.jobTitle}>{p.title}</Text>
                  <Text style={s.jobDesc}>{stripHtml(p.desc)}</Text>
                  {p.tags.length > 0 && (
                    <Text style={s.jobTags}>{p.tags.slice(0, 6).join(" · ")}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

        </View>
      </Page>
    </Document>
  );
}
