// NewAndPopular.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { tmdb } from "../lib/tmdb";
import { addToHistory } from "../lib/history";
import { useTranslation } from "react-i18next";

const NewAndPopular = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    tmdb.getNewAndPopular().then(data => { setItems(data.results); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818]">
      <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin mb-4" />
      <p className="text-[#888] text-sm">Loading New & Popular...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] px-8 py-10">
      <h1 className="text-white text-3xl font-extrabold mb-8 tracking-tight drop-shadow-lg">New And Popular</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {items.map(item => <MediaCard key={item.id} item={item} />)}
      </div>
    </div>
  );
};

const MediaCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const type = item.media_type === "tv" || item.name ? "tv" : "movie";

  return (
    <Link to={`/${type}/${item.id}`} onClick={() => addToHistory({ mediaId: String(item.id), mediaType: type, title, poster_path: item.poster_path, release_date: date })}>
      <div className={`rounded-2xl overflow-hidden cursor-pointer bg-[#181818] border border-[#333] shadow-lg transition-all duration-200 ${hovered ? "scale-105 shadow-2xl border-[#e50914]/60" : "scale-100"}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <img src={tmdb.image(item.poster_path)} alt={title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#181818] to-transparent pointer-events-none" />
        </div>
        <div className="px-3 py-2">
          <p className="text-white text-sm font-semibold leading-snug truncate">{title}</p>
          {date && <p className="text-[#999] text-xs mt-0.5">{new Date(date).getFullYear()}</p>}
        </div>
      </div>
    </Link>
  );
};

export default NewAndPopular;