import { View, Text } from "@react-pdf/renderer";
import { CERTIFICATIONS } from "@/shared/config/certifications";

/**
 * Certifications for CV templates — a COMPACT dense list (name + issuer/year),
 * two per row, small type, no QR. Designed to keep the CV to one page. The
 * section title is the same word in FR & EN. Renders nothing when empty.
 */
export function CvCertifications({
  accent = "#111827",
  color = "#111827",
  muted = "#6b7280",
  border = "#e5e7eb",
}: {
  accent?: string;
  color?: string;
  muted?: string;
  border?: string;
}) {
  if (!CERTIFICATIONS.length) return null;
  return (
    <View style={{ marginTop: 10 }} wrap={false}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 }}>
        <Text
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 1.1,
            textTransform: "uppercase",
            color: accent,
          }}
        >
          Certifications
        </Text>
        <View style={{ flex: 1, height: 0.5, backgroundColor: border }} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {CERTIFICATIONS.map((c, i) => (
          <View
            key={i}
            style={{ width: "50%", flexDirection: "row", alignItems: "baseline", marginBottom: 2.5, paddingRight: 8 }}
          >
            <Text style={{ fontSize: 7, color: accent, marginRight: 3 }}>▪</Text>
            <Text style={{ flex: 1, fontSize: 7.8, color, lineHeight: 1.2 }}>
              <Text style={{ fontWeight: 600 }}>{c.name}</Text>
              <Text style={{ color: muted }}>
                {" — "}
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
