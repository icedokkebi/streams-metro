import type { MetroLine } from '../../types/game.types';

interface MetroMapProps {
  lines: MetroLine[];
  onStationClick: (lineId: string, stationIndex: number) => void;
  canInteract: boolean;
}

export const MetroMap: React.FC<MetroMapProps> = ({ lines, onStationClick, canInteract }) => {
  const width = 900;
  const height = Math.max(400, lines.length * 150 + 100);

  const generatePathD = (line: MetroLine): string => {
    if (line.path.length < 2) return '';

    // Simple straight line connection
    let d = `M ${line.path[0].x} ${line.path[0].y}`;
    for (let i = 1; i < line.path.length; i++) {
      d += ` L ${line.path[i].x} ${line.path[i].y}`;
    }

    return d;
  };

  // Get transfer station info (which lines are connected)
  const getTransferColors = (station: any, currentLineColor: string) => {
    if (!station.transferWith || station.transferWith.length === 0) {
      return null;
    }

    // Find the other line's color
    const otherStationId = station.transferWith[0];
    const otherLineIdx = parseInt(otherStationId.split('-')[1]);
    const otherLineColor = lines[otherLineIdx]?.color || currentLineColor;

    return { color1: currentLineColor, color2: otherLineColor };
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden relative border-4 border-blue-200 dark:border-gray-700">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        style={{ minHeight: '350px' }}
      >
        <defs>
          {/* Grid pattern background */}
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1"/>
          </pattern>

          {/* Glow filters for active lines */}
          {lines.map((line) => (
            <filter key={`glow-${line.id}`} id={`glow-${line.id}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Grid background */}
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Draw lines (inactive first, then active) */}
        {lines
          .slice()
          .sort((a, b) => (a.active ? 1 : 0) - (b.active ? 1 : 0))
          .map((line) => (
            <g key={`line-${line.id}`}>
              {/* Line shadow */}
              <path
                d={generatePathD(line)}
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                transform="translate(0, 2)"
              />

              {/* Line path */}
              <path
                d={generatePathD(line)}
                stroke={line.color}
                strokeWidth={line.active ? '6' : '4'}
                strokeLinecap="round"
                fill="none"
                opacity={line.active ? 1 : 0.5}
                filter={line.active ? `url(#glow-${line.id})` : undefined}
                className="transition-all duration-300"
              />

              {/* Stations */}
              {line.stations.map((station, idx) => {
                const canClick = canInteract && line.active && station.value === null;
                const isFilled = station.value !== null;
                const isStar = station.value === 'star';
                const transferColors = getTransferColors(station, line.color);

                return (
                  <g key={station.id}>
                    {/* Station number box below */}
                    <rect
                      x={station.x - 12}
                      y={station.y + 25}
                      width="24"
                      height="18"
                      fill="white"
                      stroke={line.color}
                      strokeWidth="1.5"
                      rx="2"
                      opacity={line.active || isFilled ? 1 : 0.5}
                    />
                    <text
                      x={station.x}
                      y={station.y + 37}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={line.color}
                      fontSize="11"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                      opacity={line.active || isFilled ? 1 : 0.5}
                    >
                      {idx + 1}
                    </text>

                    {/* Station circle */}
                    <g
                      onClick={() => canClick && onStationClick(line.id, idx)}
                      className={canClick ? 'cursor-pointer' : ''}
                      style={{ pointerEvents: canClick ? 'all' : 'none' }}
                    >
                      {/* Pulse animation for clickable stations */}
                      {canClick && (
                        <circle
                          cx={station.x}
                          cy={station.y}
                          r="22"
                          fill={line.color}
                          opacity="0.15"
                          className="animate-pulse"
                        />
                      )}

                      {/* Transfer station: Two overlapping circles */}
                      {station.isTransfer && transferColors ? (
                        <>
                          {/* Left circle - First line color */}
                          <circle
                            cx={station.x - 5}
                            cy={station.y}
                            r="12"
                            fill={isFilled ? transferColors.color1 : 'white'}
                            stroke={transferColors.color1}
                            strokeWidth="3"
                            opacity={line.active || isFilled ? 1 : 0.5}
                            className="transition-all duration-200"
                          />

                          {/* Right circle - Second line color */}
                          <circle
                            cx={station.x + 5}
                            cy={station.y}
                            r="12"
                            fill={isFilled ? transferColors.color2 : 'white'}
                            stroke={transferColors.color2}
                            strokeWidth="3"
                            opacity={line.active || isFilled ? 1 : 0.5}
                            className="transition-all duration-200"
                          />

                          {/* White overlay in the middle to create overlap effect */}
                          {!isFilled && (
                            <ellipse
                              cx={station.x}
                              cy={station.y}
                              rx="3"
                              ry="12"
                              fill="white"
                              opacity="0.8"
                            />
                          )}
                        </>
                      ) : (
                        /* Regular station: Single circle */
                        <circle
                          cx={station.x}
                          cy={station.y}
                          r="12"
                          fill={isFilled ? line.color : 'white'}
                          stroke={line.color}
                          strokeWidth="3"
                          opacity={line.active || isFilled ? 1 : 0.5}
                          className={`transition-all duration-200 ${
                            canClick ? 'hover:r-16 hover:stroke-width-4' : ''
                          }`}
                        />
                      )}

                      {/* Content inside station */}
                      {isStar ? (
                        <text
                          x={station.x}
                          y={station.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="18"
                          className="pointer-events-none select-none"
                        >
                          ⭐
                        </text>
                      ) : (
                        isFilled && (
                          <text
                            x={station.x}
                            y={station.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="13"
                            fontWeight="bold"
                            className="pointer-events-none select-none"
                          >
                            {station.value}
                          </text>
                        )
                      )}

                      {/* Hover effect ring */}
                      {canClick && (
                        <circle
                          cx={station.x}
                          cy={station.y}
                          r="18"
                          fill="none"
                          stroke={line.color}
                          strokeWidth="2"
                          opacity="0"
                          className="transition-opacity hover:opacity-60"
                        />
                      )}
                    </g>
                  </g>
                );
              })}
            </g>
          ))}

        {/* Line legend in top-left corner */}
        {lines.map((line, idx) => (
          <g key={`legend-${line.id}`}>
            <rect
              x="20"
              y={20 + idx * 40}
              width="120"
              height="32"
              rx="16"
              fill="white"
              stroke={line.color}
              strokeWidth="2"
              opacity={line.active ? 1 : 0.6}
              className="transition-all"
            />
            <circle
              cx="38"
              cy={36 + idx * 40}
              r="8"
              fill={line.color}
            />
            <text
              x="55"
              y={36 + idx * 40}
              dominantBaseline="middle"
              fill={line.color}
              fontSize="14"
              fontWeight="bold"
            >
              {line.name}
            </text>
            {line.completed && (
              <text x="115" y={36 + idx * 40} fontSize="18" dominantBaseline="middle">
                ✓
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
