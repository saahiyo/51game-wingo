// Function to fetch game issue details from API
export async function getGameIssue(params) {
    const url = "https://api.dmgameapi.com/api/webapi/GetGameIssue";
  
    const headers = {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "content-type": "application/json;charset=UTF-8",
    };
  
    const body = JSON.stringify({
      ...params,
      language: 0,
    });
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
        mode: "cors",
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
  
      // Return the JSON response if successful
      return await response.json();
    } catch (error) {
      console.error("Error fetching game issue:", error);
      return null;
    }
  }
  