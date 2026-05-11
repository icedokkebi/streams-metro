import { useState } from 'react';
import type { GameConfig } from '../types/game.types';

interface GameSetupProps {
  onStartGame: (config: GameConfig) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [lineCount, setLineCount] = useState<1 | 2 | 3>(2);
  const [transferCount, setTransferCount] = useState<0 | 1 | 2 | 3>(1);

  const handleStart = () => {
    onStartGame({ playerCount, lineCount, transferCount });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce">🚇</div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            스트림스
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            오름차순 연속으로 점수를 얻으세요
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              플레이어 수
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-110 ${
                    playerCount === count
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              노선 수
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => setLineCount(count as 1 | 2 | 3)}
                  className={`py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-110 ${
                    lineCount === count
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              환승역 수
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => setTransferCount(count as 0 | 1 | 2 | 3)}
                  disabled={lineCount === 1 && count > 0}
                  className={`py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-110 ${
                    transferCount === count
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  } ${lineCount === 1 && count > 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {count}
                </button>
              ))}
            </div>
            {lineCount === 1 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 노선이 2개 이상이어야 환승역을 만들 수 있어요
              </p>
            )}
          </div>

          <button
            onClick={handleStart}
            className="w-full px-6 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all font-bold text-xl transform hover:scale-105 mt-8"
          >
            게임 시작 🚀
          </button>
        </div>

        <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <span>📖</span> 게임 방법
          </h3>
          <ul className="text-xs text-gray-700 dark:text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>역을 클릭해서 카드 숫자를 배치하세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>빨강선 먼저 완성, 그 다음 파랑선, 마지막 초록선</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 font-bold">•</span>
              <span>오름차순 연속이 길수록 높은 점수 (길이² 점수)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>🟡 금색 테두리 = 환승역 (한 선에 입력하면 다른 선에도 자동 입력)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>⭐ 별은 나중에 자동으로 최적 숫자 계산</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
