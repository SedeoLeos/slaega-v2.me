import { View, Text } from "@react-pdf/renderer";
import type { ComponentProps } from "react";
import { descToBullets } from "../cv-types";

// react-pdf's <View> style type is the clean `Style | Style[]` (no SVG variant)
// and is assignable to <Text>'s style prop too — so we reuse it for both.
type TextStyleProp = ComponentProps<typeof View>["style"];

/**
 * Renders an experience description as a punchy bullet list in react-pdf.
 * The AI returns 2-4 achievement bullets (newline-joined); this splits and
 * renders them with the template's own text style so each template keeps its
 * look. A single line falls back to plain text (no bullet marker).
 */
export function CvBullets({
  text,
  textStyle,
  color,
  gap = 3,
}: {
  text: string;
  textStyle?: TextStyleProp;
  /** Bullet marker colour — defaults to the text colour. */
  color?: string;
  /** Vertical gap between bullets (pt). */
  gap?: number;
}) {
  const bullets = descToBullets(text);
  if (bullets.length === 0) return null;
  if (bullets.length === 1) {
    return <Text style={textStyle}>{bullets[0]}</Text>;
  }
  const base: unknown[] = Array.isArray(textStyle)
    ? textStyle
    : textStyle
      ? [textStyle]
      : [];
  const dotStyle = [...base, { marginRight: 4, ...(color ? { color } : {}) }] as TextStyleProp;
  const lineStyle = [...base, { flex: 1 }] as TextStyleProp;
  return (
    <View style={{ flexDirection: "column", gap }}>
      {bullets.map((b, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Text style={dotStyle}>•</Text>
          <Text style={lineStyle}>{b}</Text>
        </View>
      ))}
    </View>
  );
}
