/**
 * Template NEXUS — react-pdf version
 *
 * Layout: dark sidebar (28%) + white main content (72%)
 * Sidebar: photo, name/role, contact with SVG icons, skills pills
 * Main: tagline, summary, experience, projects
 */
import {
  Page, Document, View, Text, Image, StyleSheet, Svg, Path, Rect, Circle,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function IconEmail({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M3 7l9 6 9-6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}
function IconPhone({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.36 11.36 0 003.54.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.54 1 1 0 01-.27 1.11z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconLinkedin({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Rect x="2" y="2" width="20" height="20" rx="3" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4M11 10v7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}
function IconStar({ color }: { color: string }) {
  return (
    <Svg width={8} height={8} viewBox="0 0 24 24">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} />
    </Svg>
  );
}

// ── Sidebar decorative pattern ────────────────────────────────────────────────
function SidebarDecor({ palette }: { palette: CVPalette }) {
  return (
    <Svg width={168} height={842} viewBox="0 0 168 842" style={{ position: "absolute", top: 0, left: 0 }}>
      {/* Subtle grid dots */}
      {[0.15, 0.2, 0.12, 0.18, 0.1].map((op, row) =>
        [20, 60, 100, 140].map((x, col) => (
          <Circle
            key={`${row}-${col}`}
            cx={x}
            cy={80 + row * 160 + col * 8}
            r={1.5}
            fill={palette.onDark}
            opacity={op}
          />
        ))
      )}
      {/* Bottom accent triangle */}
      <Path d="M0 780 L168 820 L168 842 L0 842 Z" fill={palette.accent} opacity={0.18} />
      {/* Top accent bar */}
      <Rect x={0} y={0} width={168} height={4} fill={palette.accent} opacity={0.6} />
    </Svg>
  );
}

// ── Main document ─────────────────────────────────────────────────────────────
type Props = { data: CVData; palette: CVPalette; sections: CVSections };

export default function TemplateNexus({ data, palette, sections }: Props) {
  const lang: "fr" | "en" = data.language ?? "fr";
  const L = CV_LABELS[lang];

  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: palette.paper, fontFamily: "Helvetica", flexDirection: "row" },

    // Sidebar
    sidebar:         { width: 168, backgroundColor: palette.sidebar, position: "relative", paddingTop: 32, paddingBottom: 24, paddingHorizontal: 16, flexShrink: 0 },
    photoWrap:       { alignItems: "center", marginBottom: 14 },
    photo:           { width: 80, height: 80, borderRadius: 40, objectFit: "cover", borderWidth: 3, borderColor: palette.accent, borderStyle: "solid" },
    sidebarName:     { fontSize: 13, fontFamily: "Helvetica-Bold", color: palette.onDark, textAlign: "center", letterSpacing: -0.3, lineHeight: 1.2, marginBottom: 3 },
    sidebarRole:     { fontSize: 7.5, color: palette.onDarkMuted, textAlign: "center", textTransform: "uppercase", letterSpacing: 1, marginBottom: 18 },

    sectionDivider:  { height: 1, backgroundColor: palette.accent, opacity: 0.3, marginBottom: 10, marginTop: 2 },
    sbSectionLabel:  { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: palette.accent, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 },

    contactItem:     { flexDirection: "row", alignItems: "flex-start", marginBottom: 8, gap: 6 },
    contactIcon:     { marginTop: 1 },
    contactTexts:    {},
    contactLabel:    { fontSize: 6, fontFamily: "Helvetica-Bold", color: palette.onDarkMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 1 },
    contactVal:      { fontSize: 7, color: palette.onDark, lineHeight: 1.3 },

    skillChip:       { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10, marginRight: 4, marginBottom: 4, backgroundColor: "rgba(255,255,255,0.1)" },
    skillText:       { fontSize: 6.5, color: palette.onDark },
    skillRelevant:   { backgroundColor: palette.accent, opacity: 0.9 },
    skillsWrap:      { flexDirection: "row", flexWrap: "wrap" },

    // Main
    main:       { flex: 1, paddingTop: 28, paddingBottom: 24, paddingLeft: 22, paddingRight: 28 },
    tagline:    { fontSize: 7.5, color: palette.muted, fontFamily: "Helvetica-BoldOblique", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 },
    jobTitle:   { fontSize: 20, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: -0.3, lineHeight: 1.1, marginBottom: 14 },
    accentLine: { width: 40, height: 3, backgroundColor: palette.accent, marginBottom: 14, borderRadius: 2 },

    summary:    { fontSize: 8, color: palette.body, lineHeight: 1.6, marginBottom: 14, borderLeftWidth: 2, borderLeftColor: palette.accent, borderLeftStyle: "solid", paddingLeft: 10 },

    // Capabilities
    capsGrid:   { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 16 },
    capBadge:   { flexDirection: "row", alignItems: "center", backgroundColor: palette.accentLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 3, gap: 4 },
    capText:    { fontSize: 7, color: palette.accent, fontFamily: "Helvetica-Bold" },

    // Section
    section:      { marginTop: 14 },
    sectionTitle: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    sectionBar:   { width: 3, height: 14, backgroundColor: palette.accent, marginRight: 7, borderRadius: 1.5 },
    sectionLabel: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: palette.primary, letterSpacing: 0.5 },

    // Jobs
    job:         { marginBottom: 10, paddingLeft: 12, borderLeftWidth: 1.5, borderLeftColor: palette.border, borderLeftStyle: "solid", flexDirection: "column" },
    jobHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    jobTitleRow: { flexDirection: "row", alignItems: "center", flex: 1 },
    jobDot:      { width: 5, height: 5, backgroundColor: palette.accent, borderRadius: 2.5, marginLeft: -14.5, marginRight: 6, flexShrink: 0 },
    jobRole:     { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: palette.primary, flex: 1 },
    jobDate:     { fontSize: 7, color: palette.muted, fontFamily: "Helvetica-Oblique" },
    jobCompany:  { fontSize: 7, fontFamily: "Helvetica-Bold", color: palette.muted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 },
    jobDesc:     { fontSize: 7.5, color: palette.body, lineHeight: 1.5 },
    jobTags:     { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", marginTop: 2 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Sidebar ─────────────────────── */}
        <View style={s.sidebar}>
          <SidebarDecor palette={palette} />

          {/* Photo + name */}
          <View style={s.photoWrap}>
            <Image src={CV_PROFILE.photo} style={s.photo} />
          </View>
          <Text style={s.sidebarName}>{CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}</Text>
          <Text style={s.sidebarRole}>{data.jobTitle}</Text>

          {/* Contact */}
          {sections.contact.visible ? (
            <>
              <View style={s.sectionDivider} />
              <Text style={s.sbSectionLabel}>{L.contact}</Text>
              <View style={s.contactItem}>
                <View style={s.contactIcon}><IconEmail color={palette.accent} /></View>
                <View style={s.contactTexts}>
                  <Text style={s.contactLabel}>{L.email}</Text>
                  <Text style={s.contactVal}>{CV_PROFILE.email}</Text>
                </View>
              </View>
              <View style={s.contactItem}>
                <View style={s.contactIcon}><IconPhone color={palette.accent} /></View>
                <View style={s.contactTexts}>
                  <Text style={s.contactLabel}>{L.phone}</Text>
                  <Text style={s.contactVal}>{CV_PROFILE.phone}</Text>
                </View>
              </View>
              <View style={s.contactItem}>
                <View style={s.contactIcon}><IconLinkedin color={palette.accent} /></View>
                <View style={s.contactTexts}>
                  <Text style={s.contactLabel}>{L.linkedin}</Text>
                  <Text style={s.contactVal}>{CV_PROFILE.linkedin}</Text>
                </View>
              </View>
            </>
          ) : null}

          {/* Skills */}
          {sections.skills.visible && data.allSkills.length > 0 ? (
            <>
              <View style={[s.sectionDivider, { marginTop: 14 }]} />
              <Text style={s.sbSectionLabel}>{L.skills}</Text>
              <View style={s.skillsWrap}>
                {data.allSkills.slice(0, 20).map((sk) => {
                  const relevant = data.relevantSkills.includes(sk);
                  return (
                    <View key={sk} style={[s.skillChip, relevant ? s.skillRelevant : {}]}>
                      <Text style={s.skillText}>{sk}</Text>
                    </View>
                  );
                })}
              </View>
            </>
          ) : null}
        </View>

        {/* ── Main content ────────────────── */}
        <View style={s.main}>
          {sections.tagline.visible && (data.tagline || sections.tagline.text) ? (
            <Text style={s.tagline}>{sections.tagline.text ?? data.tagline}</Text>
          ) : null}
          <Text style={s.jobTitle}>{data.jobTitle}</Text>
          <View style={s.accentLine} />

          {sections.summary.visible && summary ? (
            <Text style={s.summary}>{summary}</Text>
          ) : null}

          {/* Capabilities as badges */}
          {sections.capabilities.visible && caps.length > 0 ? (
            <View style={s.capsGrid}>
              {caps.map((c, i) => (
                <View key={i} style={s.capBadge}>
                  <IconStar color={palette.accent} />
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
                      <Text style={s.jobRole}>{exp.role}</Text>
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
              {data.projects.slice(0, 4).map((p) => (
                <View key={p.slug} style={s.job}>
                  <View style={s.jobTitleRow}>
                    <View style={s.jobDot} />
                    <Text style={s.jobRole}>{p.title}</Text>
                  </View>
                  <Text style={s.jobDesc}>{stripHtml(p.desc)}</Text>
                  {p.tags.length > 0 ? (
                    <Text style={s.jobTags}>{p.tags.slice(0, 5).join(" · ")}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
