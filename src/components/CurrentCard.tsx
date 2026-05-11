import type { Card } from '../types/game.types';

interface CurrentCardProps {
  card: Card | null;
  remainingCards: number;
}

export const CurrentCard: React.FC<CurrentCardProps> = ({ card, remainingCards }) => {
  if (!card) {
    return (
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 text-center shadow-xl">
        <div className="text-6xl mb-2">🎴</div>
        <div className="text-gray-500 dark:text-gray-400 font-medium">카드 없음</div>
      </div>
    );
  }

  const isStar = card.value === 'star';
  const displayValue = isStar ? '⭐' : card.value;
  const bgGradient = isStar
    ? 'from-yellow-400 via-orange-500 to-red-500'
    : 'from-blue-500 via-purple-600 to-pink-600';

  return (
    <div className="space-y-4">
      {/* Main card */}
      <div
        className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-10 text-center shadow-2xl transform transition-all hover:scale-105 animate-flip-in`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div className="text-white text-8xl font-black mb-4 drop-shadow-lg">
          {displayValue}
        </div>
        <div className="text-white text-base font-semibold opacity-95 bg-black bg-opacity-20 rounded-lg py-2 px-4">
          {isStar ? '✨ 만능 카드 - 모든 숫자 가능 ✨' : '이 숫자를 배치하세요'}
        </div>
      </div>

      {/* Remaining cards counter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {remainingCards}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
          남은 카드
        </div>
      </div>
    </div>
  );
};
