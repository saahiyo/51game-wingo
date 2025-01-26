// gameRecord.js
import { period_time, period_number } from "./elements.js";
import { gameData } from "./gameConfig.js";
import { checkTimeLeft5sec, whenTimeFinished } from "./events.js";
import { generateOfflinePeriodData } from "./offlineTimer.js";

const GAME_INTERVALS = {
  "Win Go 30s": 30000,
  "Win Go 1Min": 60000,
  "Win Go 3Min": 180000,
  "Win Go 5Min": 300000
};

let currentGameType = "Win Go 30s";
let isTransitioning = false;
let rowInserted = false;
let gameDataIndex = 0;

export let timeLeft = 0;

function addNewRow(container, issueNumber) {
    if (!container || rowInserted) return;
    rowInserted = true;

    const newRow = document.createElement("div");
    newRow.className = "van-row";
    newRow.setAttribute("data-v-481307ec", "");

    // Get game data with index cycling
    const { randomNumber, isBig, showRed, showGreen, mixedColor5 } = gameData[gameDataIndex];
    gameDataIndex = (gameDataIndex + 1) % gameData.length;

    // Style calculations
    const showGreenBlock = mixedColor5 ? 'block' : (showGreen ? 'block' : 'none');
    const showRedBlock = mixedColor5 ? 'none' : (showRed ? 'block' : 'none');
    const showVioletBlock = mixedColor5 ? 'block' : 'none';

    newRow.innerHTML = `
        <div class="van-col van-col--9" data-v-481307ec>
            ${issueNumber}
        </div>
        <div class="van-col van-col--5 numcenter" data-v-481307ec>
            <div class="GameRecord__C-body-num ${randomNumber === 5 ? 'mixedColor5' : (showRed ? 'defaultColor' : 'greenColor')}" data-v-481307ec>
                ${randomNumber}
            </div>
        </div>
        <div class="van-col van-col--5" data-v-481307ec>
            <span data-v-481307ec>${isBig ? "Big" : "Small"}</span>
        </div>
        <div class="van-col van-col--5" data-v-481307ec>
            <div class="GameRecord__C-origin" data-v-481307ec>
                <div class="GameRecord__C-origin-I ${showRed ? 'red' : ''}" 
                     style="display: ${showRedBlock}" data-v-481307ec>
                </div>
                <div class="GameRecord__C-origin-I green" 
                     style="display: ${showGreenBlock}" data-v-481307ec>
                </div>
                <div class="GameRecord__C-origin-I violet" 
                     style="display: ${showVioletBlock}" data-v-481307ec>
                </div>
            </div>
        </div>
    `;

    requestAnimationFrame(() => {
        container.insertBefore(newRow, container.firstChild);
        while (container.children.length > 10) {
            container.lastElementChild.remove();
        }
        rowInserted = false;
    });
}

function clearUIElements() {
    const bettingMark = document.querySelector(".Betting__C-mark");
    if (bettingMark) bettingMark.style.display = "none";
    updateTimeDisplay(period_time, 0, 0);
}

export async function startCountdown(endTime, gameType, issueNumber) {
  const displayElement = period_time;
  const bettingMark = document.querySelector(".Betting__C-mark");
  const gameRecordBody = document.querySelector(".GameRecord__C-body");
  
  if (!displayElement) return;
  
  // Clear existing interval
  if (displayElement.timerInterval) {
      clearInterval(displayElement.timerInterval);
  }

  currentGameType = gameType;
  let lastSecond = -1;

  const updateTimer = () => {
      const now = Date.now();
      timeLeft = Math.max(0, endTime - now);
      const currentSecond = Math.floor(timeLeft / 1000);

      // Update countdown display
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
      updateTimeDisplay(displayElement, minutes, seconds);

      // Handle betting mark visibility
      if (bettingMark) {
          if (timeLeft <= 6000 && timeLeft > 0) {
              // Only trigger once per second
              if (currentSecond !== lastSecond) {
                  checkTimeLeft5sec(timeLeft);
                  lastSecond = currentSecond;
              }
              
              bettingMark.style.display = "flex";
              bettingMark.innerHTML = `
                  <div data-v-4aca9bd1>${Math.floor(seconds / 10)}</div>
                  <div data-v-4aca9bd1>${seconds % 10}</div>
              `;
          } else {
              bettingMark.style.display = "none";
              lastSecond = -1;
          }
      }

      if (timeLeft <= 0) {
          clearTimeout(displayElement.timerInterval);
          clearUIElements();
          addNewRow(gameRecordBody, issueNumber);
          startNewRound();
          whenTimeFinished();
          return;
      }
      const nextUpdate = 1000 - (now % 1000);
      displayElement.timerInterval = setTimeout(updateTimer, nextUpdate);
  };

  const initialDelay = 1000 - (Date.now() % 1000);
  displayElement.timerInterval = setTimeout(updateTimer, initialDelay);
}

function startNewRound() {
    if (isTransitioning) return;
    isTransitioning = true;

    const newData = generateOfflinePeriodData(currentGameType);
    const newEndTime = new Date(newData.endTime);
    
    requestAnimationFrame(() => {
        if (period_number) period_number.textContent = newData.issueNumber;
        startCountdown(newEndTime.getTime(), currentGameType, newData.issueNumber);
    });

    isTransitioning = false;
}

function updateTimeDisplay(element, minutes, seconds) {
    if (!element) return;
    
    const timeDivs = element.querySelectorAll("div");
    if (timeDivs.length === 5) {
        timeDivs[0].textContent = Math.floor(minutes / 10);
        timeDivs[1].textContent = minutes % 10;
        timeDivs[3].textContent = Math.floor(seconds / 10);
        timeDivs[4].textContent = seconds % 10;
    }
}

// Initialize with default 30s game
export function initializeGame() {
  const now = new Date();
  const initialData = generateOfflinePeriodData("Win Go 30s");
  
  // Align to exact interval start
  const interval = GAME_INTERVALS["Win Go 30s"];
  const startDelay = (interval - (now % interval)) % interval;
  
  setTimeout(() => {
      period_number.textContent = initialData.issueNumber;
      startCountdown(new Date(initialData.endTime).getTime(), "Win Go 30s", initialData.issueNumber);
  }, startDelay);
}

export { addNewRow };