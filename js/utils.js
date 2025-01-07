// utils.js
import { getGameIssue } from "./api.js";
import { period_number, period_time } from "./elements.js";
import { startCountdown } from "./gameRecord.js";

// Cache for game data and API responses
const gameCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds cache duration

// Game configuration
const GAME_DETAILS = {
  "Win Go 30s": { 
    typeId: 30, 
    signature: "29407B5357867599357272C51D941C6A", 
    random: "63a3ccd3f54842108ce90c4d4238eec0",
    interval: 30000
  },
  "Win Go 1Min": { 
    typeId: 1, 
    signature: "B56DCF4D4B79C4688423A40A738D50FF", 
    random: "cf6cdf90be3047da8c9dd4b6b852b912",
    interval: 60000
  },
  "Win Go 3Min": { 
    typeId: 2, 
    signature: "FE7D3F18E6A30AB174A77B273F9DB3FA", 
    random: "bf203c57e1c64fafb83c9c24a4420218",
    interval: 180000
  },
  "Win Go 5Min": { 
    typeId: 3, 
    signature: "068C4984619BFD1F4B946F34413EEC76", 
    random: "6cdda089e4b14893bc9e5361704f0cb9",
    interval: 300000
  },
};

// Keep track of current game state
let currentGame = null;
let isTransitioning = false;

export function onClicked(item) {
  console.log(`Clicked: ${item}`);
}

// Pre-fetch game data
async function prefetchGameData(gameData) {
  const cacheKey = `game_${gameData.typeId}`;
  const now = Date.now();
  const cached = gameCache.get(cacheKey);

  // Return cached data if valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const params = {
      typeId: gameData.typeId,
      random: gameData.random,
      signature: gameData.signature,
      timestamp: Math.floor(now / 1000),
    };

    const response = await getGameIssue(params);
    
    if (response?.data) {
      gameCache.set(cacheKey, {
        data: response.data,
        timestamp: now
      });
      return response.data;
    }
  } catch (error) {
    console.warn(`Prefetch failed for game ${gameData.typeId}:`, error);
  }
  return null;
}

// Optimized game cycle start
async function startNewGameCycle(gameData, retryCount = 0) {
  if (isTransitioning) return;
  isTransitioning = true;

  const params = {
    typeId: gameData.typeId,
    random: gameData.random,
    signature: gameData.signature,
    timestamp: Math.floor(Date.now() / 1000),
  };

  try {
    // Try to use cached data first
    const cacheKey = `game_${gameData.typeId}`;
    const cached = gameCache.get(cacheKey);
    let apiResponse;

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      apiResponse = { data: cached.data };
    } else {
      apiResponse = await Promise.race([
        getGameIssue(params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      ]);
    }

    await handleApiResponse(apiResponse, params);
    
    // Start prefetching next cycle data
    setTimeout(() => {
      prefetchGameData(gameData).catch(console.error);
    }, Math.max(100, gameData.interval - 3000));

  } catch (error) {
    console.error("Error in game cycle:", error);
    if (period_time) period_time.textContent = "Retrying...";
    
    // Progressive retry with backoff
    const retryDelay = Math.min(1000 * Math.pow(1.5, retryCount), 5000);
    setTimeout(() => {
      isTransitioning = false;
      startNewGameCycle(gameData, retryCount + 1);
    }, retryDelay);
    return;
  }

  isTransitioning = false;
}

async function handleApiResponse(apiResponse, params) {
  if (!apiResponse?.data?.endTime || !apiResponse?.data?.issueNumber) {
    throw new Error("Invalid API response");
  }

  const { endTime, issueNumber } = apiResponse.data;
  
  // Update UI immediately using requestAnimationFrame
  requestAnimationFrame(() => {
    if (period_number) period_number.innerHTML = issueNumber;
    startCountdown(new Date(endTime), params, issueNumber);
  });
}

export async function handleGameItemClicked(item, timeLeftName) {
  const gameData = GAME_DETAILS[item];
  
  if (!gameData) {
    console.error("Unknown game clicked");
    if (period_time) period_time.textContent = "N/A";
    return;
  }

  // Update UI immediately
  if (timeLeftName) {
    requestAnimationFrame(() => {
      timeLeftName.innerHTML = item;
    });
  }

  // Don't wait for prefetch to complete before starting the cycle
  prefetchGameData(gameData).catch(console.error);
  
  currentGame = item;
  await startNewGameCycle(gameData);
}

export async function getGamePeriod() {
  const defaultGame = GAME_DETAILS["Win Go 30s"];
  currentGame = "Win Go 30s";
  
  // Start prefetching immediately
  prefetchGameData(defaultGame).catch(console.error);
  
  await startNewGameCycle(defaultGame);
}

// Initialize game on load with error handling
window.addEventListener("load", () => {
  getGamePeriod().catch(error => {
    console.error("Failed to initialize game:", error);
    // Retry initialization after 2 seconds
    setTimeout(getGamePeriod, 2000);
  });
});

// Optional: Clean up cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of gameCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      gameCache.delete(key);
    }
  }
}, CACHE_DURATION);