/**
 * Template KRONOS — react-pdf version
 *
 * Design fidèle au template HTML original : layout single-colonne,
 * barre d'accent sur les titres de section, border-left sur les jobs,
 * grille 3 colonnes pour les compétences.
 * Pas de SVG en position absolue (cause des artefacts dans react-pdf).
 */
import {
  Page, Document, View, Text, Image, StyleSheet, Svg, Path, Rect,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import {
  CV_PROFILE, CV_LABELS, formatMonth, stripHtml,
} from "../cv-types";

// ── Icon helpers ──────────────────────────────────────────────────────────────
function IconEmail({ color }: { color: string }) {
  return (
    <Svg width={10} height={10} viewBox="0 0 24 24">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconPhone({ color }: { color: string }) {
  return (
    <Svg width={10} height={10} viewBox="0 0 24 24">
      <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconLinkedin({ color }: { color: string }) {
  return (
    <Svg width={10} height={10} viewBox="0 0 24 24">
      <Path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="2" y="9" width="4" height="12" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M6 6a2 2 0 11-4 0 2 2 0 014 0z" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  );
}

// ── Main document ─────────────────────────────────────────────────────────────
type Props = {
  data: CVData;
  palette: CVPalette;
  sections: CVSections;
};

export default function TemplateKronos({ data, palette, sections }: Props) {
  const lang: "fr" | "en" = data.language ?? "fr";
  const L = CV_LABELS[lang];

  const tagline = sections.tagline.text ?? data.tagline ?? "";
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: palette.paper, fontFamily: "Helvetica" },
    body: { padding: 36 },

    // ── Accent top bar (décoratif, in-flow)
    topBar: { height: 4, backgroundColor: palette.accent, marginBottom: 22, borderRadius: 2 },

    // ── Header
    header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
    headerLeft:  { flex: 1 },
    jobTitle:    { fontSize: 8, fontFamily: "Helvetica-Bold", color: palette.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 },
    divider:     { width: 48, height: 1.5, backgroundColor: palette.accent, marginBottom: 8 },
    name:        { fontSize: 22, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: -0.3, lineHeight: 1.1 },
    photo:       { width: 68, height: 68, borderRadius: 4, objectFit: "cover" },

    // ── Bio
    bio: { fontSize: 8.5, color: palette.body, lineHeight: 1.6, marginTop: 12, marginBottom: 12, maxWidth: "80%" },

    // ── Contact row
    contactRow:   { flexDirection: "row", gap: 0, marginBottom: 16, borderTopWidth: 1, borderTopColor: palette.border, borderTopStyle: "solid", paddingTop: 10 },
    contactItem:  { flex: 1, paddingRight: 8 },
    contactLabel: { fontSize: 6, fontFamily: "Helvetica-Bold", color: palette.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 2, marginTop: 3 },
    contactVal:   { fontSize: 7.5, color: palette.body },

    // ── Capabilities
    caps:      { marginBottom: 16 },
    miniHead:  { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: palette.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 },
    capItem:   { flexDirection: "row", alignItems: "flex-start", marginBottom: 3 },
    capBullet: { width: 3.5, height: 3.5, backgroundColor: palette.accent, borderRadius: 1, marginTop: 3, marginRight: 7, flexShrink: 0 },
    capText:   { fontSize: 8, color: palette.body, flex: 1, lineHeight: 1.45 },

    // ── Section title (barre accent + label)
    section:      { marginTop: 14 },
    sectionHead:  { flexDirection: "row", alignItems: "center", marginBottom: 9 },
    sectionBar:   { width: 4, height: 19, backgroundColor: palette.primary, marginRight: 8, borderRadius: 1 },
    sectionLabel: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: 0.3 },

    // ── Job entries (border-left fidèle à l'original)
    job:         { marginBottom: 13, paddingLeft: 16, borderLeftWidth: 2, borderLeftColor: palette.border, borderLeftStyle: "solid" },
    jobRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    jobTitleRow: { flexDirection: "row", alignItems: "center", flex: 1 },
    jobDot:      { width: 5, height: 5, backgroundColor: palette.primary, borderRadius: 1, marginLeft: -19.5, marginRight: 7, flexShrink: 0 },
    jobName:     { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: palette.primary, flex: 1 },
    jobDate:     { fontSize: 7, color: palette.muted, fontFamily: "Helvetica-Oblique", flexShrink: 0 },
    jobCompany:  { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: palette.muted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3, marginTop: 1 },
    jobDesc:     { fontSize: 7.5, color: palette.body, lineHeight: 1.5 },
    jobTags:     { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", marginTop: 3 },

    // ── Skills grid (3 colonnes via flexWrap)
    skillsGrid: { flexDirection: "row", flexWrap: "wrap" },
    skillItem:  { width: "33%", flexDirection: "row", alignItems: "center", marginBottom: 5, paddingRight: 8 },
    skillDot:   { width: 4, height: 4, borderRadius: 1, marginRight: 5, flexShrink: 0 },
    skillText:  { fontSize: 7.5, color: palette.body },
    skillBold:  { fontSize: 7.5, color: palette.primary, fontFamily: "Helvetica-Bold" },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.body}>

          {/* Barre décorative en haut (in-flow, pas de position absolue) */}
          <View style={s.topBar} />

          {/* Header : nom + accroche + photo */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              {sections.tagline.visible && tagline ? (
                <Text style={s.jobTitle}>{tagline}</Text>
              ) : (
                <Text style={s.jobTitle}>{data.jobTitle}</Text>
              )}
              <View style={s.divider} />
              <Text style={s.name}>
                {CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}
              </Text>
            </View>
            <Image src={CV_PROFILE.photo} style={s.photo} />
          </View>

          {/* Bio */}
          {sections.summary.visible && summary ? (
            <Text style={s.bio}>{summary}</Text>
          ) : null}

          {/* Contact */}
          {sections.contact.visible ? (
            <View style={s.contactRow}>
              <View style={s.contactItem}>
                <IconEmail color={palette.accent} />
                <Text style={s.contactLabel}>{L.email}</Text>
                <Text style={s.contactVal}>{CV_PROFILE.email}</Text>
              </View>
              <View style={s.contactItem}>
                <IconPhone color={palette.accent} />
                <Text style={s.contactLabel}>{L.phone}</Text>
                <Text style={s.contactVal}>{CV_PROFILE.phone}</Text>
              </View>
              <View style={s.contactItem}>
                <IconLinkedin color={palette.accent} />
                <Text style={s.contactLabel}>{L.linkedin}</Text>
                <Text style={s.contactVal}>{CV_PROFILE.linkedin}</Text>
              </View>
            </View>
          ) : null}

          {/* Ce que j'apporte */}
          {sections.capabilities.visible && caps.length > 0 ? (
            <View style={s.caps}>
              <Text style={s.miniHead}>{L.canDo}</Text>
              {caps.map((c, i) => (
                <View key={i} style={s.capItem}>
                  <View style={s.capBullet} />
                  <Text style={s.capText}>{c}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Expériences */}
          {sections.experience.visible && data.experiences.length > 0 ? (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <View style={s.sectionBar} />
                <Text style={s.sectionLabel}>{L.experience}</Text>
              </View>
              {data.experiences.map((exp) => (
                <View key={exp.id} style={s.job}>
                  <View style={s.jobRow}>
                    <View style={s.jobTitleRow}>
                      <View style={s.jobDot} />
                      <Text style={s.jobName}>{exp.role}</Text>
                    </View>
                    <Text style={s.jobDate}>
                      {formatMonth(exp.startDate, false, lang, L.present)} – {formatMonth(exp.endDate, exp.current, lang, L.present)}
                    </Text>
                  </View>
                  <Text style={s.jobCompany}>
                    {exp.company.toUpperCase()}{exp.location ? ` · ${exp.location}` : ""}
                  </Text>
                  <Text style={s.jobDesc}>{stripHtml(exp.description)}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Projets */}
          {sections.projects.visible && data.projects.length > 0 ? (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <View style={s.sectionBar} />
                <Text style={s.sectionLabel}>{L.projects}</Text>
              </View>
              {data.projects.slice(0, 5).map((p) => (
                <View key={p.slug} style={s.job}>
                  <View style={s.jobRow}>
                    <View style={s.jobTitleRow}>
                      <View style={s.jobDot} />
                      <Text style={s.jobName}>{p.title}</Text>
                    </View>
                  </View>
                  <Text style={s.jobDesc}>{stripHtml(p.desc)}</Text>
                  {p.tags.length > 0 ? (
                    <Text style={s.jobTags}>{p.tags.slice(0, 6).join(" · ")}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {/* Compétences — grille 3 colonnes */}
          {sections.skills.visible && data.allSkills.length > 0 ? (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <View style={s.sectionBar} />
                <Text style={s.sectionLabel}>{L.skills}</Text>
              </View>
              <View style={s.skillsGrid}>
                {data.allSkills.map((sk) => {
                  const relevant = data.relevantSkills.includes(sk);
                  return (
                    <View key={sk} style={s.skillItem}>
                      <View style={[s.skillDot, { backgroundColor: relevant ? palette.primary : palette.border }]} />
                      <Text style={relevant ? s.skillBold : s.skillText}>{sk}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}

        </View>
      </Page>
    </Document>
  );
}
