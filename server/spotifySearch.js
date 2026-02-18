const express = require("express");
const fetch = require("node-fetch"); // or built-in fetch in Node 18+
const router = express.Router();

router.get("/search", async (req, res) => {
  const { q, explicit } = req.query; // explicit = 'true' or 'false'
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });
  if (!q) return res.status(400).json({ error: "Missing search query" });

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(q)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();

    let tracks = data.tracks.items;
    if (explicit === "false") {
      tracks = tracks.filter((track) => !track.explicit);
    }

    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
