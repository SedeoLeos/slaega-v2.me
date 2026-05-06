/**
 * Template KRONOS — react-pdf version
 *
 * Layout: full-page with a decorative geometric pattern on the left (~35%),
 * bold oversized name, accent bars on section titles.
 */
import {
  Page, Document, View, Text, Image, StyleSheet, Svg, Path, G, Rect,
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

// ── Decorative geometric background ─────────────────────────────────────────
function GeometricBg({ palette }: { palette: CVPalette }) {
  const c1 = palette.sidebar;
  const c2 = palette.accent;
  return (
    <Svg
      width={215}
      height={842}
      viewBox="0 0 215 842"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {/* Base rect */}
      <Rect x={0} y={0} width={215} height={842} fill={c1} opacity={0.06} />
      {/* Large diagonal shape */}
      <Path d={`M0,0 L180,0 L215,60 L215,842 L0,842 Z`} fill={c1} opacity={0.07} />
      {/* Accent triangle top */}
      <Path d={`M0,0 L140,0 L0,180 Z`} fill={c1} opacity={0.12} />
      {/* Small accent dots */}
      <Path d="M30 40 m0 0 a6 6 0 1 0 0.001 0" fill={c2} opacity={0.5} />
      <Path d="M55 75 m0 0 a4 4 0 1 0 0.001 0" fill={c2} opacity={0.4} />
      <Path d="M15 120 m0 0 a3 3 0 1 0 0.001 0" fill={c2} opacity={0.3} />
      {/* Vertical accent line */}
      <Rect x={190} y={0} width={3} height={842} fill={c2} opacity={0.15} />
      {/* Bottom geometric */}
      <Path d={`M0,740 L215,690 L215,842 L0,842 Z`} fill={c1} opacity={0.08} />
      {/* Grid dots pattern */}
      {[60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580, 620, 660, 700].map((y, i) =>
        [30, 70, 110, 150].map((x, j) => (
          <Rect key={`d-${i}-${j}`} x={x} y={y} width={2} height={2} fill={c1} opacity={0.15} rx={1} />
        ))
      )}
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

  const tagline  = sections.tagline.text      ?? data.tagline  ?? "";
  const summary  = sections.summary.text      ?? stripHtml(data.summary ?? "");
  const caps     = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page:  { backgroundColor: palette.paper, fontFamily: "Helvetica", position: "relative" },
    body:  { paddingTop: 28, paddingBottom: 24, paddingLeft: 30, paddingRight: 32 },

    // Header
    header:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
    headerLeft: { flex: 1 },
    tagline:    { fontSize: 7.5, color: palette.primary, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 },
    divider:    { width: "60%", height: 1.5, backgroundColor: palette.accent, marginBottom: 10 },
    name:       { fontSize: 24, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: -0.5, lineHeight: 1.1 },
    photo:      { width: 72, height: 72, borderRadius: 36, objectFit: "cover" },

    // Bio
    bio:  { fontSize: 8.5, color: palette.body, lineHeight: 1.55, marginTop: 10, marginBottom: 10, maxWidth: "72%" },

    // Contact row
    contactRow:   { flexDirection: "row", marginBottom: 14, gap: 8 },
    contactItem:  { flex: 1 },
    contactIcon:  { marginBottom: 2 },
    contactLabel: { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 1 },
    contactVal:   { fontSize: 7.5, color: palette.body },

    // Capabilities
    caps:      { marginBottom: 14 },
    miniHead:  { fontSize: 7, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 },
    capItem:   { flexDirection: "row", alignItems: "flex-start", marginBottom: 3 },
    capBullet: { width: 4, height: 4, backgroundColor: palette.accent, borderRadius: 2, marginTop: 2.5, marginRight: 6, flexShrink: 0 },
    capText:   { fontSize: 8, color: palette.body, flex: 1, lineHeight: 1.4 },

    // Section
    section:      { marginTop: 12 },
    sectionTitle: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    sectionBar:   { width: 3, height: 14, backgroundColor: palette.accent, marginRight: 7, borderRadius: 1.5 },
    sectionLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: 0.5 },

    // Jobs
    job:          { marginBottom: 10, paddingLeft: 12, borderLeftWidth: 1.5, borderLeftColor: palette.border, borderLeftStyle: "solid", position: "relative" },
    jobHeader:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    jobTitleRow:  { flexDirection: "row", alignItems: "center", flex: 1 },
    jobDot:       { width: 5, height: 5, backgroundColor: palette.accent, borderRadius: 1, marginLeft: -14.5, marginRight: 6, flexShrink: 0 },
    jobTitle:     { fontSize: 9, fontFamily: "Helvetica-Bold", color: palette.primary, flex: 1 },
    jobDate:      { fontSize: 7, color: palette.muted, fontFamily: "Helvetica-Oblique" },
    jobCompany:   { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: palette.muted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 },
    jobDesc:      { fontSize: 7.5, color: palette.body, lineHeight: 1.5 },
    jobTags:      { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", marginTop: 2 },

    // Skills
    skillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    skillChip:  { paddingHorizontal: 7, paddingVertical: 2.5, borderRadius: 3, marginRight: 4, marginBottom: 4 },
    skillText:  { fontSize: 7 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <GeometricBg palette={palette} />

        <View style={s.body}>
          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              {sections.tagline.visible && tagline ? (
                <Text style={s.tagline}>{tagline}</Text>
              ) : null}
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
                <View style={s.contactIcon}><IconEmail color={palette.accent} /></View>
                <Text style={s.contactLabel}>{L.email}</Text>
                <Text style={s.contactVal}>{CV_PROFILE.email}</Text>
              </View>
              <View style={s.contactItem}>
                <View style={s.contactIcon}><IconPhone color={palette.accent} /></View>
                <Text style={s.contactLabel}>{L.phone}</Text>
                <Text style={s.contactVal}>{CV_PROFILE.phone}</Text>
              </View>
              <View style={s.contactItem}>
                <View style={s.contactIcon}><IconLinkedin color={palette.accent} /></View>
                <Text style={s.contactLabel}>{L.linkedin}</Text>
                <Text style={s.contactVal}>{CV_PROFILE.linkedin}</Text>
              </View>
            </View>
          ) : null}

          {/* Capabilities */}
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

          {/* Experience */}
          {sections.experience.visible && data.experiences.length > 0 ? (
            <View style={s.section}>
              <View style={s.sectionTitle}>
                <View style={s.sectionBar} />
                <Text style={s.sectionLabel}>{L.experience}</Text>
              </View>
              {data.experiences.map((exp) => (
                <View key={exp.id} style={s.job}>
                  <View style={s.jobHeader}>
                    <View style={s.jobTitleRow}>
                      <View style={s.jobDot} />
                      <Text style={s.jobTitle}>{exp.role}</Text>
                    </View>
                    <Text style={s.jobDate}>
                      {formatMonth(exp.startDate, false, lang, L.present)} – {formatMonth(exp.endDate, exp.current, lang, L.present)}
                    </Text>
                  </View>
                  <Text style={s.jobCompany}>
                    {exp.company.toUpperCase()}{exp.location ? `, ${exp.location.toUpperCase()}` : ""}
                  </Text>
                  <Text style={s.jobDesc}>{stripHtml(exp.description)}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Projects */}
          {sections.projects.visible && data.projects.length > 0 ? (
            <View style={s.section}>
              <View style={s.sectionTitle}>
                <View style={s.sectionBar} />
                <Text style={s.sectionLabel}>{L.projects}</Text>
              </View>
              {data.projects.slice(0, 5).map((p) => (
                <View key={p.slug} style={s.job}>
                  <View style={s.jobHeader}>
                    <View style={s.jobTitleRow}>
                      <View style={s.jobDot} />
                      <Text style={s.jobTitle}>{p.title}</Text>
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

          {/* Skills */}
          {sections.skills.visible && data.allSkills.length > 0 ? (
            <View style={s.section}>
              <View style={s.sectionTitle}>
                <View style={s.sectionBar} />
                <Text style={s.sectionLabel}>{L.skills}</Text>
              </View>
              <View style={s.skillsGrid}>
                {data.allSkills.map((sk) => {
                  const relevant = data.relevantSkills.includes(sk);
                  return (
                    <View key={sk} style={[s.skillChip, { backgroundColor: relevant ? palette.accentLight : palette.border }]}>
                      <Text style={[s.skillText, { color: relevant ? palette.accent : palette.muted, fontFamily: relevant ? "Helvetica-Bold" : "Helvetica" }]}>
                        {sk}
                      </Text>
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
