import type { MetroLine, Station } from '../types/game.types';

const LINE_COLORS = ['#E60012', '#0078C8', '#009B3A']; // 빨강, 파랑, 초록
const LINE_NAMES = ['빨강선', '파랑선', '초록선'];

interface Point {
  x: number;
  y: number;
}

interface TransferPoint {
  line1: number;
  line2: number;
  station1: number;
  station2: number;
}

export const generateRandomBoard = (
  lineCount: 1 | 2 | 3,
  transferCount: 0 | 1 | 2 | 3
): MetroLine[] => {
  const lines: MetroLine[] = [];
  const canvasWidth = 900;
  const canvasHeight = lineCount * 150 + 100;

  // Generate line lengths (9-12 stations each)
  const lineLengths = Array.from(
    { length: lineCount },
    () => Math.floor(Math.random() * 4) + 9
  );

  // PRE-DETERMINE transfer stations
  const plannedTransfers: TransferPoint[] = [];

  if (lineCount > 1 && transferCount > 0) {
    // Create specified number of transfers
    for (let t = 0; t < transferCount; t++) {
      const line1 = 0;
      const line2 = 1;

      // Spread transfers evenly
      const minStation = Math.max(2, Math.floor(lineLengths[0] * 0.2));
      const maxStation = Math.floor(lineLengths[0] * 0.8);
      const stationRange = maxStation - minStation;

      const station1 = minStation + Math.floor((stationRange / (transferCount + 1)) * (t + 1));
      const station2 = station1;

      plannedTransfers.push({
        line1,
        line2,
        station1,
        station2,
      });
    }
  }

  // Generate paths with ZIGZAG pattern
  const linePaths: Point[][] = [];

  for (let i = 0; i < lineCount; i++) {
    const path = generateZigzagPath(
      lineLengths[i],
      canvasWidth,
      canvasHeight,
      i,
      lineCount,
      transferCount
    );
    linePaths.push(path);
  }

  // Create lines with stations
  for (let lineIdx = 0; lineIdx < lineCount; lineIdx++) {
    const stations: Station[] = [];
    const path = linePaths[lineIdx];

    for (let i = 0; i < lineLengths[lineIdx]; i++) {
      const connectedTransfers = plannedTransfers.filter(
        t => (t.line1 === lineIdx && t.station1 === i) || (t.line2 === lineIdx && t.station2 === i)
      );

      let transferWith: string[] = [];
      if (connectedTransfers.length > 0) {
        connectedTransfers.forEach(transfer => {
          const otherLineIdx = transfer.line1 === lineIdx ? transfer.line2 : transfer.line1;
          const otherStationIdx = transfer.line1 === lineIdx ? transfer.station2 : transfer.station1;
          transferWith.push(`line-${otherLineIdx}-station-${otherStationIdx}`);
        });
      }

      stations.push({
        id: `line-${lineIdx}-station-${i}`,
        position: i,
        value: null,
        isTransfer: transferWith.length > 0,
        transferWith: transferWith.length > 0 ? transferWith : undefined,
        x: path[i].x,
        y: path[i].y,
      });
    }

    lines.push({
      id: `line-${lineIdx}`,
      name: LINE_NAMES[lineIdx],
      color: LINE_COLORS[lineIdx],
      stations,
      path: path,
      active: lineIdx === 0,
      completed: false,
    });
  }

  return lines;
};

function generateZigzagPath(
  stationCount: number,
  width: number,
  height: number,
  lineIndex: number,
  totalLines: number,
  transferCount: 0 | 1 | 2 | 3
): Point[] {
  const points: Point[] = [];
  const marginX = 80;
  const marginY = 80;
  const stationSpacing = (width - 2 * marginX) / (stationCount - 1);

  // Calculate base Y position
  const lineSpacing = totalLines > 1 ? (height - 2 * marginY) / (totalLines - 1) : 0;
  const baseY = marginY + (lineIndex * lineSpacing);

  if (transferCount === 0) {
    // No transfers: straight horizontal line
    for (let i = 0; i < stationCount; i++) {
      const x = marginX + (i * stationSpacing);
      points.push({ x, y: baseY });
    }
  } else {
    // Zigzag pattern for transfers
    const zigzagAmplitude = 40; // Height of zigzag
    const zigzagPeriod = Math.max(2, Math.floor(stationCount / (transferCount + 1))); // Stations per zigzag

    for (let i = 0; i < stationCount; i++) {
      const x = marginX + (i * stationSpacing);

      // Calculate zigzag Y position
      const cyclePosition = i % zigzagPeriod;
      const cycleProgress = cyclePosition / zigzagPeriod;

      let yOffset: number;

      if (lineIndex === 0) {
        // First line: up-down zigzag (starts up)
        // 0 -> 0.5: go down, 0.5 -> 1.0: go up
        if (cycleProgress < 0.5) {
          yOffset = -zigzagAmplitude + (cycleProgress * 2 * zigzagAmplitude);
        } else {
          yOffset = zigzagAmplitude - ((cycleProgress - 0.5) * 2 * zigzagAmplitude);
        }
      } else if (lineIndex === 1) {
        // Second line: down-up zigzag (opposite, starts down)
        if (cycleProgress < 0.5) {
          yOffset = zigzagAmplitude - (cycleProgress * 2 * zigzagAmplitude);
        } else {
          yOffset = -zigzagAmplitude + ((cycleProgress - 0.5) * 2 * zigzagAmplitude);
        }
      } else {
        // Third line: different pattern
        yOffset = Math.sin(cycleProgress * Math.PI * 2) * zigzagAmplitude;
      }

      const y = baseY + yOffset;
      points.push({ x, y });
    }
  }

  return points;
}
