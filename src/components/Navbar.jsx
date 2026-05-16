import { useState } from "react";
import {
  Bookmark,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { Clock } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Tv Shows", path: "/tvshows" },
  { name: "Movies", path: "/movies" },
  { name: "Anime", path: "/anime" },
  { name: "Games", path: "/games" },
  { name: "New & Popular", path: "/new-and-popular" },
  { name: "Upcoming", path: "/upcoming" },
];

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}`
    : "";

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
    setShowMobile(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setShowMobile(false);
    }
  };

  return (
    <>
      <nav className="bg-black text-gray-200 flex justify-between items-center px-4 md:px-6 h-16 md:h-20 text-sm md:text-[15px] font-medium relative z-50">
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            className="xl:hidden text-white p-1"
            onClick={() => setShowMobile(!showMobile)}
          >
            {showMobile ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link to="/">
            <img
              src="/chhobighor_logo (1).png"
              alt="Logo"
              className="w-28 md:w-35 cursor-pointer brightness-150"
            />
          </Link>
        </div>

        {/* Center: Desktop nav links */}
        <ul className="hidden xl:flex space-x-6">
          {navLinks.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? "text-[#e50914] border-b-2 border-[#e50914] pb-1"
                      : "hover:text-[#e50914]"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Search + AI + Avatar */}
        <div className="flex items-center gap-2 md:gap-4 relative">
          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="relative hidden md:inline-flex"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-[#333333] px-4 py-2 rounded-full w-48 lg:w-72 pr-10 outline-none text-sm"
              placeholder="Search..."
            />
            <button type="submit">
              <Search className="absolute top-2 right-4 w-5 h-5 cursor-pointer hover:text-[#e50914]" />
            </button>
          </form>

          {/* Mobile search icon */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setShowMobile(true)}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* AI button — hidden on very small screens */}
          <Link to={user ? "/ai-recommendations" : "/signin"}>
            <button className="hidden sm:block bg-[#e50914] px-3 md:px-5 py-2 text-white cursor-pointer text-xs md:text-sm rounded whitespace-nowrap">
              Get AI Movie Picks
            </button>
          </Link>

          {/* Avatar / Sign In */}
          {!user ? (
            <Link to="/signin">
              <button className="border border-[#333333] py-2 px-3 md:px-4 cursor-pointer text-xs md:text-sm rounded">
                Sign In
              </button>
            </Link>
          ) : (
            <div className="relative">
              <img
                src={avatarUrl}
                alt=""
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#e50914] cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              />

              {showMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#232323] rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                  <div className="flex flex-col items-center mb-2">
                    <span className="text-white font-semibold text-base">
                      {user.username}
                    </span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>

                  <Link to="/watchlist" onClick={() => setShowMenu(false)}>
                    <button className="flex items-center w-full px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                      <Bookmark className="w-5 h-5 text-[#e50914]" />
                      My Watchlist
                    </button>
                  </Link>

                  <Link to="/history" onClick={() => setShowMenu(false)}>
                    <button className="flex items-center w-full px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                      <Clock className="w-5 h-5 text-[#e50914]" />
                      Watch History
                    </button>
                  </Link>

                  <Link to="/help" onClick={() => setShowMenu(false)}>
                    <button className="flex items-center w-full px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                      <HelpCircle className="w-5 h-5" />
                      Help Center
                    </button>
                  </Link>

                  <Link to="/settings" onClick={() => setShowMenu(false)}>
                    <button className="flex items-center w-full px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                      <Settings className="w-5 h-5" />
                      Settings
                    </button>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile drawer */}
      {showMobile && (
        <div className="xl:hidden fixed inset-0 z-40 bg-black/90 flex flex-col pt-16">
          <div className="flex flex-col h-full overflow-y-auto px-6 py-6 gap-6">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#333333] px-4 py-3 rounded-full pr-12 outline-none text-white text-sm"
                placeholder="Search movies, shows..."
              />
              <button type="submit" className="absolute right-4 top-3">
                <Search className="w-5 h-5 text-gray-400 hover:text-[#e50914]" />
              </button>
            </form>

            {/* Mobile nav links */}
            <ul className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setShowMobile(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                        isActive
                          ? "bg-[#e50914]/10 text-[#e50914]"
                          : "text-gray-200 hover:bg-[#232323] hover:text-[#e50914]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* AI button on mobile */}
            <Link
              to={user ? "/ai-recommendations" : "/signin"}
              onClick={() => setShowMobile(false)}
            >
              <button className="w-full bg-[#e50914] py-3 text-white font-semibold rounded-xl">
                Get AI Movie Picks
              </button>
            </Link>

            {/* User section on mobile */}
            {user ? (
              <div className="flex flex-col gap-2 border-t border-[#333] pt-4">
                {/* Polished user info card */}
                <div className="bg-[#232323] border border-[#333] rounded-2xl p-4 flex items-center gap-4 mb-2">
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-14 h-14 rounded-full border-2 border-[#e50914] shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-white font-bold text-base truncate">
                      {user.username}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user.email}
                    </p>
                    <span className="text-[#e50914] text-xs font-semibold mt-0.5 block">
                      Member
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 px-1 mb-1">
                  <div className="flex-1 h-px bg-[#333]" />
                  <span className="text-[#555] text-xs">Account</span>
                  <div className="flex-1 h-px bg-[#333]" />
                </div>

                {/* Menu buttons */}
                <Link to="/watchlist" onClick={() => setShowMobile(false)}>
                  <button className="flex items-center w-full px-4 py-3 rounded-xl text-white bg-[#181818] hover:bg-[#232323] gap-3">
                    <Bookmark className="w-5 h-5 text-[#e50914]" />
                    My Watchlist
                  </button>
                </Link>

                <Link to="/history" onClick={() => setShowMenu(false)}>
                  <button className="flex items-center w-full px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                    <Clock className="w-5 h-5 text-[#e50914]" />
                    Watch History
                  </button>
                </Link>

                <Link to="/help" onClick={() => setShowMobile(false)}>
                  <button className="flex items-center w-full px-4 py-3 rounded-xl text-white bg-[#181818] hover:bg-[#232323] gap-3">
                    <HelpCircle className="w-5 h-5" />
                    Help Center
                  </button>
                </Link>

                <Link to="/settings" onClick={() => setShowMobile(false)}>
                  <button className="flex items-center w-full px-4 py-3 rounded-xl text-white bg-[#181818] hover:bg-[#232323] gap-3">
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                </Link>

                {/* Divider before logout */}
                <div className="h-px bg-[#333] my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 rounded-xl text-red-500 bg-[#181818] hover:bg-red-600/10 gap-3 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/signin" onClick={() => setShowMobile(false)}>
                <button className="w-full border border-[#333333] py-3 text-white font-semibold rounded-xl">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;