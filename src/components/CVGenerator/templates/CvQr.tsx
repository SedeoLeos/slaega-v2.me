import { Svg, Rect } from "@react-pdf/renderer";
import qrcode from "qrcode-generator";

/**
 * Renders a QR code as vector rects for react-pdf. Dark modules on each row are
 * merged into horizontal runs to keep the rect count low. Fully self-contained
 * (no image/data-URI), so it works in any template and prints crisply.
 */
export function CvQr({
  value,
  size = 46,
  color = "#111827",
  bg = "#ffffff",
}: {
  value: string;
  size?: number;
  color?: string;
  bg?: string;
}) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  const count = qr.getModuleCount();
  const cell = size / count;

  const rects: React.ReactElement[] = [];
  for (let r = 0; r < count; r++) {
    let runStart = -1;
    for (let c = 0; c <= count; c++) {
      const dark = c < count && qr.isDark(r, c);
      if (dark && runStart === -1) {
        runStart = c;
      } else if (!dark && runStart !== -1) {
        rects.push(
          <Rect
            key={`${r}-${runStart}`}
            x={runStart * cell}
            y={r * cell}
            width={(c - runStart) * cell}
            height={cell}
            fill={color}
          />,
        );
        runStart = -1;
      }
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill={bg} />
      {rects}
    </Svg>
  );
}
