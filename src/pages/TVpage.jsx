import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  Play,
  Bookmark,
  BookmarkCheck,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const BEARER =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTNhMjZjODk4NDNiNTA0Yjc5ZmUzYTAzODlhMThjMSIsIm5iZiI6MTc3ODMyNzAyNy40OTQwMDAyLCJzdWIiOiI2OWZmMWRmMzFkYWJhMjliZjVhZThkYTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.clAArrB45ttQV4q42hLqFYgkgF1aHAIUb3HjBTTmG3s";

const options = {
  method: "GET",
  headers: { accept: "application/json", Authorization: BEARER },
};

// ── Season Switcher Component ─────────────────────────────────────────────────
const SeasonSwitcher = ({ showId, seasons }) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [expandedEp, setExpandedEp] = useState(null);
  const [seasonTrailerKey, setSeasonTrailerKey] = useState(null);
  const [showSeasonTrailer, setShowSeasonTrailer] = useState(false);

  // Filter out "Specials" (season 0) unless it's the only season
  const filteredSeasons = seasons?.filter((s) => s.season_number > 0) || [];

  useEffect(() => {
    if (!showId || !selectedSeason) return;
    setLoadingEpisodes(true);
    setEpisodes([]);
    setSeasonTrailerKey(null);

    // Fetch episodes and season videos in parallel
    const p1 = fetch(
      `https://api.themoviedb.org/3/tv/${showId}/season/${selectedSeason}?language=en-US`,
      options,
    )
      .then((res) => res.json())
      .then((data) => setEpisodes(data.episodes || []));

    const p2 = fetch(
      `https://api.themoviedb.org/3/tv/${showId}/season/${selectedSeason}/videos?language=en-US`,
      options,
    )
      .then((res) => res.json())
      .then((data) => {
        const trailer =
          data.results?.find(
            (v) => v.site === "YouTube" && v.type === "Trailer",
          ) ||
          data.results?.find(
            (v) => v.site === "YouTube", // fallback to any YouTube video
          );
        setSeasonTrailerKey(trailer?.key || null);
      });

    Promise.all([p1, p2])
      .catch(() => {})
      .finally(() => setLoadingEpisodes(false));
  }, [showId, selectedSeason]);

  if (!filteredSeasons.length) return null;

  return (
    <div className="px-4 sm:px-8 pb-10 overflow-x-hidden">
      <h2 className="text-2xl font-semibold mb-5">Episodes</h2>

      {/* Season pill buttons */}
      <div className="flex flex-wrap gap-2 mb-6 max-w-full overflow-x-auto pb-1">
        {filteredSeasons.map((season) => (
          <button
            key={season.season_number}
            onClick={() => {
              setSelectedSeason(season.season_number);
              setExpandedEp(null);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-200
              ${
                selectedSeason === season.season_number
                  ? "bg-[#e50914] border-[#e50914] text-white"
                  : "bg-[#232323] border-[#444] text-gray-300 hover:border-[#e50914] hover:text-white"
              }`}
          >
            Season {season.season_number}
          </button>
        ))}
      </div>

      {/* Season info bar */}
      {filteredSeasons.find((s) => s.season_number === selectedSeason) && (
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[#e50914] text-sm font-bold uppercase tracking-widest">
            Season {selectedSeason}
          </span>
          <div className="flex-1 h-px bg-[#333]" />
          <span className="text-[#555] text-xs mr-2">
            {
              filteredSeasons.find((s) => s.season_number === selectedSeason)
                ?.episode_count
            }{" "}
            episodes
          </span>
          {/* Season trailer button */}
          {seasonTrailerKey && (
            <button
              onClick={() => setShowSeasonTrailer(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e50914] text-white text-xs font-semibold hover:bg-red-700 transition"
            >
              <Play className="w-3 h-3" /> Season Trailer
            </button>
          )}
        </div>
      )}

      {/* Season trailer modal */}
      {showSeasonTrailer && seasonTrailerKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm"
          onClick={() => setShowSeasonTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4 sm:mx-4 aspect-video sm:rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSeasonTrailer(false)}
              className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-[#e50914] text-white rounded-full p-1.5 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${seasonTrailerKey}?autoplay=1`}
              title="Season Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Episodes */}
      {loadingEpisodes ? (
        <div className="flex items-center gap-3 py-8">
          <div className="w-6 h-6 rounded-full border-2 border-[#333] border-t-[#e50914] animate-spin" />
          <p className="text-[#888] text-sm">Loading episodes...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="bg-[#232323] border border-[#333] rounded-2xl overflow-hidden hover:border-[#e50914]/40 transition-all duration-200"
            >
              {/* Episode row */}
              <div
                className="flex gap-3 p-3 cursor-pointer min-w-0"
                onClick={() =>
                  setExpandedEp(expandedEp === ep.id ? null : ep.id)
                }
              >
                {/* Thumbnail */}
                <div className="shrink-0 w-28 sm:w-40 h-20 sm:h-28 rounded-xl overflow-hidden bg-[#181818]">
                  {ep.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300/${ep.still_path}`}
                      alt={ep.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#444] text-3xl">
                      🎬
                    </div>
                  )}
                </div>

                {/* Episode info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[#888] text-xs mb-0.5">
                        E{String(ep.episode_number).padStart(2, "0")}
                        {ep.runtime ? ` · ${ep.runtime} min` : ""}
                      </p>
                      <h3 className="text-white text-sm sm:text-base font-semibold leading-snug truncate">
                        {ep.name}
                      </h3>
                      {ep.air_date && (
                        <p className="text-[#666] text-xs mt-0.5">
                          {ep.air_date}
                        </p>
                      )}
                    </div>

                    {/* Rating + expand toggle */}
                    <div className="flex flex-col items-end shrink-0 gap-1">
                      {ep.vote_average > 0 && (
                        <span className="text-xs text-[#e50914] font-bold">
                          ⭐ {ep.vote_average.toFixed(1)}
                        </span>
                      )}
                      {ep.overview &&
                        (expandedEp === ep.id ? (
                          <ChevronUp className="w-4 h-4 text-[#888]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#888]" />
                        ))}
                    </div>
                  </div>

                  {/* Overview preview on desktop */}
                  {ep.overview && expandedEp !== ep.id && (
                    <p className="text-[#888] text-xs mt-2 line-clamp-2 hidden sm:block">
                      {ep.overview}
                    </p>
                  )}
                </div>
              </div>

              {/* Expanded overview */}
              {expandedEp === ep.id && ep.overview && (
                <div className="px-4 pb-4 border-t border-[#333] pt-3">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {ep.overview}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const TVpage = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    const p1 = fetch(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled) setShow(res);
      });

    const p2 = fetch(
      `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled) setRecommendations(res.results || []);
      });

    const p3 = fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        const trailer = res.results?.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer",
        );
        if (!isCancelled) setTrailerKey(trailer?.key || null);
      });

    const p4 = fetch(`${import.meta.env.VITE_API_URL}/api/watchlist`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled) {
          const isSaved = data.watchlist?.some(
            (item) =>
              String(item.mediaId) === String(id) && item.mediaType === "tv",
          );
          setSaved(isSaved);
        }
      })
      .catch(() => {});

    Promise.all([p1, p2, p3, p4]).catch((err) => console.error(err));
    return () => {
      isCancelled = true;
    };
  }, [id]);

  const handleSave = async () => {
    if (!show || saving) return;
    setSaving(true);
    const endpoint = saved ? "/api/watchlist/remove" : "/api/watchlist/add";
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mediaId: String(show.id),
          mediaType: "tv",
          title: show.name,
          poster_path: show.poster_path,
          release_date: show.first_air_date,
        }),
      });
      if (res.ok) setSaved((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleWatchTrailer = () => {
    if (!trailerKey) return;
    setShowTrailer(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/history/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        mediaId: String(show.id),
        mediaType: "tv",
        title: show.name,
        poster_path: show.poster_path,
        release_date: show.first_air_date,
      }),
    }).catch((err) => console.error("History save failed:", err));
  };

  if (!show) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818]">
        <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin mb-4" />
        <p className="text-[#888] text-sm">Loading show...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white overflow-x-hidden">
      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
          {/* Close button outside iframe so it doesn't block touch */}
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-4 right-4 z-[60] bg-black/70 hover:bg-[#e50914] text-white rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-4xl mx-4 sm:mx-4 aspect-video sm:rounded-2xl overflow-hidden shadow-2xl">
            {/* <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-[#e50914] text-white rounded-full p-1.5 transition"
            >
              <X className="w-5 h-5" />
            </button> */}
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&playsinline=1`}
              title="Trailer"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full"
              style={{ pointerEvents: "auto", touchAction: "auto" }}
            />
          </div>
        </div>
      )}

      {/* Hero backdrop */}
      <div
        className="relative h-[60vh] flex items-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${show.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
        <div className="relative z-10 flex items-end p-8 gap-8">
          <img
            src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
            className="rounded-lg shadow-lg w-48 hidden md:block"
            alt={show.name}
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{show.name}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span>⭐ {show.vote_average?.toFixed(1)}</span>
              <span>{show.first_air_date}</span>
              {show.episode_run_time?.length > 0 && (
                <span>{show.episode_run_time[0]} min/ep</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {show.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="max-w-2xl text-gray-200">{show.overview}</p>
            <div className="flex gap-2 md:gap-4 mt-2 md:mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex justify-center items-center py-2 px-3 md:py-3 md:px-4 rounded-full cursor-pointer text-xs md:text-base transition font-medium
                  ${
                    saved
                      ? "bg-[#e50914] text-white hover:bg-red-700"
                      : "bg-white hover:bg-gray-200 text-[#e50914]"
                  } disabled:opacity-50`}
              >
                {saved ? (
                  <>
                    <BookmarkCheck className="mr-1 md:mr-2 w-4 h-4" /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-1 md:mr-2 w-4 h-4" /> Save for Later
                  </>
                )}
              </button>
              <button
                onClick={handleWatchTrailer}
                disabled={!trailerKey}
                className="flex justify-center items-center bg-[#e50914] text-white py-2 px-3 md:py-3 md:px-4 rounded-full cursor-pointer text-xs md:text-base font-medium disabled:opacity-50"
              >
                <Play className="mr-1 md:mr-2 w-4 h-4" /> Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <div className="bg-[#232323] rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <ul className="text-gray-300 space-y-3">
              <li>
                <span className="font-semibold text-white">Status: </span>
                <span className="ml-2">{show.status}</span>
              </li>
              <li>
                <span className="font-semibold text-white">
                  First Air Date:{" "}
                </span>
                <span className="ml-2">{show.first_air_date}</span>
              </li>
              <li>
                <span className="font-semibold text-white">Seasons: </span>
                <span className="ml-2">{show.number_of_seasons ?? "N/A"}</span>
              </li>
              <li>
                <span className="font-semibold text-white">Episodes: </span>
                <span className="ml-2">{show.number_of_episodes ?? "N/A"}</span>
              </li>
              <li>
                <span className="font-semibold text-white">
                  Original Language:{" "}
                </span>
                <span className="ml-2">
                  {show.original_language?.toUpperCase()}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Networks: </span>
                <span className="ml-2">
                  {show.networks?.length > 0
                    ? show.networks.map((n) => n.name).join(", ")
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">
                  Production Companies:{" "}
                </span>
                <span className="ml-2">
                  {show.production_companies?.length > 0
                    ? show.production_companies.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">Countries: </span>
                <span className="ml-2">
                  {show.production_countries?.length > 0
                    ? show.production_countries.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>
              <li>
                <span className="font-semibold text-white">
                  Spoken Languages:{" "}
                </span>
                <span className="ml-2">
                  {show.spoken_languages?.length > 0
                    ? show.spoken_languages
                        .map((lang) => lang.english_name)
                        .join(", ")
                    : "N/A"}
                </span>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Tagline</h3>
            <p className="italic text-gray-400 mb-6">
              {show.tagline || "No tagline available."}
            </p>
            <h3 className="font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-200">{show.overview}</p>
          </div>
        </div>
      </div>

      {/* ── Season Switcher ── */}
      <SeasonSwitcher showId={id} seasons={show.seasons} />

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            You might also like...
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => (
              <div
                key={rec.id}
                className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition"
              >
                <Link to={`/tv/${rec.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300/${rec.poster_path}`}
                    className="w-full h-48 object-cover"
                    alt={rec.name}
                  />
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{rec.name}</h3>
                    <span className="text-xs text-gray-400">
                      {rec.first_air_date?.slice(0, 4)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TVpage;
