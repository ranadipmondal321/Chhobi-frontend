import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const TMDB_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTNhMjZjODk4NDNiNTA0Yjc5ZmUzYTAzODlhMThjMSIsIm5iZiI6MTc3ODMyNzAyNy40OTQwMDAyLCJzdWIiOiI2OWZmMWRmMzFkYWJhMjliZjVhZThkYTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.clAArrB45ttQV4q42hLqFYgkgF1aHAIUb3HjBTTmG3s";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: TMDB_TOKEN,
  },
};

const PickedForYou = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState([]);
  const swiperRef = useRef(null);

  const fetchFallback = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setData(res.results || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (user) {
      // Logged-in user: fetch watch history and get recommendations
      // based on the most recently watched movie's genre
      fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(async ({ watchHistory }) => {
          if (!watchHistory || watchHistory.length === 0) {
            // User has history array but it's empty — fall back to popular
            return fetchFallback();
          }

          // Pick the most recently watched movie from history
          const recent = watchHistory[0];

          // Fetch recommendations based on that movie
          const res = await fetch(
            `https://api.themoviedb.org/3/${recent.mediaType}/${recent.mediaId}/recommendations?language=en-US&page=1`,
            options
          );
          const json = await res.json();
          const results = json.results || [];

          if (results.length < 5) {
            // Not enough recs — fall back to popular
            return fetchFallback();
          }

          setData(results);
        })
        .catch(() => fetchFallback());
    } else {
      // Guest user — show popular movies
      fetchFallback();
    }
  }, [user]);

  

  if (data.length === 0) return null;

  return (
    <div className="text-white px-0 md:px-4">
      <h2 className="pt-6 md:pt-10 pb-3 md:pb-5 text-base md:text-lg font-semibold flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#e50914]" />
        Picked For You
        {user && (
          <span className="text-xs text-[#888] font-normal ml-1">
            based on your watch history
          </span>
        )}
      </h2>

      <div className="relative group">
        {/* Prev Arrow */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
            bg-black/60 hover:bg-[#e50914] text-white
            rounded-full p-2 -translate-x-2
            opacity-0 group-hover:opacity-100
            transition-all duration-200 shadow-lg items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <Swiper
          slidesPerView={"auto"}
          spaceBetween={8}
          className="mySwiper"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {data.map((item) => (
            <SwiperSlide
              key={item.id}
              className="!w-40 sm:!w-52 md:!w-64 lg:!w-72"
            >
              <Link to={`/${item.title ? "movie" : "tv"}/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                  alt={item.title || item.name}
                  className="h-24 sm:h-32 md:h-40 lg:h-44 w-full object-center object-cover rounded-lg"
                />
                <p className="text-center pt-2 text-xs md:text-sm truncate px-1">
                  {item.title || item.name}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Next Arrow */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
            bg-black/60 hover:bg-[#e50914] text-white
            rounded-full p-2 translate-x-2
            opacity-0 group-hover:opacity-100
            transition-all duration-200 shadow-lg items-center justify-center"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PickedForYou;