import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import https from "https";

const app = express();
app.use(cors());

// Allow HTTPS requests even if certificate is invalid
const agent = new https.Agent({ rejectUnauthorized: false });
const PORT = process.env.PORT || 5000;

app.get("/api/train/:query", async (req, res) => {
  const { query } = req.params;
  const url = `https://railradar.in/api/v1/search/trains?q=${query}`;
  console.log("Fetching:", url);

  try {
    const response = await fetch(url, {
      agent,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://railradar.in/",
      },
    });

    console.log("Status:", response.status, response.statusText);
    const text = await response.text();
    console.log("Raw response (first 200 chars):", text.slice(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      return res.status(500).json({ error: "Invalid JSON from RailRadar" });
    }

    res.json(data);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch train data" });
  }
});

app.get("/api/v1/trains/all-kvs", async (req, res) => {
  const { query } = req.params;
  const url = `https://railradar.in/api/v1/trains/all-kvs`;
  console.log("Fetching:", url);

  try {
    const response = await fetch(url, {
      agent,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://railradar.in/",
      },
    });

    console.log("Status:", response.status, response.statusText);
    const text = await response.text();
    console.log("Raw response (first 200 chars):", text.slice(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      return res.status(500).json({ error: "Invalid JSON from RailRadar" });
    }

    res.json(data);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch train data" });
  }
});

app.get("/api/train/list/:query", async (req, res) => {
 const { query } = req.params;
  const url = `https://railradar.in/api/v1/trains/list?page=1&limit=50&type=&zone=&search=${query}`;
  console.log("Fetching:", url);

  try {
    const response = await fetch(url, {
      agent,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://railradar.in/",
      },
    });

    console.log("Status:", response.status, response.statusText);

    const text = await response.text();
    console.log("Raw response (first 200 chars):", text.slice(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      return res.status(500).json({ error: "Invalid JSON from RailRadar" });
    }

    res.json(data);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch train data" });
  }
});


app.get("/api/train/live/:trainNumber", async (req, res) => {
  const { trainNumber } = req.params;
  const { date } = req.query;   // <-- GET date properly

  const journeyDate = date || ""; // fallback to blank or today

  const url = `https://railradar.in/api/v1/trains/${trainNumber}?journeyDate=${journeyDate}&dataType=full&provider=railradar&userId=`;

  console.log("Fetching:", url);

  try {
    const response = await fetch(url, {
      agent,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://railradar.in/",
      },
    });

    const text = await response.text();
    res.json(JSON.parse(text));

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch train data" });
  }
});


app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
