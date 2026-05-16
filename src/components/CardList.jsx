import { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CardList = ({ title, category }) => {
  const [data, setData] = useState([]);
  const swiperRef = useRef(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTNhMjZjODk4NDNiNTA0Yjc5ZmUzYTAzODlhMThjMSIsIm5iZiI6MTc3ODMyNzAyNy40OTQwMDAyLCJzdWIiOiI2OWZmMWRmMzFkYWJhMjliZjVhZThkYTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.clAArrB45ttQV4q42hLqFYgkgF1aHAIUb3HjBTTmG3s',
    },
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`,
      options
    )
      .then(res => res.json())
      .then(res => setData(res.results || []))
      .catch(err => console.error(err));
  }, [category]);

  return (
    <div className='text-white px-0 md:px-4'>
      <h2 className='pt-6 md:pt-10 pb-3 md:pb-5 text-base md:text-lg font-semibold'>{title}</h2>

      <div className="relative group">
        {/* Prev Arrow — hidden on mobile */}
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
          className='mySwiper'
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {data.map((item) => (
            <SwiperSlide key={item.id} className='!w-40 sm:!w-52 md:!w-64 lg:!w-72'>
              <Link to={`/movie/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                  alt={item.original_title}
                  className='h-24 sm:h-32 md:h-40 lg:h-44 w-full object-center object-cover rounded-lg'
                />
                <p className='text-center pt-2 text-xs md:text-sm truncate px-1'>{item.original_title}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Next Arrow — hidden on mobile */}
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

export default CardList;