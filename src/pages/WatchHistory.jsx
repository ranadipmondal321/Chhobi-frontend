import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Trash2, Clock, X } from "lucide-react";
import { API_URL } from "../lib/api";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/history`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.watchHistory || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRemove = async (mediaId, mediaType) => {
    const res = await fetch(`${API_URL}/history/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mediaId, mediaType }),
    });
    if (res.ok) {
      setHistory((prev) =>
        prev.filter((item) => !(item.mediaId === mediaId && item.mediaType === mediaType))
      );
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    const res = await fetch(`${API_URL}/history/clear`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setHistory([]);
    setClearing(false);
    setShowConfirm(false);
  };

  const groupByDate = (items) => {
    const groups = {};
    const now = new Date();
    const today = new Date(now);
    const yesterday = new Date(now);
    yesterday.setDate(today.getDate() - 1);

    items.forEach((item) => {
      const date = new Date(item.watchedAt);
      let label;
      if (date.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      } else {
        label = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      }
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818]">
        <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin mb-4" />
        <p className="text-[#888] text-sm">Loading your watch history...</p>
      </div>
    );
  }

  const grouped = groupByDate(history);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] px-4 sm:px-6 md:px-8 py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-3">
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-lg flex items-center gap-3">
            <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-[#e50914]" />
            Watch History
          </h1>
          <p className="text-[#888] text-sm mt-1">
            {history.length} {history.length === 1 ? "title" : "titles"} watched
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border-2 border-[#444] text-[#888] hover:border-[#e50914] hover:text-[#e50914] transition-all duration-200 text-xs sm:text-sm font-semibold self-start"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#232323] border border-[#444] rounded-2xl p-6 sm:p-8 max-w-sm w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Clear History?</h2>
              <button onClick={() => setShowConfirm(false)}>
                <X className="w-5 h-5 text-[#888] hover:text-white" />
              </button>
            </div>
            <p className="text-[#888] text-sm">
              This will permanently remove all titles from your watch history. This action cannot be undone.
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

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <p className="text-[#555] text-5xl">🕐</p>
          <p className="text-[#888] text-lg font-semibold">No watch history yet</p>
          <p className="text-[#555] text-sm">Movies and shows you watch will appear here.</p>
          <Link to="/" className="mt-4 bg-[#e50914] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition">
            Browse Content
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10 mt-8">
          {Object.entries(grouped).map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#e50914] text-sm font-bold uppercase tracking-widest">{dateLabel}</span>
                <div className="flex-1 h-px bg-[#333]" />
                <span className="text-[#555] text-xs">{items.length} {items.length === 1 ? "title" : "titles"}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {items.map((item) => (
                  <HistoryCard key={`${item.mediaType}-${item.mediaId}`} item={item} onRemove={handleRemove} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HistoryCard = ({ item, onRemove }) => {
  const [hovered, setHovered] = useState(false);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return null;
  };

  const ago = timeAgo(item.watchedAt);

  return (
    <div
      className={`group rounded-2xl overflow-hidden bg-[#181818] border border-[#333] shadow-lg transition-all duration-200 relative ${hovered ? "scale-105 shadow-2xl border-[#e50914]/60" : "scale-100"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => onRemove(item.mediaId, item.mediaType)}
        className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-[#e50914] text-white rounded-full p-1.5 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        title="Remove from history"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {ago && (
        <div className="absolute top-2 left-2 z-10 bg-black/70 text-[#999] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {ago}
        </div>
      )}

      <Link to={`/${item.mediaType}/${item.mediaId}`}>
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          {item.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
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
            {item.release_date && <p className="text-[#999] text-xs">{new Date(item.release_date).getFullYear()}</p>}
            <span className="text-xs text-[#e50914] font-semibold uppercase">{item.mediaType === "tv" ? "TV" : "Movie"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default WatchHistory;
