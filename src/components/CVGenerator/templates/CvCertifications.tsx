import { View, Text } from "@react-pdf/renderer";
import { CERTIFICATIONS } from "@/shared/config/certifications";
import { CvQr } from "./CvQr";

/**
 * Certifications section for CV templates, rendered as compact cards with a QR
 * code linking to each credential's verification page. Self-contained styling
 * so it drops into any of the 12 templates with a single line; pass the
 * template's `accent` / text colours so it blends in. Section title is the same
 * word in FR & EN. Renders nothing when there are no certifications.
 */
export function CvCertifications({
  accent = "#111827",
  color = "#111827",
  muted = "#6b7280",
  border = "#e5e7eb",
  compact = false,
}: {
  accent?: string;
  color?: string;
  muted?: string;
  /** Card border colour — keep it light (default is a soft gray). */
  border?: string;
  compact?: boolean;
}) {
  if (!CERTIFICATIONS.length) return null;
  const qrSize = compact ? 34 : 42;
  return (
    <View style={{ marginTop: compact ? 8 : 14 }} wrap={false}>
      <Text
        style={{
          fontSize: compact ? 9 : 11,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: accent,
          marginBottom: compact ? 5 : 8,
        }}
      >
        Certifications
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: compact ? 5 : 7,
        }}
      >
        {CERTIFICATIONS.map((c, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: compact ? 5 : 7,
              width: "48%",
              padding: compact ? 5 : 7,
              borderWidth: 0.5,
              borderColor: border,
              borderRadius: 3,
            }}
          >
            {c.url ? (
              <CvQr value={c.url} size={qrSize} color={color} />
            ) : (
              <View style={{ width: qrSize, height: qrSize }} />
            )}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: compact ? 7.5 : 8.5,
                  fontWeight: 600,
                  color,
                  lineHeight: 1.25,
                }}
              >
                {c.name}
              </Text>
              <Text style={{ fontSize: compact ? 6.5 : 7.5, color: muted, marginTop: 1.5 }}>
                {c.issuer}
                {c.year ? ` · ${c.year}` : ""}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
