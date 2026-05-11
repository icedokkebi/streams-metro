import type { GameState, PlayerBoard, GameConfig } from '../types/game.types';
import { generateRandomBoard } from '../data/metro-lines';
import { createCardDeck } from '../data/card-deck';
import { calculatePlayerScore } from './scoringEngine';

export const initializeGame = (config: GameConfig): GameState => {
  const players: PlayerBoard[] = [];

  for (let i = 0; i < config.playerCount; i++) {
    players.push({
      playerId: `player-${i}`,
      lines: generateRandomBoard(config.lineCount, config.transferCount),
    });
  }

  const deck = createCardDeck();
  const firstCard = deck[0];

  return {
    phase: 'playing',
    playerCount: config.playerCount,
    players,
    currentCard: firstCard,
    deck: deck.slice(1),
    usedCards: [],
    currentRound: 1,
    scores: players.map(p => ({
      playerId: p.playerId,
      roundScore: 0,
      totalScore: 0,
      sequences: [],
    })),
    allPlayersPlaced: false,
    config,
  };
};

export const drawNextCard = (state: GameState): GameState => {
  if (state.deck.length === 0) {
    return endRound(state);
  }

  const nextCard = state.deck[0];
  const usedCards = state.currentCard
    ? [...state.usedCards, state.currentCard]
    : state.usedCards;

  return {
    ...state,
    currentCard: nextCard,
    deck: state.deck.slice(1),
    usedCards,
    allPlayersPlaced: false,
  };
};

export const placeCard = (
  state: GameState,
  playerId: string,
  lineId: string,
  stationIndex: number,
  value: number | 'star'
): GameState => {
  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  if (playerIndex === -1) return state;

  const player = state.players[playerIndex];
  const lineIndex = player.lines.findIndex(l => l.id === lineId);
  if (lineIndex === -1) return state;

  const line = player.lines[lineIndex];

  // Check if this line is active
  if (!line.active) return state;

  const station = line.stations[stationIndex];
  if (station.value !== null) return state;

  // Clone player data
  const newPlayers = [...state.players];
  const newPlayerLines = [...player.lines];

  // Place value on current station
  newPlayerLines[lineIndex] = {
    ...line,
    stations: line.stations.map((s, sIdx) =>
      sIdx === stationIndex ? { ...s, value } : s
    ),
  };

  // If this is a transfer station, also place on connected stations
  if (station.transferWith && station.transferWith.length > 0) {
    station.transferWith.forEach(connectedStationId => {
      // Parse connected station ID: "line-X-station-Y"
      const parts = connectedStationId.split('-');
      const connectedLineIdx = parseInt(parts[1]);
      const connectedStationIdx = parseInt(parts[3]);

      if (connectedLineIdx < newPlayerLines.length) {
        const connectedLine = newPlayerLines[connectedLineIdx];
        newPlayerLines[connectedLineIdx] = {
          ...connectedLine,
          stations: connectedLine.stations.map((s, sIdx) =>
            sIdx === connectedStationIdx ? { ...s, value } : s
          ),
        };
      }
    });
  }

  newPlayers[playerIndex] = {
    ...player,
    lines: newPlayerLines,
  };

  // Check if the line is now complete
  const updatedLine = newPlayers[playerIndex].lines[lineIndex];
  const isLineComplete = updatedLine.stations.every(s => s.value !== null);

  if (isLineComplete) {
    updatedLine.completed = true;

    // Activate next line if exists
    const nextLineIndex = lineIndex + 1;
    if (nextLineIndex < newPlayers[playerIndex].lines.length) {
      newPlayers[playerIndex].lines[nextLineIndex].active = true;
    }
  }

  return {
    ...state,
    players: newPlayers,
  };
};

export const allPlayersPlaced = (state: GameState): GameState => {
  const newScores = state.players.map(player => {
    const prevScore = state.scores.find(s => s.playerId === player.playerId);
    return calculatePlayerScore(
      player.playerId,
      player.lines,
      prevScore?.totalScore || 0
    );
  });

  const allFilled = state.players.every(player =>
    player.lines.every(line =>
      line.stations.every(station => station.value !== null)
    )
  );

  if (allFilled || state.deck.length === 0) {
    return {
      ...state,
      scores: newScores,
      phase: 'roundEnd',
    };
  }

  return drawNextCard({
    ...state,
    scores: newScores,
    allPlayersPlaced: true,
  });
};

export const endRound = (state: GameState): GameState => {
  const newScores = state.players.map(player => {
    const prevScore = state.scores.find(s => s.playerId === player.playerId);
    return calculatePlayerScore(
      player.playerId,
      player.lines,
      prevScore?.totalScore || 0
    );
  });

  return {
    ...state,
    scores: newScores,
    phase: 'roundEnd',
  };
};

export const startNewRound = (state: GameState): GameState => {
  const players: PlayerBoard[] = state.players.map(p => ({
    ...p,
    lines: generateRandomBoard(state.config.lineCount, state.config.transferCount),
  }));

  const deck = createCardDeck();
  const firstCard = deck[0];

  return {
    ...state,
    phase: 'playing',
    players,
    currentCard: firstCard,
    deck: deck.slice(1),
    usedCards: [],
    currentRound: state.currentRound + 1,
    allPlayersPlaced: false,
  };
};
