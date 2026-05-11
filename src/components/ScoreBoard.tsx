import type { PlayerScore } from '../types/game.types';

interface ScoreBoardProps {
  scores: PlayerScore[];
  currentRound: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, currentRound }) => {
  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          점수판
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {currentRound}라운드
        </div>
      </div>

      <div className="space-y-4">
        {sortedScores.map((score, idx) => {
          const playerNum = parseInt(score.playerId.split('-')[1]) + 1;
          const isWinning = idx === 0;

          return (
            <div
              key={score.playerId}
              className={`relative p-6 rounded-xl transition-all transform hover:scale-105 ${
                isWinning
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-xl'
                  : 'bg-white dark:bg-gray-800 shadow-lg'
              }`}
            >
              {isWinning && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    👑 1등
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`text-3xl font-black ${
                      isWinning ? 'text-white' : 'text-gray-400 dark:text-gray-600'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <div
                      className={`text-xl font-bold ${
                        isWinning ? 'text-white' : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      플레이어 {playerNum}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        isWinning ? 'text-white text-opacity-90' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      이번 라운드: <span className="font-bold">+{score.roundScore}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-5xl font-black ${
                    isWinning ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {score.totalScore}
                </div>
              </div>

              {score.sequences.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                  <div
                    className={`text-xs font-medium ${
                      isWinning ? 'text-white text-opacity-75' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    연속: {score.sequences.map((s) => `${s.length}칸 (${s.score}점)`).join(' • ')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
