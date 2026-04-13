const express = require("express");
const router = express.Router();
const Song = require("./Song");

// GET all songs
router.get("/queue", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

// POST a new song
router.post("/queue", async (req, res) => {
  const song = new Song(req.body);
  await song.save();
  res.status(201).json(song);
});

router.delete("/queue/:id", async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Song deleted" });
});

module.exports = router;
