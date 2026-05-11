import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameConfig } from '../types/game.types';
import {
  initializeGame,
  placeCard,
  allPlayersPlaced,
  startNewRound,
} from '../game/gameEngine';

interface GameStore extends GameState {
  initialize: (config: GameConfig) => void;
  placeCard: (playerId: string, lineId: string, stationIndex: number, value: number | 'star') => void;
  confirmAllPlaced: () => void;
  startNewRound: () => void;
  endGame: () => void;
  resetGame: () => void;
}

const initialState: Omit<GameState, 'config'> = {
  phase: 'setup',
  playerCount: 0,
  players: [],
  currentCard: null,
  deck: [],
  usedCards: [],
  currentRound: 0,
  scores: [],
  allPlayersPlaced: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      config: { playerCount: 0, lineCount: 1, transferCount: 0 },

      initialize: (config: GameConfig) => {
        const gameState = initializeGame(config);
        set(gameState);
      },

      placeCard: (playerId: string, lineId: string, stationIndex: number, value: number | 'star') => {
        const state = get();
        const newState = placeCard(state, playerId, lineId, stationIndex, value);
        set(newState);
      },

      confirmAllPlaced: () => {
        const state = get();
        const newState = allPlayersPlaced(state);
        set(newState);
      },

      startNewRound: () => {
        const state = get();
        const newState = startNewRound(state);
        set(newState);
      },

      endGame: () => {
        set({ phase: 'gameEnd' });
      },

      resetGame: () => {
        const currentConfig = get().config;
        set({ ...initialState, config: currentConfig });
      },
    }),
    {
      name: 'metro-x-game',
      partialize: (state) => ({
        scores: state.scores,
        currentRound: state.currentRound,
      }),
    }
  )
);
