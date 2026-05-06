/**
 * Template PULSE — Card-based UI/UX Designer style
 *
 * Left  (45%): greeting + name + job title, Education cards grid, Experience cards grid
 * Right (55%): contact pills, photo + bio, skills hashtags, interests chips
 *
 * Inspiré du design "Julien vander Woerd — UI/UX Designer"
 */
import {
  Page, Document, View, Text, Image, StyleSheet,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; palette: CVPalette; sections: CVSections };

export default function TemplatePulse({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  /* ── palette shortcuts ── */
  const BG     = "#f4f5f7";   // page background (light gray)
  const CARD   = "#ffffff";   // card bg
  const BORDER = "#e8eaed";   // card border
  const NAVY   = palette.primary;
  const ACC    = palette.accent;

  const s = StyleSheet.create({
    page: { backgroundColor: BG, fontFamily: "Helvetica", flexDirection: "row" },

    /* ═══ LEFT COLUMN ═══ */
    left: {
      width: "44%",
      paddingTop: 28, paddingBottom: 24, paddingLeft: 22, paddingRight: 12,
      flexDirection: "column", gap: 10,
    },

    /* Header */
    greeting: { fontSize: 8.5, color: NAVY, marginBottom: 2 },
    name: {
      fontSize: 18, fontFamily: "Helvetica-Bold", color: NAVY,
      lineHeight: 1.15, letterSpacing: -0.3, marginBottom: 1,
    },
    jobTitleHL: {
      fontSize: 14, fontFamily: "Helvetica-Bold", color: ACC,
      lineHeight: 1.2, marginBottom: 8,
    },

    /* Card section wrapper */
    cardSection: {
      backgroundColor: CARD, borderRadius: 10, borderWidth: 1,
      borderColor: BORDER, borderStyle: "solid",
      paddingHorizontal: 10, paddingVertical: 8,
    },
    cardSecLabel: {
      fontSize: 7.5, fontFamily: "Helvetica-Bold", color: NAVY,
      textAlign: "center", marginBottom: 6,
    },

    /* Card grid — 2 columns */
    cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    card: {
      width: "47%", backgroundColor: BG, borderRadius: 6,
      borderWidth: 1, borderColor: BORDER, borderStyle: "solid",
      padding: 6, flexDirection: "column", gap: 2,
    },
    cardHighlight: {
      width: "47%", backgroundColor: ACC + "18", borderRadius: 6,
      borderWidth: 1, borderColor: ACC + "40", borderStyle: "solid",
      padding: 6, flexDirection: "column", gap: 2,
    },
    cardYear:  { fontSize: 6, color: "#999", letterSpacing: 0.5 },
    cardTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: NAVY, lineHeight: 1.3 },
    cardTitleHL: { fontSize: 8, fontFamily: "Helvetica-Bold", color: ACC, lineHeight: 1.3 },
    cardTags:  { fontSize: 6, color: "#888", lineHeight: 1.4 },
    cardSub:   { fontSize: 6, color: ACC, marginTop: 1 },

    /* ═══ RIGHT COLUMN ═══ */
    right: {
      flex: 1,
      paddingTop: 28, paddingBottom: 24, paddingLeft: 10, paddingRight: 22,
      flexDirection: "column", gap: 10,
    },

    /* Contact pills */
    pillRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
    pill: {
      backgroundColor: ACC, borderRadius: 20,
      paddingHorizontal: 9, paddingVertical: 3,
    },
    pillText: { fontSize: 7, color: "#fff", fontFamily: "Helvetica-Bold" },
    pillOutline: {
      borderWidth: 1, borderColor: ACC, borderStyle: "solid",
      borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3,
    },
    pillOutlineText: { fontSize: 7, color: ACC, fontFamily: "Helvetica-Oblique" },

    /* Photo + bio card */
    bioCard: {
      backgroundColor: CARD, borderRadius: 10, borderWidth: 1,
      borderColor: BORDER, borderStyle: "solid",
      padding: 10, flexDirection: "row", gap: 8,
    },
    photo: { width: 60, height: 60, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
    bioText: { flex: 1, fontSize: 7.5, color: NAVY, lineHeight: 1.6 },

    /* Skills card */
    skillCard: {
      backgroundColor: CARD, borderRadius: 10, borderWidth: 1,
      borderColor: BORDER, borderStyle: "solid",
      paddingHorizontal: 10, paddingVertical: 8,
    },
    skillCardLabel: {
      fontSize: 7.5, fontFamily: "Helvetica-Bold", color: NAVY,
      textAlign: "center", marginBottom: 7,
    },
    hashWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    hashChip: {
      paddingHorizontal: 6, paddingVertical: 2.5,
      borderRadius: 20, borderWidth: 1,
      borderColor: BORDER, borderStyle: "solid",
    },
    hashChipHL: {
      paddingHorizontal: 6, paddingVertical: 2.5,
      borderRadius: 20, backgroundColor: ACC,
    },
    hashText:   { fontSize: 6.5, color: "#555" },
    hashTextHL: { fontSize: 6.5, color: "#fff", fontFamily: "Helvetica-Bold" },

    /* Caps card */
    capsCard: {
      backgroundColor: CARD, borderRadius: 10, borderWidth: 1,
      borderColor: BORDER, borderStyle: "solid",
      paddingHorizontal: 10, paddingVertical: 8,
    },
    capsLabel: {
      fontSize: 7.5, fontFamily: "Helvetica-Bold", color: NAVY,
      textAlign: "center", marginBottom: 7,
    },
    capsText: { fontSize: 7.5, color: NAVY, lineHeight: 1.6 },
    capsKeyword: { fontSize: 7.5, color: ACC, fontFamily: "Helvetica-Bold" },

    /* Interests card */
    intCard: {
      backgroundColor: CARD, borderRadius: 10, borderWidth: 1,
      borderColor: BORDER, borderStyle: "solid",
      paddingHorizontal: 10, paddingVertical: 8,
    },
    intLabel: {
      fontSize: 7.5, fontFamily: "Helvetica-Bold", color: NAVY,
      textAlign: "center", marginBottom: 7,
    },
    intGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    intChip: {
      paddingHorizontal: 8, paddingVertical: 3,
      borderRadius: 20, borderWidth: 1,
      borderColor: BORDER, borderStyle: "solid",
      backgroundColor: BG,
    },
    intChipHL: {
      paddingHorizontal: 8, paddingVertical: 3,
      borderRadius: 20, backgroundColor: ACC + "25",
    },
    intText:   { fontSize: 7, color: NAVY },
    intTextHL: { fontSize: 7, color: ACC, fontFamily: "Helvetica-Bold" },
  });

  /* ── Helpers ── */
  const tagline = sections.tagline.text ?? data.tagline ?? data.jobTitle;

  /* split experiences into pairs for card grid */
  function chunkPairs<T>(arr: T[]): [T, T | null][] {
    const pairs: [T, T | null][] = [];
    for (let i = 0; i < arr.length; i += 2) {
      pairs.push([arr[i], arr[i + 1] ?? null]);
    }
    return pairs;
  }

  const expPairs = chunkPairs(data.experiences.slice(0, 6));

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ LEFT ═══ */}
        <View style={s.left}>

          {/* Greeting + Name + Title */}
          <View>
            <Text style={s.greeting}>Hello, I'm</Text>
            <Text style={s.name}>{CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}</Text>
            <Text style={s.jobTitleHL}>{tagline ?? data.jobTitle}</Text>
          </View>

          {/* Capabilities card */}
          {sections.capabilities.visible && caps.length > 0 && (
            <View style={s.cardSection}>
              <Text style={s.cardSecLabel}>{L.canDo}</Text>
              {caps.map((c, i) => (
                <Text key={i} style={s.capsText}>{c}</Text>
              ))}
            </View>
          )}

          {/* Experience card grid */}
          {sections.experience.visible && data.experiences.length > 0 && (
            <View style={s.cardSection}>
              <Text style={s.cardSecLabel}>{L.experience}</Text>
              <View style={s.cardGrid}>
                {data.experiences.slice(0, 6).map((exp, idx) => {
                  const hi = idx === 0;
                  return (
                    <View key={exp.id} style={hi ? s.cardHighlight : s.card}>
                      <Text style={s.cardYear}>
                        {formatMonth(exp.startDate, false, lang, L.present)}–{formatMonth(exp.endDate, exp.current, lang, L.present)}
                      </Text>
                      <Text style={hi ? s.cardTitleHL : s.cardTitle}>{exp.role}</Text>
                      {exp.skills.length > 0 && (
                        <Text style={s.cardTags}>{exp.skills.slice(0, 4).map(sk => `#${sk}`).join(" ")}</Text>
                      )}
                      <Text style={s.cardSub}>{exp.company}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Projects card grid */}
          {sections.projects.visible && data.projects.length > 0 && (
            <View style={s.cardSection}>
              <Text style={s.cardSecLabel}>{L.projects}</Text>
              <View style={s.cardGrid}>
                {data.projects.slice(0, 4).map((p, idx) => {
                  const hi = idx === 0;
                  return (
                    <View key={p.slug} style={hi ? s.cardHighlight : s.card}>
                      <Text style={hi ? s.cardTitleHL : s.cardTitle}>{p.title}</Text>
                      {p.tags.length > 0 && (
                        <Text style={s.cardTags}>{p.tags.slice(0, 4).map(t => `#${t}`).join(" ")}</Text>
                      )}
                      <Text style={s.cardSub}>{stripHtml(p.desc).slice(0, 60)}…</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* ═══ RIGHT ═══ */}
        <View style={s.right}>

          {/* Contact pills */}
          {sections.contact.visible && (
            <View style={s.pillRow}>
              <View style={s.pill}>
                <Text style={s.pillText}>{CV_PROFILE.phone}</Text>
              </View>
              <View style={s.pillOutline}>
                <Text style={s.pillOutlineText}>{CV_PROFILE.email}</Text>
              </View>
              <View style={s.pillOutline}>
                <Text style={s.pillOutlineText}>{CV_PROFILE.linkedin}</Text>
              </View>
            </View>
          )}

          {/* Photo + bio */}
          {sections.summary.visible && summary && (
            <View style={s.bioCard}>
              <Image src={CV_PROFILE.photo} style={s.photo} />
              <Text style={s.bioText}>{summary}</Text>
            </View>
          )}

          {/* Skills hashtags */}
          {sections.skills.visible && data.allSkills.length > 0 && (
            <View style={s.skillCard}>
              <Text style={s.skillCardLabel}>{L.skills}</Text>
              <View style={s.hashWrap}>
                {data.allSkills.map((sk) => {
                  const rel = data.relevantSkills.includes(sk);
                  return (
                    <View key={sk} style={rel ? s.hashChipHL : s.hashChip}>
                      <Text style={rel ? s.hashTextHL : s.hashText}>#{sk}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Keywords / interests as chips */}
          {data.keywords.length > 0 && (
            <View style={s.intCard}>
              <Text style={s.intLabel}>Mots-clés</Text>
              <View style={s.intGrid}>
                {data.keywords.slice(0, 10).map((k, i) => {
                  const hi = i < 3;
                  return (
                    <View key={k} style={hi ? s.intChipHL : s.intChip}>
                      <Text style={hi ? s.intTextHL : s.intText}>{k}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

        </View>
      </Page>
    </Document>
  );
}
