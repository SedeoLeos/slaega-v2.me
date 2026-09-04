"use client";
/**
 * CoverLetterDocument — real @react-pdf/renderer document for the cover letter,
 * so the "PDF" button produces a proper downloadable PDF (same approach as the
 * CV generator) instead of relying on the browser print dialog.
 *
 * react-pdf paginates automatically (Page wrap), so a long letter flows onto a
 * second A4 page on its own — no manual pagination needed here.
 */
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Keep long words / names whole (e.g. "MATSOULA MALONGA") — no hyphenation.
Font.registerHyphenationCallback((word) => [word]);

export type CoverLetter = {
  language: "fr" | "en";
  company: string;
  role: string;
  subject: string;
  greeting: string;
  intro: string;
  body: string;
  closing: string;
  signoff: string;
};

const PROFILE = {
  name: "SEBA GEDEON",
  surname: "MATSOULA MALONGA",
  email: "hello@slaega.com",
  phone: "+242066900110",
  linkedin: "linkedin.com/in/slaega",
  city: "Brazzaville",
  country: "Congo",
  photo: "/images/me.jpg",
  fullName: "Seba Gedeon Matsoula Malonga",
};

/** Split intro/body/closing on blank lines into individual paragraphs. */
export function buildParagraphs(letter: CoverLetter): string[] {
  return [letter.intro, letter.body, letter.closing].flatMap((p) =>
    (p ?? "")
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#1a2645",
    paddingTop: 38,
    paddingBottom: 42,
    paddingHorizontal: 40,
  },
  bgWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "35%",
    height: "100%",
    opacity: 0.9,
  },
  bgImg: { width: "100%", height: "100%", objectFit: "contain" },
  content: { position: "relative" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  headerLeft: { flex: 1, paddingRight: 14 },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0a1a35",
    letterSpacing: -0.4,
    lineHeight: 1.05,
  },
  tagline: { fontSize: 9, color: "#4a5a78", marginTop: 6, lineHeight: 1.4 },
  divider: { width: "70%", height: 1.5, backgroundColor: "#1a2645", marginTop: 10 },
  photo: { width: 66, height: 66, borderRadius: 33, objectFit: "cover", flexShrink: 0 },

  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 12,
  },
  metaText: { fontSize: 9.5, color: "#2a3a5a", lineHeight: 1.45 },
  recipient: { alignItems: "flex-end" },
  recipientName: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#0a1a35" },

  subject: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#0a1a35",
    marginTop: 8,
    marginBottom: 10,
  },
  greeting: { fontSize: 10, color: "#1a2645", marginBottom: 8 },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.55,
    color: "#2a3a5a",
    marginBottom: 10,
    textAlign: "justify",
  },
  signoff: { fontSize: 10, lineHeight: 1.55, color: "#2a3a5a", marginTop: 6, marginBottom: 18 },
  signatureName: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#0a1a35" },
});

export default function CoverLetterDocument({
  letter,
  today,
}: {
  letter: CoverLetter;
  today: string;
}) {
  const paragraphs = buildParagraphs(letter);
  const hasRecipient = !!(letter.company || letter.role);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.bgWrap} fixed>
          <Image src="/cv-bg.png" style={s.bgImg} />
        </View>

        <View style={s.content}>
          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <Text style={s.name}>
                {PROFILE.name}
                {"\n"}
                {PROFILE.surname}
              </Text>
              <Text style={s.tagline}>
                {PROFILE.email} · {PROFILE.phone}
                {"\n"}
                {PROFILE.linkedin}
              </Text>
              <View style={s.divider} />
            </View>
            <Image src={PROFILE.photo} style={s.photo} />
          </View>

          {/* Date + recipient */}
          <View style={s.meta}>
            <View>
              <Text style={s.metaText}>
                {PROFILE.city}, {PROFILE.country}
              </Text>
              <Text style={s.metaText}>{today}</Text>
            </View>
            {hasRecipient ? (
              <View style={s.recipient}>
                {letter.company ? (
                  <Text style={s.recipientName}>{letter.company}</Text>
                ) : null}
                {letter.role ? (
                  <Text style={s.metaText}>
                    {letter.language === "en"
                      ? `Re: ${letter.role}`
                      : "À l'attention de l'équipe RH"}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>

          {letter.subject ? <Text style={s.subject}>{letter.subject}</Text> : null}
          {letter.greeting ? <Text style={s.greeting}>{letter.greeting}</Text> : null}
          {paragraphs.map((p, i) => (
            <Text key={i} style={s.paragraph}>
              {p}
            </Text>
          ))}
          {letter.signoff ? <Text style={s.signoff}>{letter.signoff}</Text> : null}
          <Text style={s.signatureName}>{PROFILE.fullName}</Text>
        </View>
      </Page>
    </Document>
  );
}
