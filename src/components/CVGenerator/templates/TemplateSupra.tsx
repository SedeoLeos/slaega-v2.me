/**
 * Template SUPRA — Supa Resume style
 *
 * Left  (34%): full-width photo, name, accent job title, quote/bio, contact, skills
 * Right (66%): Experience (company square + desc), Projects (2-col cards), Education grid, Skills chips
 */
import {
  Page, Document, View, Text, Image, StyleSheet,
} from "@react-pdf/renderer";
import type { CVData, CVSections } from "../cv-types";
import type { CVPalette } from "../cv-palettes";
import { CV_PROFILE, CV_LABELS, formatMonth, stripHtml } from "../cv-types";

type Props = { data: CVData; palette: CVPalette; sections: CVSections };

export default function TemplateSupra({ data, palette, sections }: Props) {
  const lang = data.language ?? "fr";
  const L    = CV_LABELS[lang];

  const tagline = sections.tagline.text  ?? data.tagline  ?? "";
  const summary = sections.summary.text  ?? stripHtml(data.summary ?? "");
  const caps    = sections.capabilities.text
    ? [sections.capabilities.text]
    : (data.capabilities ?? []);

  const BG     = "#fafafa";
  const CARD   = "#ffffff";
  const BORDER = "#eeeeee";
  const NAVY   = palette.primary;
  const ACC    = palette.accent;

  const s = StyleSheet.create({
    page: { backgroundColor: BG, fontFamily: "Helvetica", flexDirection: "row" },

    /* ═══ LEFT SIDEBAR ═══ */
    sidebar: {
      width: "34%",
      backgroundColor: CARD,
      borderRightWidth: 1, borderRightColor: BORDER, borderRightStyle: "solid",
      flexDirection: "column",
    },

    /* Photo — full width, no padding */
    photo: { width: "100%", height: 140, objectFit: "cover" },

    /* Identity block */
    identity: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
    name: {
      fontSize: 17, fontFamily: "Helvetica-Bold",
      color: NAVY, letterSpacing: -0.2, lineHeight: 1.15, marginBottom: 2,
    },
    jobTitle: {
      fontSize: 10, fontFamily: "Helvetica-Bold",
      color: ACC, letterSpacing: 0.2, marginBottom: 8,
    },

    /* Quote */
    quoteWrap: {
      paddingHorizontal: 16, marginBottom: 8,
      borderLeftWidth: 2, borderLeftColor: ACC, borderLeftStyle: "solid",
      marginLeft: 16, paddingLeft: 8,
    },
    quoteText: { fontSize: 7.5, color: "#555", lineHeight: 1.5, fontFamily: "Helvetica-Oblique" },

    divider: { height: 0.5, backgroundColor: BORDER, marginHorizontal: 16, marginVertical: 8 },

    /* Contact block */
    contactBlock: { paddingHorizontal: 16, marginBottom: 6 },
    contactSecLabel: { fontSize: 7, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 },
    contactRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 },
    contactIcon: {
      width: 14, height: 14, borderRadius: 4, backgroundColor: ACC + "20",
      alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    contactIconDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: ACC },
    contactLabel: { fontSize: 5.5, color: "#aaa", letterSpacing: 0.8, textTransform: "uppercase" },
    contactVal:   { fontSize: 7, color: NAVY },

    /* Skills in sidebar */
    skillBlock: { paddingHorizontal: 16, marginBottom: 8 },
    skillSecLabel: { fontSize: 7, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 },
    skillChipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
    skillChip: {
      paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3,
      borderWidth: 1, borderColor: BORDER, borderStyle: "solid",
    },
    skillChipRel: {
      paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3,
      backgroundColor: ACC + "18",
    },
    skillText:    { fontSize: 6, color: "#666" },
    skillTextRel: { fontSize: 6, color: ACC, fontFamily: "Helvetica-Bold" },

    /* ═══ RIGHT MAIN ═══ */
    main: {
      flex: 1,
      paddingTop: 24, paddingBottom: 20, paddingLeft: 20, paddingRight: 22,
      flexDirection: "column", gap: 14,
    },

    /* Section heading */
    secHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
    secDot:  { width: 7, height: 7, borderRadius: 3.5, backgroundColor: ACC, flexShrink: 0 },
    secLabel: { fontSize: 13, fontFamily: "Helvetica-Bold", color: NAVY },

    /* Experience row */
    expRow: {
      flexDirection: "row", gap: 8, marginBottom: 10, alignItems: "flex-start",
    },
    expLeft: { flexDirection: "column", width: "38%", gap: 2 },
    expDateLoc: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
    expDate: { fontSize: 6.5, color: "#aaa" },
    expLocDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#ccc" },
    expLoc:  { fontSize: 6.5, color: "#aaa" },
    expCompanyRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    expLogoBox: {
      width: 18, height: 18, borderRadius: 5, backgroundColor: ACC + "18",
      alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    expLogoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACC },
    expTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: NAVY, flex: 1, lineHeight: 1.3 },
    expCompany: { fontSize: 7, color: ACC, fontFamily: "Helvetica-Bold", marginLeft: 24 },
    expDesc: { flex: 1, fontSize: 7, color: "#555", lineHeight: 1.55 },

    /* Projects — 2 columns */
    projGrid: { flexDirection: "row", gap: 8 },
    projCard: {
      flex: 1, backgroundColor: CARD, borderRadius: 8,
      borderWidth: 1, borderColor: BORDER, borderStyle: "solid",
      overflow: "hidden",
    },
    projBody: { padding: 8 },
    projTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 2 },
    projDesc: { fontSize: 6.5, color: "#777", lineHeight: 1.45, marginBottom: 4 },
    projLink: { fontSize: 6.5, color: ACC },

    /* Education grid — 3 columns */
    eduGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    eduCard: {
      width: "30%", backgroundColor: CARD, borderRadius: 6,
      borderWidth: 1, borderColor: BORDER, borderStyle: "solid",
      padding: 6,
    },
    eduLogoRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
    eduLogoBox: {
      width: 14, height: 14, borderRadius: 4, backgroundColor: ACC + "18",
      alignItems: "center", justifyContent: "center",
    },
    eduLogoDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: ACC },
    eduSchool: { fontSize: 6, color: "#aaa", flex: 1 },
    eduTitle: { fontSize: 7, fontFamily: "Helvetica-Bold", color: NAVY, lineHeight: 1.3 },
    eduDate:  { fontSize: 6, color: "#aaa", marginTop: 1 },

    /* Skills — two groups */
    skillsBlock: { flexDirection: "row", gap: 12 },
    skillGroup: { flex: 1 },
    skillGroupLabel: {
      fontSize: 7, color: "#aaa", textTransform: "uppercase",
      letterSpacing: 1.5, marginBottom: 6,
      flexDirection: "row", alignItems: "center", gap: 4,
    },
    skillGroupLabelDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: ACC },
    skillGroupText: { fontSize: 7, color: "#999", textTransform: "uppercase", letterSpacing: 1.5 },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
    skChip: {
      paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4,
      borderWidth: 1, borderColor: BORDER, borderStyle: "solid",
    },
    skChipRel: {
      paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4,
      backgroundColor: ACC + "15",
    },
    skText:    { fontSize: 6.5, color: "#666" },
    skTextRel: { fontSize: 6.5, color: ACC, fontFamily: "Helvetica-Bold" },
  });

  /* split skills */
  const relSkills   = data.allSkills.filter(s => data.relevantSkills.includes(s));
  const otherSkills = data.allSkills.filter(s => !data.relevantSkills.includes(s));

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ═══ SIDEBAR ═══ */}
        <View style={s.sidebar}>

          {/* Full-width photo */}
          <Image src={CV_PROFILE.photo} style={s.photo} />

          {/* Name + title */}
          <View style={s.identity}>
            <Text style={s.name}>{CV_PROFILE.name}{"\n"}{CV_PROFILE.surname}</Text>
            <Text style={s.jobTitle}>
              {sections.tagline.visible && tagline ? tagline : data.jobTitle}
            </Text>
          </View>

          {/* Quote / bio */}
          {sections.summary.visible && summary && (
            <View style={s.quoteWrap}>
              <Text style={s.quoteText}>{summary.slice(0, 160)}{summary.length > 160 ? "…" : ""}</Text>
            </View>
          )}

          <View style={s.divider} />

          {/* Contact */}
          {sections.contact.visible && (
            <View style={s.contactBlock}>
              <Text style={s.contactSecLabel}>Contact</Text>
              {[
                { label: L.email,    val: CV_PROFILE.email   },
                { label: L.phone,    val: CV_PROFILE.phone   },
                { label: L.linkedin, val: CV_PROFILE.linkedin },
              ].map(({ label, val }) => (
                <View key={label} style={s.contactRow}>
                  <View style={s.contactIcon}>
                    <View style={s.contactIconDot} />
                  </View>
                  <View>
                    <Text style={s.contactLabel}>{label}</Text>
                    <Text style={s.contactVal}>{val}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Capabilities */}
          {sections.capabilities.visible && caps.length > 0 && (
            <>
              <View style={s.divider} />
              <View style={s.skillBlock}>
                <Text style={s.skillSecLabel}>{L.canDo}</Text>
                {caps.map((c, i) => (
                  <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                    <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: ACC, marginTop: 3, marginRight: 5, flexShrink: 0 }} />
                    <Text style={{ fontSize: 7, color: "#555", flex: 1, lineHeight: 1.5 }}>{c}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Skills chips in sidebar */}
          {sections.skills.visible && data.allSkills.length > 0 && (
            <>
              <View style={s.divider} />
              <View style={s.skillBlock}>
                <Text style={s.skillSecLabel}>{L.skills}</Text>
                <View style={s.skillChipsWrap}>
                  {data.allSkills.slice(0, 12).map((sk) => {
                    const rel = data.relevantSkills.includes(sk);
                    return (
                      <View key={sk} style={rel ? s.skillChipRel : s.skillChip}>
                        <Text style={rel ? s.skillTextRel : s.skillText}>{sk}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          )}
        </View>

        {/* ═══ MAIN ═══ */}
        <View style={s.main}>

          {/* Experience */}
          {sections.experience.visible && data.experiences.length > 0 && (
            <View>
              <View style={s.secHead}>
                <View style={s.secDot} />
                <Text style={s.secLabel}>{L.experience}</Text>
              </View>
              {data.experiences.map((exp) => (
                <View key={exp.id} style={s.expRow}>
                  <View style={s.expLeft}>
                    <View style={s.expDateLoc}>
                      <Text style={s.expDate}>
                        {formatMonth(exp.startDate, false, lang, L.present)} – {formatMonth(exp.endDate, exp.current, lang, L.present)}
                      </Text>
                      {exp.location ? (
                        <>
                          <View style={s.expLocDot} />
                          <Text style={s.expLoc}>{exp.location}</Text>
                        </>
                      ) : null}
                    </View>
                    <View style={s.expCompanyRow}>
                      <View style={s.expLogoBox}>
                        <View style={s.expLogoDot} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.expTitle}>{exp.role}</Text>
                        <Text style={s.expCompany}>{exp.company.toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={s.expDesc}>{stripHtml(exp.description)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {sections.projects.visible && data.projects.length > 0 && (
            <View>
              <View style={s.secHead}>
                <View style={s.secDot} />
                <Text style={s.secLabel}>{L.projects}</Text>
              </View>
              <View style={s.projGrid}>
                {data.projects.slice(0, 2).map((p) => (
                  <View key={p.slug} style={s.projCard}>
                    <View style={[s.projBody, { borderTopWidth: 2, borderTopColor: ACC, borderTopStyle: "solid" }]}>
                      <Text style={s.projTitle}>{p.title}</Text>
                      <Text style={s.projDesc}>{stripHtml(p.desc).slice(0, 90)}…</Text>
                      {p.tags.length > 0 && (
                        <Text style={s.projLink}>{p.tags.slice(0, 3).join(" · ")}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Education — 3-col grid */}
          {data.experiences.length > 0 && (
            <View>
              <View style={s.secHead}>
                <View style={s.secDot} />
                <Text style={s.secLabel}>Formation</Text>
              </View>
              <View style={s.eduGrid}>
                {data.experiences.slice(0, 6).map((exp, i) => (
                  <View key={exp.id + "edu"} style={s.eduCard}>
                    <View style={s.eduLogoRow}>
                      <View style={s.eduLogoBox}>
                        <View style={s.eduLogoDot} />
                      </View>
                      <Text style={s.eduSchool}>{exp.company}</Text>
                    </View>
                    <Text style={s.eduTitle}>{exp.role}</Text>
                    <Text style={s.eduDate}>{formatMonth(exp.startDate, false, lang, L.present)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Skills — two groups */}
          {sections.skills.visible && data.allSkills.length > 0 && (
            <View>
              <View style={s.secHead}>
                <View style={s.secDot} />
                <Text style={s.secLabel}>{L.skills}</Text>
              </View>
              <View style={s.skillsBlock}>
                {/* Relevant / key skills */}
                <View style={s.skillGroup}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <View style={s.skillGroupLabelDot} />
                    <Text style={s.skillGroupText}>Prioritaires</Text>
                  </View>
                  <View style={s.skillsWrap}>
                    {relSkills.slice(0, 10).map((sk) => (
                      <View key={sk} style={s.skChipRel}>
                        <Text style={s.skTextRel}>{sk}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                {/* Other skills */}
                <View style={s.skillGroup}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#ccc" }} />
                    <Text style={s.skillGroupText}>Autres</Text>
                  </View>
                  <View style={s.skillsWrap}>
                    {otherSkills.slice(0, 10).map((sk) => (
                      <View key={sk} style={s.skChip}>
                        <Text style={s.skText}>{sk}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
}
