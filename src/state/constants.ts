// src/state/constants.ts

export const PLAYER_COLORS = ['#FF4136', '#0074D9', '#2ECC40', '#FFDC00'] as const;

export const TOTAL_RING_FIELDS = 64;
export const START_FIELDS_PER_PLAYER = 4;
export const HOME_FIELDS_PER_PLAYER = 4;
export const TOTAL_PLAYERS = 4;
export const FIELDS_PER_QUARTER = TOTAL_RING_FIELDS / TOTAL_PLAYERS;