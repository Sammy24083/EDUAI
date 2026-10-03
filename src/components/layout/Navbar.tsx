import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PenSquare,
  Sun,
  Moon,
  Bookmark,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { user, profile, isAuthor, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black tracking-tighter text-base shadow-sm group-hover:bg-[#635BFF] dark:group-hover:bg-[#635BFF] dark:group-hover:text-white transition-colors">
              E
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-xl text-neutral-900 dark:text-white leading-none">
                Edu<span className="text-[#635BFF] ml-0.5">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 dark:text-neutral-500">
                Editorial Tech
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/explore" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Explore
            </Link>
            <Link to="/categories" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Categories
            </Link>
            <Link to="/authors" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Authors
            </Link>
            <Link to="/about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Search trigger */}
          <button
            onClick={() => onOpenSearch ? onOpenSearch() : navigate('/search')}
            aria-label="Search articles"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Write button */}
          <Link
            to={user ? "/admin/articles/new" : "/login?from=/admin/articles/new"}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
          >
            <PenSquare className="w-3.5 h-3.5 text-[#635BFF]" />
            Write
          </Link>

          {/* User Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-neutral-200 dark:border-neutral-700 hover:ring-2 hover:ring-[#635BFF]/30 transition"
              >
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs">
                    {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="font-semibold text-neutral-900 dark:text-white truncate">
                      {profile?.displayName || 'Reader'}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    <span className="mt-1 inline-block px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {profile?.role || 'user'}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <User className="w-4 h-4 text-neutral-400" />
                    My Profile
                  </Link>

                  <Link
                    to="/saved"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <Bookmark className="w-4 h-4 text-neutral-400" />
                    Saved Articles
                  </Link>

                  <Link
                    to="/admin/articles/new"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <PenSquare className="w-4 h-4 text-[#635BFF]" />
                    Write New Article
                  </Link>

                  <Link
                    to="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[#635BFF] font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <Shield className="w-4 h-4" />
                    Editorial CMS
                  </Link>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-2.5 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Explore
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Categories
            </Link>
            <Link
              to="/authors"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Authors
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Search Publication
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              About EduAI
            </Link>

            {isAuthor && (
              <Link
                to="/admin/articles/new"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-[#635BFF] bg-[#635BFF]/10 flex items-center gap-2"
              >
                <PenSquare className="w-4 h-4" />
                Write New Article
              </Link>
            )}

            {(isAdmin || isAuthor) && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#635BFF]" />
                Admin CMS
              </Link>
            )}

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 w-full text-left"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
