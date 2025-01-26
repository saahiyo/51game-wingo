// [file name]: api.js
import { generateOfflinePeriodData } from './offlineTimer.js';
import { GAME_DETAILS } from './utils.js';

export async function getGameIssue(params) {
  // Use offline data generation
  const gameType = Object.entries(GAME_DETAILS).find(
    ([_, config]) => config.typeId === params.typeId
  )?.[0] || 'Win Go 30s';

  return {
    data: generateOfflinePeriodData(gameType),
    code: 200,
    message: "Offline data"
  };
}