import { money } from "./elements.js";
import { newBalance } from "./events.js";
import { gameData } from "./gameConfig.js";
import { period_number } from "./elements.js";
import { totalBetAmount } from "./events.js";

export function handleMoneys(){
    let myMoney = newBalance
    console.log(myMoney += 1);
    console.log("bet amount is: "+ totalBetAmount);
}
