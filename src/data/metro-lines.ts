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

  // PRE-DETERMINE transfer stations with minimum 5 station spacing
  const plannedTransfers: TransferPoint[] = [];
  const MIN_TRANSFER_SPACING = 5; // Minimum distance between transfers

  if (lineCount > 1 && transferCount > 0) {
    // Create specified number of transfers
    const line1 = 0;
    const line2 = 1;

    // Calculate available range for transfers
    const minStation = Math.max(2, Math.floor(lineLengths[0] * 0.2));
    const maxStation = Math.floor(lineLengths[0] * 0.8);
    const availableRange = maxStation - minStation;

    // Check if we have enough space for all transfers with minimum spacing
    const requiredSpace = (transferCount - 1) * MIN_TRANSFER_SPACING;

    if (availableRange >= requiredSpace) {
      // Calculate spacing between transfers
      const spacing = Math.max(MIN_TRANSFER_SPACING, Math.floor(availableRange / (transferCount + 1)));

      for (let t = 0; t < transferCount; t++) {
        const station1 = minStation + spacing * (t + 1);
        const station2 = station1;

        // Ensure station is within bounds
        if (station1 <= maxStation) {
          plannedTransfers.push({
            line1,
            line2,
            station1,
            station2,
          });
        }
      }
    } else {
      // Not enough space, create fewer transfers with minimum spacing
      let currentStation = minStation + MIN_TRANSFER_SPACING;
      let transfersAdded = 0;

      while (currentStation <= maxStation && transfersAdded < transferCount) {
        plannedTransfers.push({
          line1,
          line2,
          station1: currentStation,
          station2: currentStation,
        });
        currentStation += MIN_TRANSFER_SPACING;
        transfersAdded++;
      }
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
  _transferCount: 0 | 1 | 2 | 3
): Point[] {
  const points: Point[] = [];
  const marginX = 80;
  const marginY = 80;
  const stationSpacing = (width - 2 * marginX) / (stationCount - 1);

  // Calculate base Y position
  const lineSpacing = totalLines > 1 ? (height - 2 * marginY) / (totalLines - 1) : 0;
  const baseY = marginY + (lineIndex * lineSpacing);

  // ALWAYS use straight horizontal line (no zigzag)
  for (let i = 0; i < stationCount; i++) {
    const x = marginX + (i * stationSpacing);
    points.push({ x, y: baseY });
  }

  return points;
}
