export type CardValue = number | 'star';

export interface Card {
  id: string;
  value: CardValue;
}

export interface Station {
  id: string;
  position: number;
  value: number | null | 'star';
  isTransfer: boolean;
  transferWith?: string[]; // IDs of connected transfer stations
  x: number;
  y: number;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: Station[];
  path: { x: number; y: number }[];
  active: boolean;
  completed: boolean;
}

export interface PlayerBoard {
  playerId: string;
  lines: MetroLine[];
}

export interface PlayerScore {
  playerId: string;
  roundScore: number;
  totalScore: number;
  sequences: { lineId: string; length: number; score: number }[];
}

export interface GameConfig {
  playerCount: number;
  lineCount: 1 | 2 | 3;
  transferCount: 0 | 1 | 2 | 3;
}

export interface GameState {
  phase: 'setup' | 'playing' | 'roundEnd' | 'gameEnd';
  playerCount: number;
  players: PlayerBoard[];
  currentCard: Card | null;
  deck: Card[];
  usedCards: Card[];
  currentRound: number;
  scores: PlayerScore[];
  allPlayersPlaced: boolean;
  config: GameConfig;
}
