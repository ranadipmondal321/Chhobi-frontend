import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Play } from "lucide-react";
import { Link } from "react-router";
import { API_URL } from "../lib/api";

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTNhMjZjODk4NDNiNTA0Yjc5ZmUzYTAzODlhMThjMSIsIm5iZiI6MTc3ODMyNzAyNy40OTQwMDAyLCJzdWIiOiI2OWZmMWRmMzFkYWJhMjliZjVhZThkYTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.clAArrB45ttQV4q42hLqFYgkgF1aHAIUb3HjBTTmG3s",
    },
  };

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1", options)
      .then((res) => res.json())
      .then((res) => {
        if (res.results && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          const selected = res.results[randomIndex];
          setMovie(selected);

          fetch(`${API_URL}/watchlist`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
              if (data.watchlist) {
                const exists = data.watchlist.some(
                  (item) => item.mediaId === selected.id && item.mediaType === "movie"
                );
                setSaved(exists);
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    if (!movie || saving) return;
    setSaving(true);
    const endpoint = saved ? "/watchlist/remove" : "/watchlist/add";
    const body = {
      mediaId: movie.id,
      mediaType: "movie",
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    };
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) setSaved(!saved);
      else alert(data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!movie) return (
    <div className="w-full h-[280px] md:h-[480px] bg-[#232323] rounded-2xl animate-pulse" />
  );

  return (
    <div className="text-white relative rounded-2xl overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
        alt="bg-img"
        className="w-full h-[280px] sm:h-[360px] md:h-[480px] object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
        <h2 className="text-white font-bold text-lg md:text-2xl mb-2 drop-shadow-lg line-clamp-1">
          {movie.title}
        </h2>
        <p className="text-gray-300 text-xs md:text-sm mb-3 line-clamp-2 hidden sm:block max-w-xl">
          {movie.overview}
        </p>
        <div className="flex gap-2 md:gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex justify-center items-center py-2 px-3 md:py-3 md:px-4 rounded-full cursor-pointer text-xs md:text-base transition font-medium
              ${saved ? "bg-[#e50914] text-white hover:bg-red-700" : "bg-white hover:bg-gray-200 text-[#e50914]"
              } disabled:opacity-50`}
          >
            {saved ? (
              <><BookmarkCheck className="mr-1 md:mr-2 w-4 h-4" /> Saved</>
            ) : (
              <><Bookmark className="mr-1 md:mr-2 w-4 h-4" /> Save for Later</>
            )}
          </button>
          <Link to={`/movie/${movie.id}`}>
            <button className="flex justify-center items-center bg-[#e50914] text-white py-2 px-3 md:py-3 md:px-4 rounded-full cursor-pointer text-xs md:text-base font-medium">
              <Play className="mr-1 md:mr-2 w-4 h-4" /> Watch Trailer
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
