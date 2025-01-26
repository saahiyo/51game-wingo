import { tokenParent } from "./elements.js";
import { gameData } from "./gameConfig.js";

let currentIndex = 0;
export function colorTokens() {
    const parentDiv = tokenParent;

    const data = gameData[currentIndex];

    // Create a new div element
    const newDiv = document.createElement('div');
    newDiv.setAttribute("data-v-3e4c6499", "");
    newDiv.classList.add(`n${data.randomNumber}`);

    // Add new element at the beginning
    parentDiv.insertBefore(newDiv, parentDiv.firstChild);

    // Remove the last element if it exists
    if (parentDiv.children.length > 4) {
        console.log(parentDiv);
        if (parentDiv.lastElementChild) {
            parentDiv.removeChild(parentDiv.lastElementChild);
        }
    }
    currentIndex = (currentIndex + 1) % gameData.length;
}
