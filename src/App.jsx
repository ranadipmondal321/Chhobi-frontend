import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import { Route, Routes } from 'react-router';
import Moviepage from './pages/Moviepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { Toaster } from "react-hot-toast";
import { useAuthStore } from './store/authStore';
import AIRecommendations from './pages/AIRecommendations';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Anime from './pages/Anime';
import Games from './pages/Games';
import NewAndPopular from './pages/NewAndPopular';
import Upcoming from './pages/Upcoming';
import SearchResults from './pages/SearchResults';
import TVpage from './pages/TVpage';
import Watchlist from "./pages/Watchlist";
import HelpCenter from './pages/HelpCenter';
import Settings from './pages/Settings';
import WatchHistory from './pages/WatchHistory';
import { API_URL } from './lib/api';

const App = () => {
  const { fetchUser, fetchingUser } = useAuthStore();
  const [serverReady, setServerReady] = useState(false);
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    let wakingTimer;

    const pingServer = async () => {
      wakingTimer = setTimeout(() => setWaking(true), 3000);
      try {
        const res = await fetch(`${API_URL}/ping`);
        if (res.ok) {
          clearTimeout(wakingTimer);
          setWaking(false);
          setServerReady(true);
        }
      } catch {
        clearTimeout(wakingTimer);
        setWaking(false);
        setServerReady(true);
      }
    };

    pingServer();
    return () => clearTimeout(wakingTimer);
  }, []);

  useEffect(() => {
    if (serverReady) fetchUser();
  }, [serverReady, fetchUser]);

  if (!serverReady || fetchingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#181818] gap-5">
        <img src="/chhobighor_logo (1).png" alt="Logo" className="w-40 brightness-150 mb-2" />
        <div className="w-10 h-10 rounded-full border-4 border-[#333] border-t-[#e50914] animate-spin" />
        {waking && (
          <div className="text-center px-6">
            <p className="text-white text-sm font-semibold">Starting up the server...</p>
            <p className="text-[#888] text-xs mt-1">
              Free servers sleep after inactivity. This takes up to 50 seconds on first load.
            </p>
            <div className="mt-4 w-48 h-1 bg-[#333] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-[#e50914] rounded-full animate-pulse w-full" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/movie/:id" element={<Moviepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tvshows" element={<TVShows />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/games" element={<Games />} />
        <Route path="/new-and-popular" element={<NewAndPopular />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/tv/:id" element={<TVpage />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<WatchHistory />} />
      </Routes>
    </div>
  );
};

export default App;
