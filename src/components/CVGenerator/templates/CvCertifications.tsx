import { View, Text } from "@react-pdf/renderer";
import { CERTIFICATIONS } from "@/shared/config/certifications";

/**
 * Certifications section for CV templates. Self-contained styling so it can be
 * dropped into any of the 12 templates with a single line; pass the template's
 * `accent` colour and base `color` so it blends in. Renders nothing when there
 * are no certifications. Section title is the same word in FR & EN.
 */
export function CvCertifications({
  accent = "#111827",
  color = "#111827",
  muted = "#6b7280",
  compact = false,
}: {
  accent?: string;
  color?: string;
  muted?: string;
  compact?: boolean;
}) {
  if (!CERTIFICATIONS.length) return null;
  return (
    <View style={{ marginTop: compact ? 8 : 14 }} wrap={false}>
      <Text
        style={{
          fontSize: compact ? 9 : 11,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: accent,
          marginBottom: compact ? 4 : 7,
        }}
      >
        Certifications
      </Text>
      <View style={{ flexDirection: "column", gap: compact ? 3 : 4 }}>
        {CERTIFICATIONS.map((c, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={{ fontSize: compact ? 8 : 9.5, color: accent, marginRight: 4 }}>▪</Text>
            <Text style={{ flex: 1, fontSize: compact ? 8.5 : 9.5, color, lineHeight: 1.35 }}>
              <Text style={{ fontWeight: 600 }}>{c.name}</Text>
              <Text style={{ color: muted }}>
                {"  —  "}
                {c.issuer}
                {c.year ? ` · ${c.year}` : ""}
              </Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
