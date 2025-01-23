import { gameData } from "./gameConfig.js";
import { winBonus, winColor, winDetail, winningNum, winSmallBig, colorType } from "./elements.js";
import { period_number } from "./elements.js";
import { newBalance } from "./events.js";

// type0 = red+violet
// type3 = green
// type4 = red
// type5 = yellow
// type6 = green+violet

let gameDataIndex = 0;
export function updateWinDialog() {
    let gameBalance = newBalance;
    console.log(gameData[gameDataIndex]);

    // Update details
    winDetail.textContent = `Period: 30 seconds ${period_number.textContent}`;
    winSmallBig.textContent = gameData[gameDataIndex].isBig ? "Big" : "Small";
    winningNum.textContent = gameData[gameDataIndex].randomNumber;

    // Determine win color
    let winColorText =  getWinColorText(gameData[gameDataIndex]);
    if (gameData[gameDataIndex].showRed) {
        winColorText = "Red";
        colorType.classList.replace("typeundefined", "type4"); // Replace with red type
    } else if (gameData[gameDataIndex].showGreen) {
        winColorText = "Green";
        colorType.classList.replace("typeundefined", "type3"); // Replace with green type
    } else if (gameData[gameDataIndex].showRed && gameData[gameDataIndex].showViolet) {
        colorType.classList.replace("typeundefined", "type0"); // Replace with red+violet type
    } else if (gameData[gameDataIndex].showGreen && gameData[gameDataIndex].showViolet) {
        colorType.classList.replace("typeundefined", "type6"); // Replace with green+violet type
    } else {
        colorType.classList.replace("typeundefined", "type5"); // Default to yellow
    }

    winColor.textContent = winColorText;

    // Increment gameDataIndex
    gameDataIndex = (gameDataIndex + 1) % gameData.length;
}

function getWinColorText(gameDataEntry) {
    if (gameDataEntry.showRed) {
        return "Red";
    } else if (gameDataEntry.showGreen) {
        return "Green"; 
    } else if (gameDataEntry.showRed && gameDataEntry.showViolet) {
        return "Red+Violet";
    } else if (gameDataEntry.showGreen && gameDataEntry.showViolet) {
        return "Green+Violet";
    }
    return "Violet"; // Default case
}

