// src/state/boardGenerator.ts

import type { Field } from '../types'; // KORREKTUR HIER
import {
  PLAYER_COLORS,
  TOTAL_RING_FIELDS,
  START_FIELDS_PER_PLAYER,
  HOME_FIELDS_PER_PLAYER,
} from './constants';

export function generateBoardData() {
  const ringFields: Field[] = Array.from({ length: TOTAL_RING_FIELDS }, (_, i) => ({
    id: `ring-${i}`,
    type: 'ring',
    index: i,
  }));

  const startFields: Field[] = [];
  const homeFields: Field[] = [];

  PLAYER_COLORS.forEach((color) => {
    for (let i = 0; i < START_FIELDS_PER_PLAYER; i++) {
      startFields.push({
        id: `start-${color}-${i}`,
        type: 'start',
        player: color,
        index: i,
      });
    }
    for (let i = 0; i < HOME_FIELDS_PER_PLAYER; i++) {
      homeFields.push({
        id: `home-${color}-${i}`,
        type: 'home',
        player: color,
        index: i,
      });
    }
  });

  return { ringFields, startFields, homeFields };
}