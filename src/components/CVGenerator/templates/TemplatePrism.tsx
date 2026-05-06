/**
 * Template PRISM — react-pdf version
 *
 * Layout: bold full-width color band header → clean single-column body
 * Ultra-minimal, modern, lots of white space.
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
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="2.5" fill="none" />
      <Path d="M3 7l9 6 9-6" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Svg>
  );
}
function IconPhone({ color }: { color: string }) {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.36 11.36 0 003.54.57A1 1 0 0121 19v3a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3a1 1 0 011 1 11.36 11.36 0 00.57 3.54 1 1 0 01-.27 1.11z" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconLinkedin({ color }: { color: string }) {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24">
      <Rect x="2" y="2" width="20" height="20" rx="3" stroke={color} strokeWidth="2.5" fill="none" />
      <Path d="M7 10v7M7 7v.01M11 17v-3a2 2 0 014 0v3M11 10v7" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Svg>
  );
}
function IconCheck({ color }: { color: string }) {
  return (
    <Svg width={8} height={8} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} fill={color} opacity={0.18} />
      <Path d="M8 12l3 3 5-6" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Header band decoration ────────────────────────────────────────────────────
function HeaderDecor({ palette }: { palette: CVPalette }) {
  return (
    <Svg width={595} height={130} viewBox="0 0 595 130" style={{ position: "absolute", top: 0, left: 0 }}>
      {/* Subtle diagonal cut */}
      <Path d="M0 0 L595 0 L595 110 L460 130 L0 130 Z" fill={palette.accent} opacity={0.08} />
      {/* Dot grid top-right */}
      {[20, 40, 60, 80, 100].map((y, ri) =>
        [500, 520, 540, 560, 580].map((x, ci) => (
          <Circle key={`${ri}-${ci}`} cx={x} cy={y} r={1.5} fill={palette.onDark} opacity={0.18} />
        ))
      )}
      {/* Bottom accent strip */}
      <Rect x={0} y={126} width={595} height={4} fill={palette.accent} opacity={0.5} />
    </Svg>
  );
}

// ── Main document ─────────────────────────────────────────────────────────────
type Props = { data: CVData; palette: CVPalette; sections: CVSections };

export default function TemplatePrism({ data, palette, sections }: Props) {
  const lang: "fr" | "en" = data.language ?? "fr";
  const L = CV_LABELS[lang];

  const tagline = sections.tagline.text ?? data.tagline ?? "";
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: palette.paper, fontFamily: "Helvetica" },

    // Header band
    band:       { backgroundColor: palette.band, height: 130, position: "relative" },
    bandBody:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 36, paddingTop: 28, paddingBottom: 20 },
    bandLeft:   { flex: 1 },
    taglineText: { fontSize: 7, color: palette.onDarkMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 5 },
    nameText:   { fontSize: 22, fontFamily: "Helvetica-Bold", color: palette.onDark, letterSpacing: -0.3, lineHeight: 1.15 },
    jobTitle:   { fontSize: 9, color: palette.onDarkMuted, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 },
    photo:      { width: 70, height: 70, borderRadius: 35, objectFit: "cover", borderWidth: 3, borderColor: "rgba(255,255,255,0.25)", borderStyle: "solid" },

    // Contact strip
    strip:       { flexDirection: "row", justifyContent: "center", gap: 0, paddingVertical: 10, paddingHorizontal: 32, borderBottomWidth: 1, borderBottomColor: palette.border, borderBottomStyle: "solid" },
    stripItem:   { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 18 },
    stripSep:    { width: 1, height: 18, backgroundColor: palette.border },
    stripText:   { fontSize: 7.5, color: palette.body },

    // Body
    body: { paddingHorizontal: 36, paddingTop: 20, paddingBottom: 24 },

    // Summary
    summaryBox:  { backgroundColor: palette.accentLight, borderRadius: 4, padding: 12, marginBottom: 18 },
    summaryText: { fontSize: 8.5, color: palette.body, lineHeight: 1.6 },

    // Capabilities
    capsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 18 },
    capItem:  { flexDirection: "row", alignItems: "center", gap: 5 },
    capText:  { fontSize: 7.5, color: palette.body },

    // Section
    section:      { marginTop: 16 },
    sectionHead:  { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    sectionLine:  { flex: 1, height: 1, backgroundColor: palette.border },
    sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: palette.accent, textTransform: "uppercase", letterSpacing: 2, marginHorizontal: 10 },

    // Jobs — card style
    job:         { marginBottom: 12, padding: 10, borderRadius: 4, borderWidth: 1, borderColor: palette.border, borderStyle: "solid" },
    jobHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
    jobRole:     { fontSize: 9, fontFamily: "Helvetica-Bold", color: palette.primary, flex: 1 },
    jobDate:     { fontSize: 7, color: palette.muted, fontFamily: "Helvetica-Oblique" },
    jobCompany:  { fontSize: 7.5, color: palette.accent, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
    jobDesc:     { fontSize: 7.5, color: palette.body, lineHeight: 1.5 },
    jobTags:     { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", marginTop: 3 },

    // Skills grid
    skillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    skillChip:  { paddingHorizontal: 9, paddingVertical: 3.5, borderRadius: 14 },
    skillText:  { fontSize: 7 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Header band ─────────────────────── */}
        <View style={s.band}>
          <HeaderDecor palette={palette} />
          <View style={s.bandBody}>
            <View style={s.bandLeft}>
              {sections.tagline.visible && tagline ? (
                <Text style={s.taglineText}>{tagline}</Text>
              ) : null}
              <Text style={s.nameText}>{CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}</Text>
              <Text style={s.jobTitle}>{data.jobTitle}</Text>
            </View>
            <Image src={CV_PROFILE.photo} style={s.photo} />
          </View>
        </View>

        {/* ── Contact strip ──────────────────── */}
        {sections.contact.visible ? (
          <View style={s.strip}>
            <View style={s.stripItem}>
              <IconEmail color={palette.accent} />
              <Text style={s.stripText}>{CV_PROFILE.email}</Text>
            </View>
            <View style={s.stripSep} />
            <View style={s.stripItem}>
              <IconPhone color={palette.accent} />
              <Text style={s.stripText}>{CV_PROFILE.phone}</Text>
            </View>
            <View style={s.stripSep} />
            <View style={s.stripItem}>
              <IconLinkedin color={palette.accent} />
              <Text style={s.stripText}>{CV_PROFILE.linkedin}</Text>
            </View>
          </View>
        ) : null}

        {/* ── Body ───────────────────────────── */}
        <View style={s.body}>
          {/* Summary */}
          {sections.summary.visible && summary ? (
            <View style={s.summaryBox}>
              <Text style={s.summaryText}>{summary}</Text>
            </View>
          ) : null}

          {/* Capabilities */}
          {sections.capabilities.visible && caps.length > 0 ? (
            <>
              <View style={s.section}>
                <View style={s.sectionHead}>
                  <View style={s.sectionLine} />
                  <Text style={s.sectionLabel}>{L.canDo}</Text>
                  <View style={s.sectionLine} />
                </View>
              </View>
              <View style={s.capsGrid}>
                {caps.map((c, i) => (
                  <View key={i} style={s.capItem}>
                    <IconCheck color={palette.accent} />
                    <Text style={s.capText}>{c}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {/* Experience */}
          {sections.experience.visible && data.experiences.length > 0 ? (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <View style={s.sectionLine} />
                <Text style={s.sectionLabel}>{L.experience}</Text>
                <View style={s.sectionLine} />
              </View>
              {data.experiences.map((exp) => (
                <View key={exp.id} style={s.job}>
                  <View style={s.jobHeader}>
                    <Text style={s.jobRole}>{exp.role}</Text>
                    <Text style={s.jobDate}>
                      {formatMonth(exp.startDate, false, lang, L.present)} – {formatMonth(exp.endDate, exp.current, lang, L.present)}
                    </Text>
                  </View>
                  <Text style={s.jobCompany}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </Text>
                  <Text style={s.jobDesc}>{stripHtml(exp.description)}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Projects */}
          {sections.projects.visible && data.projects.length > 0 ? (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <View style={s.sectionLine} />
                <Text style={s.sectionLabel}>{L.projects}</Text>
                <View style={s.sectionLine} />
              </View>
              {data.projects.slice(0, 5).map((p) => (
                <View key={p.slug} style={s.job}>
                  <Text style={s.jobRole}>{p.title}</Text>
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
              <View style={s.sectionHead}>
                <View style={s.sectionLine} />
                <Text style={s.sectionLabel}>{L.skills}</Text>
                <View style={s.sectionLine} />
              </View>
              <View style={s.skillsGrid}>
                {data.allSkills.map((sk) => {
                  const relevant = data.relevantSkills.includes(sk);
                  return (
                    <View key={sk} style={[s.skillChip, { backgroundColor: relevant ? palette.accent : palette.border }]}>
                      <Text style={[s.skillText, { color: relevant ? "#fff" : palette.muted, fontFamily: relevant ? "Helvetica-Bold" : "Helvetica" }]}>
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
