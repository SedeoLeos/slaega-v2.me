/**
 * Template ORBIT — Minimalist sphere decoration
 *
 * Header: large name + job title + decorative globe SVG (right)
 * Body:   narrow left (contact, skills) · wide right (experience, projects)
 */
import {
  Page, Document, View, Text, Image, StyleSheet,
  Svg, Circle, Path, Line,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; palette: CVPalette; sections: CVSections };

// ── Globe SVG (latitude + longitude lines on a sphere) ────────────────────────
function GlobeSvg({ color, size = 80 }: { color: string; size?: number }) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer circle */}
      <Circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={0.8} fill="none" />
      {/* Latitude lines */}
      {[-0.55, -0.25, 0, 0.25, 0.55].map((t, i) => {
        const y = cy + t * r * 2;
        const halfW = Math.sqrt(Math.max(0, r * r - (t * r * 2) * (t * r * 2)));
        return (
          <Line key={i}
            x1={cx - halfW} y1={y} x2={cx + halfW} y2={y}
            stroke={color} strokeWidth={0.5}
          />
        );
      })}
      {/* Longitude curves */}
      <Path d={`M${cx},${cy - r} Q${cx + r * 0.6},${cy} ${cx},${cy + r} Q${cx - r * 0.6},${cy} ${cx},${cy - r}`}
        stroke={color} strokeWidth={0.5} fill="none" />
      <Path d={`M${cx},${cy - r} Q${cx + r * 1.1},${cy} ${cx},${cy + r} Q${cx - r * 1.1},${cy} ${cx},${cy - r}`}
        stroke={color} strokeWidth={0.5} fill="none" />
      {/* Vertical axis */}
      <Line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={color} strokeWidth={0.5} />
      {/* Horizontal axis */}
      <Line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={color} strokeWidth={0.5} />
      {/* Star-like rays from center */}
      {[0, 45, 90, 135].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x2 = cx + Math.cos(rad) * r * 1.18;
        const y2 = cy + Math.sin(rad) * r * 1.18;
        const x1 = cx - Math.cos(rad) * r * 1.18;
        const y1 = cy - Math.sin(rad) * r * 1.18;
        return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={0.3} />;
      })}
    </Svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TemplateOrbit({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const tagline = sections.tagline.text ?? data.tagline ?? "";
  const summary = sections.summary.text ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const s = StyleSheet.create({
    page: { backgroundColor: palette.paper, fontFamily: "Helvetica", padding: 36 },

    /* ── Header ── */
    header: {
      flexDirection: "row", justifyContent: "space-between",
      alignItems: "flex-start", marginBottom: 6,
    },
    headerLeft: { flex: 1 },
    name: {
      fontSize: 26, fontFamily: "Helvetica-Bold",
      color: palette.primary, letterSpacing: -0.5, lineHeight: 1,
    },
    jobTitle: {
      fontSize: 9, color: palette.accent, fontFamily: "Helvetica-Bold",
      letterSpacing: 1.8, textTransform: "uppercase", marginTop: 6,
    },
    tagline: { fontSize: 8.5, color: palette.muted, marginTop: 5, lineHeight: 1.4 },
    headerAccentBar: { height: 2, backgroundColor: palette.accent, marginTop: 14, marginBottom: 18, width: "100%" },

    /* ── Body columns ── */
    body: { flexDirection: "row", gap: 20 },
    colLeft: { width: "28%" },
    colRight: { flex: 1 },

    /* Left section */
    lSecWrap:  { marginBottom: 16 },
    lSecTitle: {
      fontSize: 6, fontFamily: "Helvetica-Bold", color: palette.muted,
      letterSpacing: 2, textTransform: "uppercase", marginBottom: 8,
      borderBottomWidth: 0.5, borderBottomColor: palette.border, borderBottomStyle: "solid",
      paddingBottom: 4,
    },
    lItem:  { marginBottom: 6 },
    lLabel: { fontSize: 6, color: palette.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 1 },
    lVal:   { fontSize: 7.5, color: palette.body },

    /* Skills chips */
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
    skillChip: {
      paddingHorizontal: 5, paddingVertical: 2,
      backgroundColor: palette.accentLight, borderRadius: 2,
    },
    skillChipRelevant: {
      paddingHorizontal: 5, paddingVertical: 2,
      backgroundColor: palette.accent, borderRadius: 2,
    },
    skillText:    { fontSize: 6.5, color: palette.accent },
    skillTextRel: { fontSize: 6.5, color: "#ffffff", fontFamily: "Helvetica-Bold" },

    /* Right section */
    rSecWrap: { marginBottom: 16 },
    rSecRow:  { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    rSecLabel: {
      fontSize: 8, fontFamily: "Helvetica-Bold", color: palette.primary,
      letterSpacing: 1.2, textTransform: "uppercase",
    },
    rSecLine: { flex: 1, height: 0.5, backgroundColor: palette.border, marginLeft: 8 },

    /* Jobs */
    job:     { marginBottom: 11 },
    jobTop:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
    jobName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: palette.primary, flex: 1 },
    jobDate: { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", flexShrink: 0, marginLeft: 4 },
    jobCo:   { fontSize: 7.5, color: palette.accent, fontFamily: "Helvetica-Bold", letterSpacing: 0.3, marginBottom: 3 },
    jobDesc: { fontSize: 7.5, color: palette.body, lineHeight: 1.5 },
    jobTags: { fontSize: 6.5, color: palette.muted, fontFamily: "Helvetica-Oblique", marginTop: 2 },

    /* Photo (small, in left col) */
    photo:    { width: 58, height: 58, borderRadius: 29, objectFit: "cover", marginBottom: 12 },
    photoBorder: { borderWidth: 2, borderColor: palette.accent, borderStyle: "solid" },

    /* Summary */
    summary: { fontSize: 8.5, color: palette.body, lineHeight: 1.6, marginBottom: 16, maxWidth: "75%" },

    /* Caps */
    capItem:   { flexDirection: "row", alignItems: "flex-start", marginBottom: 3 },
    capBullet: { width: 3, height: 3, backgroundColor: palette.accent, borderRadius: 1.5, marginTop: 3, marginRight: 6, flexShrink: 0 },
    capText:   { fontSize: 7.5, color: palette.body, flex: 1, lineHeight: 1.4 },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ HEADER ═══ */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.name}>{CV_PROFILE.name} {CV_PROFILE.surname}</Text>
            <Text style={s.jobTitle}>
              {sections.tagline.visible && tagline ? tagline : data.jobTitle}
            </Text>
            {sections.summary.visible && summary
              ? <Text style={s.tagline}>{summary}</Text>
              : null
            }
          </View>
          {/* Globe decoration */}
          <GlobeSvg color={palette.accent} size={76} />
        </View>

        {/* Accent bar */}
        <View style={s.headerAccentBar} />

        {/* ═══ BODY ═══ */}
        <View style={s.body}>

          {/* Left column */}
          <View style={s.colLeft}>

            {/* Photo */}
            <Image src={CV_PROFILE.photo} style={[s.photo, s.photoBorder]} />

            {/* Contact */}
            {sections.contact.visible && (
              <View style={s.lSecWrap}>
                <Text style={s.lSecTitle}>{L.contact}</Text>
                <View style={s.lItem}>
                  <Text style={s.lLabel}>{L.email}</Text>
                  <Text style={s.lVal}>{CV_PROFILE.email}</Text>
                </View>
                <View style={s.lItem}>
                  <Text style={s.lLabel}>{L.phone}</Text>
                  <Text style={s.lVal}>{CV_PROFILE.phone}</Text>
                </View>
                <View style={s.lItem}>
                  <Text style={s.lLabel}>{L.linkedin}</Text>
                  <Text style={s.lVal}>{CV_PROFILE.linkedin}</Text>
                </View>
              </View>
            )}

            {/* Skills */}
            {sections.skills.visible && data.allSkills.length > 0 && (
              <View style={s.lSecWrap}>
                <Text style={s.lSecTitle}>{L.skills}</Text>
                <View style={s.skillsWrap}>
                  {data.allSkills.slice(0, 14).map((sk) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={sk} style={rel ? s.skillChipRelevant : s.skillChip}>
                        <Text style={rel ? s.skillTextRel : s.skillText}>{sk}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* Right column */}
          <View style={s.colRight}>

            {/* Capabilities */}
            {sections.capabilities.visible && caps.length > 0 && (
              <View style={s.rSecWrap}>
                <View style={s.rSecRow}>
                  <Text style={s.rSecLabel}>{L.canDo}</Text>
                  <View style={s.rSecLine} />
                </View>
                {caps.map((c, i) => (
                  <View key={i} style={s.capItem}>
                    <View style={s.capBullet} />
                    <Text style={s.capText}>{c}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Experience */}
            {sections.experience.visible && data.experiences.length > 0 && (
              <View style={s.rSecWrap}>
                <View style={s.rSecRow}>
                  <Text style={s.rSecLabel}>{L.experience}</Text>
                  <View style={s.rSecLine} />
                </View>
                {data.experiences.map((exp) => (
                  <View key={exp.id} style={s.job}>
                    <View style={s.jobTop}>
                      <Text style={s.jobName}>{exp.role}</Text>
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
              <View style={s.rSecWrap}>
                <View style={s.rSecRow}>
                  <Text style={s.rSecLabel}>{L.projects}</Text>
                  <View style={s.rSecLine} />
                </View>
                {data.projects.slice(0, 4).map((p) => (
                  <View key={p.slug} style={s.job}>
                    <Text style={s.jobName}>{p.title}</Text>
                    <Text style={s.jobDesc}>{stripHtml(p.desc)}</Text>
                    {p.tags.length > 0 && (
                      <Text style={s.jobTags}>{p.tags.slice(0, 6).join(" · ")}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

      </Page>
    </Document>
  );
}
