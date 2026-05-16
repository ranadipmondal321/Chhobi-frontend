import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Play, Bookmark, BookmarkCheck, X } from "lucide-react";
import { API_URL } from "../lib/api";

const Moviepage = () => {
  const params = useParams();
  const id = params.id || params.movieId || Object.values(params)[0];

  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTNhMjZjODk4NDNiNTA0Yjc5ZmUzYTAzODlhMThjMSIsIm5iZiI6MTc3ODMyNzAyNy40OTQwMDAyLCJzdWIiOiI2OWZmMWRmMzFkYWJhMjliZjVhZThkYTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.clAArrB45ttQV4q42hLqFYgkgF1aHAIUb3HjBTTmG3s",
    },
  };

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    const p1 = fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((res) => res.json())
      .then((res) => { if (!isCancelled) setMovie(res); });

    const p2 = fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`, options)
      .then((res) => res.json())
      .then((res) => { if (!isCancelled) setRecommendations(res.results || []); });

    const p3 = fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then((res) => res.json())
      .then((res) => {
        const trailer = res.results?.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        if (!isCancelled) setTrailerKey(trailer?.key || null);
      });

    const p4 = fetch(`${API_URL}/watchlist`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled) {
          const isSaved = data.watchlist?.some(
            (item) => String(item.mediaId) === String(id) && item.mediaType === "movie"
          );
          setSaved(isSaved);
        }
      })
      .catch(() => {});

    Promise.all([p1, p2, p3, p4])
      .catch((err) => console.error(err))
      .finally(() => { if (!isCancelled) setLoading(false); });

    return () => { isCancelled = true; };
  }, [id]);

  const handleWatchNow = () => {
    if (!trailerKey) return;
    setShowTrailer(true);
    fetch(`${API_URL}/history/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        mediaId: String(movie.id),
        mediaType: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      }),
    }).catch((err) => console.error("History save failed:", err));
  };

  const handleSaveToggle = async () => {
    if (!movie) return;
    setSaveLoading(true);
    const endpoint = saved ? "/watchlist/remove" : "/watchlist/add";
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mediaId: String(movie.id),
          mediaType: "movie",
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        }),
      });
      if (res.ok) setSaved((prev) => !prev);
    } catch (err) {
      console.error("Watchlist update failed:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading && !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818]">
        <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin mb-4" />
        <p className="text-[#888] text-sm">Loading movie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-4 right-4 z-[60] bg-black/70 hover:bg-[#e50914] text-white rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-4xl mx-4 aspect-video sm:rounded-2xl overflow-hidden shadow-2xl">
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

      <div
        className="relative h-[60vh] flex items-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
        <div className="relative z-10 flex items-end p-8 gap-8">
          <img
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            className="rounded-lg shadow-lg w-48 hidden md:block"
            alt={movie.title}
          />
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.release_date}</span>
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="max-w-2xl text-gray-200">{movie.overview}</p>
            <div className="flex gap-2 md:gap-4 mt-2 md:mt-4">
              <button
                onClick={handleSaveToggle}
                disabled={saveLoading}
                className={`flex justify-center items-center py-2 px-3 md:py-3 md:px-4 rounded-full cursor-pointer text-xs md:text-base transition font-medium ${saved ? "bg-[#e50914] text-white hover:bg-red-700" : "bg-white hover:bg-gray-200 text-[#e50914]"} disabled:opacity-50`}
              >
                {saved ? (
                  <><BookmarkCheck className="mr-1 md:mr-2 w-4 h-4" /> Saved</>
                ) : (
                  <><Bookmark className="mr-1 md:mr-2 w-4 h-4" /> Save for Later</>
                )}
              </button>
              <button
                onClick={handleWatchNow}
                disabled={!trailerKey}
                className="flex justify-center items-center bg-[#e50914] text-white py-2 px-3 md:py-3 md:px-4 rounded-full cursor-pointer text-xs md:text-base font-medium disabled:opacity-50"
              >
                <Play className="mr-1 md:mr-2 w-4 h-4" /> Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <div className="bg-[#232323] rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <ul className="text-gray-300 space-y-3">
              <li><span className="font-semibold text-white">Status: </span><span className="ml-2">{movie.status}</span></li>
              <li><span className="font-semibold text-white">Release Date: </span><span className="ml-2">{movie.release_date}</span></li>
              <li><span className="font-semibold text-white">Original Language: </span><span className="ml-2">{movie.original_language?.toUpperCase()}</span></li>
              <li><span className="font-semibold text-white">Budget: </span><span className="ml-2">{movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}</span></li>
              <li><span className="font-semibold text-white">Revenue: </span><span className="ml-2">{movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}</span></li>
              <li><span className="font-semibold text-white">Production Companies: </span><span className="ml-2">{movie.production_companies?.length > 0 ? movie.production_companies.map((c) => c.name).join(", ") : "N/A"}</span></li>
              <li><span className="font-semibold text-white">Countries: </span><span className="ml-2">{movie.production_countries?.length > 0 ? movie.production_countries.map((c) => c.name).join(", ") : "N/A"}</span></li>
              <li><span className="font-semibold text-white">Spoken Languages: </span><span className="ml-2">{movie.spoken_languages?.length > 0 ? movie.spoken_languages.map((lang) => lang.english_name).join(", ") : "N/A"}</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Tagline</h3>
            <p className="italic text-gray-400 mb-6">{movie.tagline || "No tagline available."}</p>
            <h3 className="font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-200">{movie.overview}</p>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="p-4 sm:p-8">
          <h2 className="text-2xl font-semibold mb-4">You might also like...</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => (
              <div key={rec.id} className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition">
                <Link to={`/movie/${rec.id}`}>
                  <img src={`https://image.tmdb.org/t/p/w300/${rec.poster_path}`} className="w-full h-48 object-cover" alt={rec.title} />
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{rec.title}</h3>
                    <span className="text-xs text-gray-400">{rec.release_date?.slice(0, 4)}</span>
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

export default Moviepage;
