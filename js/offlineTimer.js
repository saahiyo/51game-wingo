// [file name]: offlineTimer.js
export function generateOfflinePeriodData(gameType) {
    const now = new Date();
    const interval = getGameInterval(gameType);

    const nextIntervalTime = now.getTime() + interval - (now.getTime() % interval);
    const endTime = new Date(nextIntervalTime);

    const totalPeriods = calculateTotalPeriods(now, interval);

    return {
        endTime: endTime.toISOString(),
        issueNumber: formatIssueNumber(now, totalPeriods),
        remainingSeconds: Math.ceil((endTime - now) / 1000),
        offline: true
    };
}

function getGameInterval(gameType) {
    const intervals = {
        "Win Go 30s": 30000,
        "Win Go 1Min": 60000,
        "Win Go 3Min": 180000,
        "Win Go 5Min": 300000
    };
    return intervals[gameType] || 30000;
}

function calculateTotalPeriods(date, interval) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    if (interval === 30000) { // 30s
        return hours * 120 + minutes * 2 + Math.floor(seconds / 30);
    }
    // Add calculations for other intervals if needed
    return Math.floor((date.getTime() - new Date(date).setUTCHours(0, 0, 0, 0)) / interval);
}
function formatIssueNumber(date, totalPeriods) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}${month}${day}1000${10001 + totalPeriods}`;
}