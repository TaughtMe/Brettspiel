import React from 'react';
import type { PlayerColor } from '../types';
import { useGameStore } from '../state/gameStore';

interface PieceProps {
  id: string;
  color: PlayerColor;
  cx: number;
  cy: number;
  onClick: () => void;
}

const PIECE_RADIUS = 18;

export const Piece: React.FC<PieceProps> = ({ id, color, cx, cy, onClick }) => {
  const selectedPieceId = useGameStore((state) => state.selectedPieceId);
  const isSelected = selectedPieceId === id;

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <circle
        cx={cx}
        cy={cy}
        r={PIECE_RADIUS}
        fill={color}
        stroke={isSelected ? '#FFFFFF' : 'black'}
        strokeWidth={isSelected ? 4 : 2}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dy=".3em"
        fill="black"
        fontSize="24"
        fontWeight="bold"
        style={{ pointerEvents: 'none' }}
      >
        x
      </text>
    </g>
  );
};