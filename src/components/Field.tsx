// src/components/Field.tsx

import { useGameStore } from '../state/gameStore';

interface FieldProps {
  cx: number;
  cy: number;
  color?: string;
  onClick?: () => void;
  showMarkerDot?: boolean; // Neue Prop
}

export function Field({ cx, cy, color = '#E5E7EB', onClick, showMarkerDot }: FieldProps) {
  const isAnyPieceSelected = useGameStore((state) => !!state.selectedPieceId);

  return (
    // SVG-Gruppe, um beide Kreise zu umschließen
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}> 
      <circle
        cx={cx}
        cy={cy}
        r={22}
        fill={color}
        fillOpacity={isAnyPieceSelected ? 0.6 : 1.0}
        stroke={isAnyPieceSelected ? '#FBBF24' : '#4B5563'}
        strokeWidth="3"
      />
      {/* Bedingte Logik für den Zählpunkt */}
      {showMarkerDot && (
        <circle
          cx={cx}
          cy={cy}
          r={6} // Kleinerer Radius für den Punkt
          fill="black"
          pointerEvents="none" // Stellt sicher, dass der Punkt Klicks nicht abfängt
        />
      )}
    </g>
  );
}