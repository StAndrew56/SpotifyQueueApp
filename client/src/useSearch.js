import { useState } from "react";

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allowExplicit, setAllowExplicit] = useState(true);

  //Search Button Clicked Function
  const handleSearch = async () => {
    try {
      // Get Spotify token
      const tokenRes = await fetch("http://localhost:3001/spotify/token");
      const { access_token } = await tokenRes.json();

      // Search explicit tracks
      const res = await fetch(
        `http://localhost:3001/spotify/search?q=${encodeURIComponent(searchTerm)}&explicit=${allowExplicit}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const data = await res.json();
      setSearchResults(data.tracks || []);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    handleSearch,
    allowExplicit,
    setAllowExplicit,
  };
}
