import { useEffect, useState } from "react";
import { Link } from "react-router";
import { tmdb } from "../lib/tmdb";
import { addToHistory } from "../lib/history";

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdb.getTVShows().then(data => {
      setShows(data.results);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818]">
        <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin mb-4" />
        <p className="text-[#888] text-sm">Loading TV shows...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] px-8 py-10">
      <h1 className="text-white text-3xl font-extrabold mb-8 tracking-tight drop-shadow-lg">
        TV Shows
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {shows.map(show => (
          <TVCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

const TVCard = ({ show }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/tv/${show.id}`}
      onClick={() => addToHistory({
        mediaId: String(show.id),
        mediaType: "tv",
        title: show.name,
        poster_path: show.poster_path,
        release_date: show.first_air_date,
      })}
    >
      <div
        className={`rounded-2xl overflow-hidden cursor-pointer bg-[#181818] border border-[#333] shadow-lg transition-all duration-200 ${
          hovered ? "scale-105 shadow-2xl border-[#e50914]/60" : "scale-100"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <img src={tmdb.image(show.poster_path)} alt={show.name} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#181818] to-transparent pointer-events-none" />
        </div>
        <div className="px-3 py-2">
          <p className="text-white text-sm font-semibold leading-snug truncate">{show.name}</p>
          {show.first_air_date && (
            <p className="text-[#999] text-xs mt-0.5">{new Date(show.first_air_date).getFullYear()}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TVShows;