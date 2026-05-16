const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const tmdb = {
  // Home
  getTrending: () => fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`).then(r => r.json()),

  // Movies
  getMovies: (page = 1) => fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`).then(r => r.json()),

  // TV Shows
  getTVShows: (page = 1) => fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&page=${page}`).then(r => r.json()),

  // Anime (anime is a genre tag in TMDB)
  getAnime: (page = 1) => fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_keywords=210024&page=${page}`).then(r => r.json()),

  // New & Popular
  getNewAndPopular: () => fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`).then(r => r.json()),

  // Upcoming movies
  getUpcoming: () => fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`).then(r => r.json()),

  // Search
  search: (query, page = 1) => fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`).then(r => r.json()),

  // Games (TMDB doesn't have games, use this workaround)
  getGames: (page = 1) => fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_keywords=818&page=${page}`).then(r => r.json()),

  // Image URL helper
  image: (path, size = "w500") => path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.jpg",
};