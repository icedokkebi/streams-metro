import type { MetroLine, PlayerScore, Station } from '../types/game.types';

export const calculatePlayerScore = (
  playerId: string,
  lines: MetroLine[],
  previousTotal: number = 0
): PlayerScore => {
  const sequences: { lineId: string; length: number; score: number }[] = [];
  let roundScore = 0;

  lines.forEach(line => {
    const lineSequences = findAscendingSequences(line);
    lineSequences.forEach(seq => {
      // Exponential scoring: length^2
      const score = seq.length * seq.length;
      sequences.push({
        lineId: line.id,
        length: seq.length,
        score,
      });
      roundScore += score;
    });
  });

  return {
    playerId,
    roundScore,
    totalScore: previousTotal + roundScore,
    sequences,
  };
};

interface Sequence {
  start: number;
  length: number;
  values: (number | 'star')[];
}

const findAscendingSequences = (line: MetroLine): Sequence[] => {
  const sequences: Sequence[] = [];
  const stations = line.stations;

  // First, resolve all stars to optimal numbers
  const resolvedStations = resolveStars(stations);

  let currentSeq: number[] = [];
  let startPos = -1;

  for (let i = 0; i < resolvedStations.length; i++) {
    const value = resolvedStations[i];

    if (value === null) {
      // Empty station breaks sequence
      if (currentSeq.length >= 2) {
        sequences.push({
          start: startPos,
          length: currentSeq.length,
          values: [...currentSeq],
        });
      }
      currentSeq = [];
      startPos = -1;
    } else {
      // Check if ascending
      if (currentSeq.length === 0 || value > currentSeq[currentSeq.length - 1]) {
        if (currentSeq.length === 0) startPos = i;
        currentSeq.push(value);
      } else {
        // Not ascending, breaks sequence
        if (currentSeq.length >= 2) {
          sequences.push({
            start: startPos,
            length: currentSeq.length,
            values: [...currentSeq],
          });
        }
        currentSeq = [value];
        startPos = i;
      }
    }
  }

  // Final sequence
  if (currentSeq.length >= 2) {
    sequences.push({
      start: startPos,
      length: currentSeq.length,
      values: currentSeq,
    });
  }

  return sequences;
};

// Resolve stars to optimal numbers
function resolveStars(stations: Station[]): (number | null)[] {
  const resolved: (number | null)[] = stations.map(s =>
    s.value === 'star' ? null : s.value
  );

  // Find all star positions
  const starPositions: number[] = [];
  stations.forEach((s, i) => {
    if (s.value === 'star') {
      starPositions.push(i);
    }
  });

  // Resolve each star to the best possible number
  starPositions.forEach(pos => {
    const bestValue = findOptimalStarValue(stations, pos);
    resolved[pos] = bestValue;
  });

  return resolved;
}

// Find the optimal number for a star at given position
function findOptimalStarValue(stations: Station[], starPos: number): number {
  let prevNum: number | null = null;
  let nextNum: number | null = null;

  // Find previous non-star number
  for (let i = starPos - 1; i >= 0; i--) {
    const val = stations[i].value;
    if (val !== null && val !== 'star') {
      prevNum = val;
      break;
    }
  }

  // Find next non-star number
  for (let i = starPos + 1; i < stations.length; i++) {
    const val = stations[i].value;
    if (val !== null && val !== 'star') {
      nextNum = val;
      break;
    }
  }

  // Determine optimal value based on neighbors
  if (prevNum !== null && nextNum !== null) {
    // Between two numbers - pick middle if possible
    if (nextNum > prevNum + 1) {
      return Math.floor((prevNum + nextNum) / 2);
    } else {
      // No valid middle value, star cannot help
      return prevNum + 1;
    }
  } else if (prevNum !== null) {
    // Only previous number exists
    return prevNum + 1;
  } else if (nextNum !== null) {
    // Only next number exists
    return Math.max(1, nextNum - 1);
  } else {
    // No neighbors, default to middle value
    return 15;
  }
}

// Remove validation - allow placing anywhere on active line
export const canPlaceValue = (
  line: MetroLine,
  stationIndex: number,
  _value: number | 'star'
): boolean => {
  const station = line.stations[stationIndex];

  // Only check if station is empty
  return station.value === null;
};
