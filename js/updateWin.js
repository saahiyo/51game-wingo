import { gameData } from "./gameConfig.js";
import { winBonus, winColor, winDetail, winningNum, winSmallBig, colorType } from "./elements.js";
import { period_number } from "./elements.js";
import { newBalance , totalBetAmount} from "./events.js";

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
    winColor.textContent = getWinColorText(gameData[gameDataIndex]) === "type3" ? "Green" : "Red";

    // console.log(totalBetAmount);

    const regex = /^type/;
    colorType.classList.forEach(className => {
        if (regex.test(className)) {
            colorType.classList.remove(className);
        }
    });

    colorType.classList.add(winColorType);
    let winColorType =  getWinColorText(gameData[gameDataIndex]);

    // Increment gameDataIndex
    gameDataIndex = (gameDataIndex + 1) % gameData.length;
}

function getWinColorText(gameDataEntry) {
    if (gameDataEntry.showRed) {
        return "type4";
    } else if (gameDataEntry.showGreen) {
        return "type3"; 
    } else if (gameDataEntry.showRed && gameDataEntry.showViolet) {
        return "type0";
    } else if (gameDataEntry.showGreen && gameDataEntry.showViolet) {
        return "type6";
    }
    return "Violet";
}






// rules text
 
//  1 minutes 1 issue, 45 seconds to order, 15 seconds waiting for the draw. It opens all day. The total number of trade is 1440 issues.

// If you spend 100 to trade, after deducting 2 service fee, your contract amount is 98:

// 1.Selectgreen: if the result shows 1,3,7,9 you will get (98*2) 196;If the result shows 5, you will get (98*1.5) 147

// 2.Selectred: if the result shows 2,4,6,8 you will get (98*2) 196;If the result shows 0, you will get (98*1.5) 147

// 3.Selectviolet:if the result shows 0 or 5, you will get (98*4.5) 441

// 4. Select number:if the result is the same as the number you selected, you will get (98*9) 882

// 5. Select big: if the result shows 5,6,7,8,9 you will get (98 * 2) 196

// 6. Select small: if the result shows 0,1,2,3,4 you will get (98 * 2) 196