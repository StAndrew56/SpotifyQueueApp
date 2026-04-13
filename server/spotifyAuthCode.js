require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = "http://127.0.0.1:3001/spotify/callback";

// Step 1: Redirect user to Spotify login
router.get("/login", (req, res) => {
  const scopes = "streaming user-read-email user-read-private";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
      }),
  );
});

// Step 2: Spotify redirects back here with a code
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();
  req.session.spotifyToken = data.access_token;
  res.redirect("http://127.0.0.1:3000");
});

router.get("/me", (req, res) => {
  console.log("Session:", req.session);
  const token = req.session.spotifyToken;
  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json({ access_token: token });
});

module.exports = router;
