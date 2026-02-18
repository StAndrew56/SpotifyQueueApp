import { useState } from "react";
import albumCover from "./assets/album_image.png";
import albumCover2 from "./assets/badbunny_album.png";
import ReactAudioPlayer from "react-audio-player";
import ConfirmModal from "./ConfirmModal";

function App() {
  // Songs list
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Tried Our Best",
      artist: "Drake",
      albumCover,
      audioUrl: "/audio/song1.mp3",
    },
    {
      id: 2,
      title: "BAILE INOLVIDABLE",
      artist: "Bad Bunny",
      albumCover: albumCover2,
      audioUrl: "/audio/song2.mp3",
    },
  ]);
  const [token, setToken] = useState("");

  const [allowExplicit, setAllowExplicit] = useState(true);
  // Current song index
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSong = songs[currentIndex];

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const handleAddToQueue = (track) => {
    setSongs([
      ...songs,
      {
        id: track.id,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        albumCover: track.album.images[0]?.url,
        audioUrl: track.preview_url || "",
      },
    ]);
    setModalOpen(false);
  };

  // Auto-advance logic
  const handleEnded = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop back to first song
    }
  };

  const handleSearch = async () => {
    try {
      // Get Spotify token
      const tokenRes = await fetch("http://localhost:3001/spotify/token");
      const { access_token } = await tokenRes.json();

      // Search tracks with optional explicit filtering
      const res = await fetch(
        `http://localhost:3001/spotify/search?q=${encodeURIComponent(searchTerm)}&explicit=${allowExplicit}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const data = await res.json();
      setSearchResults(data.tracks);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black text-green-500 text-center py-4 text-4xl font-bold">
        Mixify
      </header>

      {/* Main Content: Sidebar + Now Playing + Queue */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-2/12 bg-gray-800 p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white">Search</h2>
          <input
            type="text"
            placeholder="Song"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 border border-gray-500 text-white"
          />
          <button
            onClick={handleSearch}
            className="mt-2 p-2 bg-green-500 rounded-lg text-black font-bold"
          >
            Search
          </button>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] mt-4">
            {searchResults.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                onDoubleClick={() => {
                  setSelectedTrack({
                    id: track.id,
                    title: track.name,
                    artist: track.artists.map((a) => a.name).join(", "),
                    albumCover: track.album.images[0]?.url,
                    audioUrl: track.preview_url || "",
                  });
                  setModalOpen(true);
                }}
              >
                <img
                  className="w-16 rounded-lg"
                  src={track.album.images[0]?.url}
                  alt="Album"
                />
                <div>
                  <h3 className="font-bold text-white">{track.name}</h3>
                  <p className="text-gray-400">
                    {track.explicit && (
                      <span className="bg-gray-300 text-black px-1 mr-1">
                        E
                      </span>
                    )}
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Modal */}
          <ConfirmModal
            open={modalOpen}
            track={selectedTrack}
            onConfirm={() => {
              setSongs([...songs, selectedTrack]);
              setModalOpen(false);
            }}
            onCancel={() => setModalOpen(false)}
          />
        </aside>

        {/* Now Playing + Queue */}
        <main className="flex-1 bg-gray-700 p-8 flex flex-col gap-8">
          {/* Now Playing */}
          <section className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Now Playing</h2>
            <div className="flex items-center gap-4 bg-gray-600 p-6 rounded-xl">
              <img
                className="w-24 rounded-lg"
                src={currentSong?.albumCover}
                alt="Album"
              />
              <div>
                <h3 className="text-xl font-bold">{currentSong?.title}</h3>
                <p className="text-gray-400">{currentSong?.artist}</p>
              </div>
            </div>

            <ReactAudioPlayer
              src={currentSong?.audioUrl}
              autoPlay
              controls
              onEnded={handleEnded}
            />
          </section>

          {/* Queue */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Queue</h2>
            <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className={`flex items-center gap-4 p-4 rounded-lg ${index === currentIndex ? "bg-green-600" : "bg-gray-600"}`}
                >
                  <img
                    className="w-20 rounded-lg"
                    src={song.albumCover}
                    alt="Album"
                  />
                  <div>
                    <h3 className="font-bold">{song.title}</h3>
                    <p className="text-gray-400">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;

