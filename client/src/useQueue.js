import { useState, useRef, useEffect } from "react";
import API_URL from "./config";

export function useQueue() {
  const [songs, setSongs] = useState([]);
  const songsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSong = songs[currentIndex];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch(`${API_URL}/queue`);
      const data = await res.json();
      setSongs(data);
    };
    fetchSongs();
  }, []);

  const addSongToQueue = async (song) => {
    const res = await fetch(`${API_URL}/queue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(song),
    });
    const savedSong = await res.json();
    setSongs([...songs, savedSong]);
  };

  return {
    currentIndex,
    setCurrentIndex,
    currentSong,
    songs,
    songsRef,
    setSongs,
    setModalOpen,
    modalOpen,
    selectedTrack,
    setSelectedTrack,
    addSongToQueue,
  };
}
