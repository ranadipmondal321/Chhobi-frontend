import { useEffect } from 'react';
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

const App = () => {
  const { fetchUser, fetchingUser } = useAuthStore();

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (fetchingUser) {
    return <p>Loading...</p>
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
  )
}

export default App