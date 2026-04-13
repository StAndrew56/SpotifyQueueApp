import { useRef, useState, useEffect } from "react";
import API_URL from "./config";

export function useSpotifyPlayer(songsRef, setCurrentIndex, setSongs) {
  const [token, setToken] = useState("");
  const deviceIdRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(`${API_URL}/spotify/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const initPlayer = (tok) => {
      const player = new window.Spotify.Player({
        name: "Mixify Player",
        getOAuthToken: (cb) => cb(tok),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        deviceIdRef.current = device_id;
        if (songsRef.current.length > 0) {
          playSong(songsRef.current[0]?.uri);
        }
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      const removeFirstSong = async () => {
        const firstSong = songsRef.current[0];
        if (!firstSong) return;

        await fetch(`${API_URL}/queue/${firstSong._id}`, {
          method: "DELETE",
        });
      };

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        if (
          state.position === 0 &&
          state.paused &&
          state.track_window.previous_tracks.length > 0
        ) {
          console.log("Song ended, next song:", songsRef.current[1]);
          removeFirstSong();
          setSongs(songsRef.current.slice(1));
          playSong(songsRef.current[1]?.uri);
        }
      });

      player.connect();
    };

    // Poll every 100ms until Spotify SDK is available
    const interval = setInterval(() => {
      if (window.Spotify && window.Spotify.Player) {
        clearInterval(interval);
        initPlayer(token);
      }
    }, 100);

    // Cleanup if component unmounts
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const playSong = async (spotifyUri) => {
    const id = deviceIdRef.current;
    if (!id) return;

    const res = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [spotifyUri] }),
      },
    );

    if (res.status === 204) {
      console.log("Playing!");
    } else {
      const data = await res.json();
      console.log("Error:", data);
    }
  };

  return {
    playSong,
  };
}
