import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Trash2, X } from "lucide-react";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/watchlist`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setWatchlist(data.watchlist || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRemove = async (mediaId, mediaType) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/watchlist/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mediaId, mediaType }),
    });
    if (res.ok) {
      setWatchlist((prev) =>
        prev.filter(
          (item) => !(item.mediaId === mediaId && item.mediaType === mediaType)
        )
      );
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/watchlist/clear`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setWatchlist([]);
    setClearing(false);
    setShowConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818]">
        <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin mb-4" />
        <p className="text-[#888] text-sm">Loading your watchlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] px-4 sm:px-8 py-10">

      {/* Confirm clear modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#232323] border border-[#444] rounded-2xl p-6 sm:p-8 max-w-sm w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Clear Watchlist?</h2>
              <button onClick={() => setShowConfirm(false)}>
                <X className="w-5 h-5 text-[#888] hover:text-white transition" />
              </button>
            </div>
            <p className="text-[#888] text-sm">
              This will permanently remove all titles from your watchlist. This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#444] text-white font-semibold hover:bg-[#333] transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="flex-1 py-2.5 rounded-xl bg-[#e50914] text-white font-semibold hover:bg-red-700 transition text-sm disabled:opacity-60"
              >
                {clearing ? "Clearing..." : "Yes, Clear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-lg">
            My Watchlist
          </h1>
          <p className="text-[#888] text-sm mt-1">
            {watchlist.length} {watchlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* Clear all button — only shows when list has items */}
        {watchlist.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border-2 border-[#444] text-[#888] hover:border-[#e50914] hover:text-[#e50914] transition-all duration-200 text-xs sm:text-sm font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <p className="text-[#555] text-5xl">🎬</p>
          <p className="text-[#888] text-lg font-semibold">Your watchlist is empty</p>
          <p className="text-[#555] text-sm">Save movies and shows to watch them later.</p>
          <Link
            to="/"
            className="mt-4 bg-[#e50914] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition"
          >
            Browse Content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 mt-6">
          {watchlist.map((item) => (
            <WatchlistCard
              key={`${item.mediaType}-${item.mediaId}`}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const WatchlistCard = ({ item, onRemove }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group rounded-2xl overflow-hidden bg-[#181818] border border-[#333] shadow-lg transition-all duration-200 relative
        ${hovered ? "scale-105 shadow-2xl border-[#e50914]/60" : "scale-100"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Remove button — shows on hover */}
      {(hovered || true) && (
  <button
    onClick={() => onRemove(item.mediaId, item.mediaType)}
    className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-[#e50914] text-white rounded-full p-1.5 transition sm:opacity-0 sm:group-hover:opacity-100"
    title="Remove from watchlist"
  >
    <Trash2 className="w-4 h-4" />
  </button>
)}

      <Link to={`/${item.mediaType}/${item.mediaId}`}>
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          {item.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#232323] flex flex-col items-center justify-center gap-2">
              <p className="text-[#444] text-4xl">🎬</p>
              <p className="text-[#555] text-xs text-center px-2">{item.title}</p>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#181818] to-transparent pointer-events-none" />
        </div>
        <div className="px-3 py-2">
          <p className="text-white text-sm font-semibold leading-snug truncate">{item.title}</p>
          <div className="flex items-center justify-between mt-0.5">
            {item.release_date && (
              <p className="text-[#999] text-xs">{new Date(item.release_date).getFullYear()}</p>
            )}
            <span className="text-xs text-[#e50914] font-semibold uppercase">
              {item.mediaType === "tv" ? "TV" : "Movie"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Watchlist;