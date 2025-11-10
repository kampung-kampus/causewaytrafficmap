// netlify/functions/traffic.js
import fetch from "node-fetch";

/**
 * Netlify Function: Fetches real-time traffic data from LTA DataMall.
 * Falls back to mock data if the API is unreachable (for local testing).
 */
export async function handler(event, context) {
  try {
    const apiKey = process.env.LTA_ACCOUNT_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Missing LTA_ACCOUNT_KEY in environment variables" }),
      };
    }

    // Fetch from LTA DataMall API
    const response = await fetch(
      "https://datamall2.mytransport.sg/ltaodataservice/TrafficSpeedBands",
      {
        headers: {
          AccountKey: apiKey,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`LTA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching traffic data:", error.message);

    // Provide a mock response for local/offline testing
    const mockData = {
      value: [
        {
          LinkID: "MOCK1",
          RoadName: "Woodlands Causeway",
          StartLat: 1.445,
          StartLon: 103.768,
          EndLat: 1.446,
          EndLon: 103.769,
          SpeedBand: 3,
          MinimumSpeed: 21,
          MaximumSpeed: 30,
        },
        {
          LinkID: "MOCK2",
          RoadName: "Woodlands Checkpoint Exit",
          StartLat: 1.444,
          StartLon: 103.767,
          EndLat: 1.445,
          EndLon: 103.768,
          SpeedBand: 5,
          MinimumSpeed: 41,
          MaximumSpeed: 50,
        },
      ],
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(mockData),
    };
  }
}
