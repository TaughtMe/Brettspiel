import type { PLAYER_COLORS } from '../state/constants';

// Defines the color strings based on your constants
export type PlayerColor = typeof PLAYER_COLORS[number];

/**
 * Defines the position of a piece on the board.
 * Crucially, it includes an optional 'player' property to identify
 * the owner of a start or home field.
 */
export type PiecePosition = {
  type: 'start' | 'ring' | 'home';
  index: number;
  player?: PlayerColor;
};

// Defines the structure for a game piece
export interface Piece {
  id: string;
  color: PlayerColor;
  // This now correctly uses the PiecePosition type
  position: PiecePosition;
}

// Defines the structure for a field on the board
export interface Field {
  id:string;
  type: 'start' | 'ring' | 'home';
  index: number;
  player?: PlayerColor;
}