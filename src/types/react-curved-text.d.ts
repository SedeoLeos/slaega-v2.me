declare module 'react-curved-text' {
  import { ComponentType } from 'react';
  
  interface CurvedTextProps {
    text: string;
    arc?: number;
    radius?: number;
    rotate?: number;
    width?: number;
    height?: number;
    cx?: number;
    cy?: number;
    rx?: number;
    ry?: number;
    startOffset?: number;
    reversed?: boolean;
    textProps?: React.SVGProps<SVGTextElement>;
    textPathProps?: React.SVGProps<SVGTextPathElement> | null;
    tspanProps?: React.SVGProps<SVGTSpanElement> | null;
    ellipseProps?: React.SVGProps<SVGEllipseElement> | null;
    svgProps?: React.SVGProps<SVGSVGElement>;
  }
  
  const CurvedText: ComponentType<CurvedTextProps>;
  export default CurvedText;
}
