// src/state/gameStore.ts

import { create } from 'zustand';
import type { Piece, PlayerColor, PiecePosition } from '../types';
import { PLAYER_COLORS } from './constants';

// NEU: Erweiterte GameState-Schnittstelle
interface GameState {
  pieces: Piece[];
  selectedPieceId: string | null;
  history: Piece[][]; // Speichert die vorherigen Zustände des Spielfelds
  setSelectedPiece: (pieceId: string | null) => void;
  moveSelectedPieceTo: (targetPosition: PiecePosition) => void;
  undoLastMove: () => void; // Aktion zum Rückgängigmachen
}

const initializePieces = (): Piece[] => {
  const initialPieces: Piece[] = [];
  PLAYER_COLORS.forEach((color) => {
    for (let i = 0; i < 4; i++) {
      initialPieces.push({
        id: `${color}-piece-${i}`,
        color: color as PlayerColor,
        position: {
          type: 'start',
          index: i,
        },
      });
    }
  });
  return initialPieces;
};

const findAvailableStartField = (
  playerColor: PlayerColor,
  pieces: Piece[]
): PiecePosition | undefined => {
  const allStartIndices = [0, 1, 2, 3];
  const occupiedStartIndices = pieces
    .filter((p) => p.color === playerColor && p.position.type === 'start')
    .map((p) => p.position.index);
  const availableIndex = allStartIndices.find(
    (index) => !occupiedStartIndices.includes(index)
  );
  if (availableIndex !== undefined) {
    return { type: 'start', index: availableIndex };
  }
  return undefined;
};

export const useGameStore = create<GameState>((set, get) => ({
  pieces: initializePieces(),
  selectedPieceId: null,
  history: [], // NEU: Initialisiere die Historie als leeres Array

  setSelectedPiece: (pieceId) => set({ selectedPieceId: pieceId }),

  moveSelectedPieceTo: (targetPosition) => {
    // Schritt 2: Snapshot vor jeder Bewegung speichern
    const { pieces, selectedPieceId, history } = get();
    // Wichtig: Wir erstellen eine tiefe Kopie des Zustands, BEVOR wir ihn ändern.
    const historySnapshot = JSON.parse(JSON.stringify(pieces));

    if (!selectedPieceId) return;

    const selectedPiece = pieces.find((p) => p.id === selectedPieceId);
    if (!selectedPiece) return;

    const occupyingPiece = pieces.find(
      (p) =>
        p.position.type === targetPosition.type &&
        p.position.index === targetPosition.index
    );

    if (occupyingPiece && occupyingPiece.color === selectedPiece.color) {
      return;
    }

    if (
      occupyingPiece &&
      targetPosition.type === 'ring' &&
      occupyingPiece.color !== selectedPiece.color
    ) {
      const newPositionForCapturedPiece = findAvailableStartField(
        occupyingPiece.color,
        pieces
      );

      if (!newPositionForCapturedPiece) {
        return;
      }

      const updatedPieces = pieces.map((p) => {
        if (p.id === selectedPieceId) {
          return { ...p, position: targetPosition };
        }
        if (p.id === occupyingPiece.id) {
          return { ...p, position: newPositionForCapturedPiece };
        }
        return p;
      });

      // Aktualisiere den Zustand und füge den Snapshot zur Historie hinzu
      set({
        pieces: updatedPieces,
        selectedPieceId: null,
        history: [...history, historySnapshot],
      });
      return;
    }

    const updatedPieces = pieces.map((piece) => {
      if (piece.id === selectedPieceId) {
        return { ...piece, position: targetPosition };
      }
      return piece;
    });

    // Aktualisiere den Zustand und füge den Snapshot zur Historie hinzu
    set({
      pieces: updatedPieces,
      selectedPieceId: null,
      history: [...history, historySnapshot],
    });
  },

  // Schritt 3 & 4: Die "Rückgängig"-Logik implementieren
  undoLastMove: () => {
    set((state) => {
      // Prüfen, ob die Historie leer ist
      if (state.history.length === 0) {
        return {}; // Nichts ändern, wenn keine Historie vorhanden ist
      }

      // Eine neue, modifizierbare Kopie der Historie erstellen
      const newHistory = [...state.history];
      
      // Den letzten Zustand aus der Historie holen (und entfernen)
      const lastPiecesState = newHistory.pop();

      // Den Zustand auf den wiederhergestellten Stand setzen und Auswahl aufheben
      return {
        pieces: lastPiecesState,
        history: newHistory,
        selectedPieceId: null,
      };
    });
  },
}));