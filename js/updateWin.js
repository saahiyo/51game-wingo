import { gameData } from "./gameConfig.js";
import { winBonus, winColor, winDetail, winningNum, winSmallBig} from "./elements.js";
import { period_number } from "./elements.js";
import { newBalance } from "./events.js";

let gameDataIndex = 0;
export function updateWinDialog() {
    let gameBalance = newBalance;
    console.log(gameData[gameDataIndex]);
    winDetail.textContent = `Period:30 second ${period_number.textContent}`;
    gameDataIndex = (gameDataIndex + 1) % gameData.length;
}