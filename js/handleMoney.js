import { money , winBonus} from "./elements.js";
import { isBetted } from "./events.js";
import { gameData } from "./gameConfig.js";
import { period_number } from "./elements.js";
import { totalBetAmount } from "./events.js";

export function handleMoneys(){
    let bettedMoney = totalBetAmount
    let deduction = (bettedMoney / 100) * 2;
    let remainingAmount = bettedMoney - deduction;
    let multipliedMoney = remainingAmount * 2
    // console.log("multiplied money: ",multipliedMoney);    
    let currentBalance = parseFloat(money.textContent.replace('₹', '').replace(/,/g, ''));
    currentBalance += multipliedMoney;
    if(isBetted){
        winBonus.textContent = `₹${multipliedMoney.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        money.textContent = `₹${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}