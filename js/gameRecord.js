// gameRecord.js
import { period_time, period_number } from "./elements.js";
import { getGameIssue } from "./api.js";
import { gameData } from "./gameConfig.js";

let nextRoundData = null;
let isTransitioning = false;
let rowInserted = false;

let gameDataIndex = 0;

function addNewRow(container, params, issueNumber) {
  if (!container) {
    console.error('Container is not defined');
    return;
  }

  if (rowInserted) return;
  rowInserted = true;

  const newRow = document.createElement("div");
  newRow.setAttribute("data-v-481307ec", "");
  newRow.className = "van-row";

  const { randomNumber, isBig, showRed, showGreen } = gameData[gameDataIndex];
  
  // Ensure the index cycles correctly
  console.log("Using gameDataIndex:", gameDataIndex, gameData[gameDataIndex]);
  gameDataIndex = (gameDataIndex + 1) % gameData.length;

  newRow.innerHTML = `
    <div data-v-481307ec="" class="van-col van-col--9">
      ${issueNumber}
    </div>
    <div data-v-481307ec="" class="van-col van-col--5 numcenter">
      <div data-v-481307ec="" class="GameRecord__C-body-num ${showRed ? 'defaultColor' : 'greenColor'}">
        ${randomNumber}
      </div>
    </div>
    <div data-v-481307ec="" class="van-col van-col--5">
      <span data-v-481307ec="">${isBig ? "Big" : "Small"}</span>
    </div>
    <div data-v-481307ec="" class="van-col van-col--5">
      <div data-v-481307ec="" class="GameRecord__C-origin">
        <div data-v-481307ec="" 
             class="GameRecord__C-origin-I ${showRed ? 'red' : ''}"
             style="display: ${showRed ? 'block' : 'none'}">
        </div>
        <div data-v-481307ec="" 
             class="GameRecord__C-origin-I ${showGreen ? 'green' : ''}"
             style="display: ${showGreen ? 'block' : 'none'}">
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    container.insertBefore(newRow, container.firstChild);
    while (container.children.length > 10) {
      container.lastElementChild.remove();
    }
  });
}


async function prefetchNextRound(params) {
  try {
    const response = await getGameIssue({
      ...params,
      timestamp: Math.floor(Date.now() / 1000),
    });

    if (response?.data?.endTime && response?.data?.issueNumber) {
      nextRoundData = response.data;
    }
  } catch (error) {
    console.error("Error prefetching next round:", error);
    nextRoundData = null;
  }
}

function clearUIElements() {
  const bettingMark = document.querySelector(".Betting__C-mark");
  if (bettingMark) bettingMark.style.display = "none";
  updateTimeDisplay(period_time, 0, 0);
}

async function startNextRound(params) {
  if (isTransitioning) return;
  isTransitioning = true;
  rowInserted = false;

  console.log("Transitioning to next round...");

  try {
    if (nextRoundData) {
      const data = nextRoundData;
      nextRoundData = null;

      if (period_number) period_number.innerHTML = data.issueNumber;
      const newEndTime = new Date(data.endTime);
      startCountdown(newEndTime, params, data.issueNumber);

      prefetchNextRound(params);
    } else {
      const response = await getGameIssue({
        ...params,
        timestamp: Math.floor(Date.now() / 1000),
      });

      if (response?.data?.endTime && response?.data?.issueNumber) {
        if (period_number) period_number.innerHTML = response.data.issueNumber;
        const newEndTime = new Date(response.data.endTime);
        startCountdown(newEndTime, params, response.data.issueNumber);
      } else {
        throw new Error("Invalid response for new round");
      }
    }
  } catch (error) {
    console.error("Error starting new round:", error);
    setTimeout(() => startNextRound(params), 2000); // Retry
  } finally {
    isTransitioning = false;
  }
}


export async function startCountdown(endTime, params, issueNumber) {
  const displayElement = period_time;
  const bettingMark = document.querySelector(".Betting__C-mark");
  const gameRecordBody = document.querySelector(".GameRecord__C-body");

  if (!displayElement || displayElement.children.length !== 5) {
    console.error("Invalid display element.");
    return;
  }

  // Clear any existing interval to prevent multiple instances
  if (displayElement.timerInterval) {
    clearInterval(displayElement.timerInterval);
    displayElement.timerInterval = null;
  }

  displayElement.timerInterval = setInterval(() => {
    const now = Date.now();
    const timeLeft = Math.max(0, endTime.getTime() - now);

    // Display countdown and manage bettingMark visibility
    if (bettingMark) {
      if (timeLeft <= 6000 && timeLeft > 0) {
        const seconds = Math.floor((timeLeft / 1000) % 60);
        const secondTens = Math.floor(seconds / 10);
        const secondOnes = seconds % 10;

        requestAnimationFrame(() => {
          bettingMark.style.removeProperty("display");
          bettingMark.innerHTML = `
            <div data-v-4aca9bd1="">${secondTens}</div>
            <div data-v-4aca9bd1="">${secondOnes}</div>
          `;
        });
      } else {
        requestAnimationFrame(() => {
          bettingMark.style.display = "none";
        });
      }
    }

    if (timeLeft <= 0) {
      clearInterval(displayElement.timerInterval);
      clearUIElements();
      addNewRow(gameRecordBody, params, issueNumber);
      console.log("New round triggered.");
      startNextRound(params);
      return;
    }

    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    updateTimeDisplay(displayElement, minutes, seconds);
  }, 1000);
}



function updateTimeDisplay(displayElement, minutes, seconds) {
  if (!displayElement) return;

  const timeDivs = displayElement.querySelectorAll("div");
  if (timeDivs.length === 5) {
    const minuteTens = Math.floor(minutes / 10);
    const minuteOnes = minutes % 10;
    const secondTens = Math.floor(seconds / 10);
    const secondOnes = seconds % 10;

    requestAnimationFrame(() => {
      timeDivs[0].textContent = minuteTens;
      timeDivs[1].textContent = minuteOnes;
      timeDivs[3].textContent = secondTens;
      timeDivs[4].textContent = secondOnes;
    });
  }
}

export { addNewRow };
