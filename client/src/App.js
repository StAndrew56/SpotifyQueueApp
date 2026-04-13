import { useSearch } from "./useSearch";
import { useQueue } from "./useQueue";
import { useSpotifyPlayer } from "./useSpotifyPlayer";
import ConfirmModal from "./ConfirmModal";

function App() {
  const { searchTerm, setSearchTerm, searchResults, handleSearch } =
    useSearch();

  const {
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
  } = useQueue();

  const { playSong, token } = useSpotifyPlayer(
    songsRef,
    setCurrentIndex,
    setSongs,
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <a
          href="https://spotifyqueueapp.onrender.com/spotify/login"
          className="bg-green-500 text-black font-bold py-4 px-8 rounded-full text-xl"
        >
          Login with Spotify
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-green-500 drop-shadow-lg text-center py-4 text-4xl font-bold">
        Mixify
      </header>

      {/* Main Content: Sidebar + Now Playing + Queue */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-3/12 bg-gray-800 p-4 flex flex-col gap-4">
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
                    uri: track.uri,
                    explicit: track.explicit,
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
              addSongToQueue(selectedTrack);
              if (songs.length === 0) {
                playSong(selectedTrack.uri);
              }
              setModalOpen(false);
              setSelectedTrack(null);
            }}
            onCancel={() => setModalOpen(false)}
          />
        </aside>

        {/* Now Playing + Queue */}
        <main className="flex-1 bg-gray-700 p-8 flex flex-col gap-8">
          {/* Now Playing */}
          <h2 className="text-3xl font-bold">Now Playing</h2>
          {currentSong ? (
            <div className="flex items-center gap-4 bg-gray-600 p-6 rounded-xl">
              <img
                className="w-24 rounded-lg"
                src={currentSong.albumCover}
                alt="Album"
              />
              <div>
                <h3 className="text-xl font-bold">{currentSong.title}</h3>
                <p className="text-gray-400">{currentSong.artist}</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-600 p-6 rounded-xl text-gray-400">
              No songs playing right now 😔
            </div>
          )}

          {/* Queue */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Queue</h2>
            <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
              {songs
                .filter((_, index) => index !== currentIndex)
                .map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-600"
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
