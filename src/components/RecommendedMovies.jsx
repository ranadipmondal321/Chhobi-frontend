import { useEffect, useState } from "react";
import { Link } from "react-router";

const RecommendedMovies = ({ movieTitles, onReset }) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
  };

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async (title) => {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`;
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.log("Error fetching movie: ", error);
      return null;
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const results = await Promise.all(
        movieTitles.map((title) => fetchMovie(title))
      );
      setMovies(results.filter(Boolean));
      setLoading(false);
    };
    if (movieTitles?.length) loadMovies();
  }, [movieTitles]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818]">
        <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin mb-4" />
        <p className="text-[#888] text-sm">Fetching your recommendations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
            AI Recommended Movies
          </h1>
          <p className="text-[#888] text-sm mt-1">
            {movies.length} movies picked just for you
          </p>
        </div>
        {/* Try Again button */}
        <button
          onClick={onReset}
          className="bg-[#e50914] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

const MovieCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/movie/${movie.id}`}>
      <div
        className={`rounded-2xl overflow-hidden cursor-pointer bg-[#181818] border border-[#333] shadow-lg transition-all duration-200
          ${hovered ? "scale-105 shadow-2xl border-[#e50914]/60" : "scale-100"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#232323] flex flex-col items-center justify-center gap-2">
              <p className="text-[#444] text-4xl">🎬</p>
              <p className="text-[#555] text-xs text-center px-2">{movie.title}</p>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#181818] to-transparent pointer-events-none" />
        </div>
        <div className="px-3 py-2">
          <p className="text-white text-sm font-semibold leading-snug truncate">
            {movie.title}
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-[#999] text-xs">
              {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
            </p>
            <span className="text-xs text-[#e50914] font-semibold">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedMovies;