import { useGameStore } from './store/gameStore';
import { GameSetup } from './components/GameSetup';
import { PlayerBoard } from './components/Board/PlayerBoard';
import { CurrentCard } from './components/CurrentCard';
import { ScoreBoard } from './components/ScoreBoard';
import type { GameConfig } from './types/game.types';

function App() {
  const {
    phase,
    players,
    currentCard,
    deck,
    currentRound,
    scores,
    initialize,
    placeCard,
    confirmAllPlaced,
    startNewRound,
    resetGame,
  } = useGameStore();

  const handleStartGame = (config: GameConfig) => {
    initialize(config);
  };

  const handlePlaceCard = (
    playerId: string,
    lineId: string,
    stationIndex: number,
    value: number | 'star'
  ) => {
    placeCard(playerId, lineId, stationIndex, value);
  };

  if (phase === 'setup') {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  if (phase === 'roundEnd' || phase === 'gameEnd') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
              {phase === 'gameEnd' ? '🎉 게임 끝!' : '⭐ 라운드 완료!'}
            </h1>
          </div>

          <ScoreBoard scores={scores} currentRound={currentRound} />

          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={startNewRound}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg transform hover:scale-105"
            >
              다음 라운드 시작
            </button>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-bold text-lg"
            >
              새 게임
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="h-screen flex">
        {/* Left side: Player boards (vertically stacked) */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {players.map((player, idx) => (
            <PlayerBoard
              key={player.playerId}
              player={player}
              currentCard={currentCard}
              onPlaceCard={(lineId, stationIndex, value) =>
                handlePlaceCard(player.playerId, lineId, stationIndex, value)
              }
              playerNumber={idx + 1}
            />
          ))}
        </div>

        {/* Right side: Current card and controls */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-700 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              스트림스 🚇
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentRound}라운드
            </div>
          </div>

          <CurrentCard card={currentCard} remainingCards={deck.length} />

          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 게임 방법
            </h3>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 빈 역을 클릭해서 배치</li>
              <li>• 🟡 환승역은 자동 동기화</li>
              <li>• ⭐ 별은 나중에 자동 최적화</li>
              <li>• 오름차순 연속만 점수!</li>
            </ul>
          </div>

          <button
            onClick={confirmAllPlaced}
            disabled={!currentCard}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-bold text-lg"
          >
            모두 배치 완료 ➜
          </button>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
              📊 현재 점수
            </h3>
            <div className="space-y-2">
              {scores.map((score) => {
                const playerNum = parseInt(score.playerId.split('-')[1]) + 1;
                return (
                  <div key={score.playerId} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      플레이어 {playerNum}
                    </span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {score.totalScore}점
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
