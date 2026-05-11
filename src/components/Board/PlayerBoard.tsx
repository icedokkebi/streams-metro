import type { PlayerBoard as PlayerBoardType, Card } from '../../types/game.types';
import { canPlaceValue } from '../../game/scoringEngine';
import { MetroMap } from './MetroMap';

interface PlayerBoardProps {
  player: PlayerBoardType;
  currentCard: Card | null;
  onPlaceCard: (lineId: string, stationIndex: number, value: number | 'star') => void;
  playerNumber: number;
}

export const PlayerBoard: React.FC<PlayerBoardProps> = ({
  player,
  currentCard,
  onPlaceCard,
  playerNumber,
}) => {
  const handleStationClick = (lineId: string, stationIndex: number) => {
    if (!currentCard) return;

    const line = player.lines.find(l => l.id === lineId);
    if (!line || !line.active) return;

    if (currentCard.value === 'star') {
      // 별 카드는 그냥 'star'로 배치
      if (canPlaceValue(line, stationIndex, 'star')) {
        onPlaceCard(lineId, stationIndex, 'star');
      } else {
        alert('이미 숫자가 있습니다!');
      }
    } else {
      // 일반 숫자 카드
      if (canPlaceValue(line, stationIndex, currentCard.value as number)) {
        onPlaceCard(lineId, stationIndex, currentCard.value as number);
      } else {
        alert('이미 숫자가 있습니다!');
      }
    }
  };

  return (
    <div className="flex-1 border-b-2 border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Player badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg font-bold text-lg">
          플레이어 {playerNumber}
        </div>
      </div>

      {/* Metro map */}
      <MetroMap
        lines={player.lines}
        onStationClick={handleStationClick}
        canInteract={!!currentCard}
      />

      {/* Active line indicator */}
      <div className="mt-4 flex gap-2 justify-center">
        {player.lines.map((line) => (
          <div
            key={line.id}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              line.active
                ? 'scale-110 shadow-lg'
                : line.completed
                ? 'opacity-50'
                : 'opacity-30'
            }`}
            style={{
              backgroundColor: line.active || line.completed ? line.color : '#ccc',
              color: 'white',
            }}
          >
            {line.name} {line.completed && '✓'}
          </div>
        ))}
      </div>
    </div>
  );
};
