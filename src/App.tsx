import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/search/SearchModal';

// Public pages
import { HomePage } from './pages/HomePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ExplorePage } from './pages/ExplorePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { SearchPage } from './pages/SearchPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NewsletterPage } from './pages/NewsletterPage';
import { PrivacyPage, TermsPage, CookiePage } from './pages/LegalPages';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages';
import { UserProfilePage } from './pages/UserProfilePage';
import { SavedArticlesPage } from './pages/SavedArticlesPage';

// Admin CMS pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminArticles } from './pages/admin/AdminArticles';
import { AdminArticleEditor } from './pages/admin/AdminArticleEditor';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminComments } from './pages/admin/AdminComments';
import { AdminNewsletter } from './pages/admin/AdminNewsletter';
import { AdminAds } from './pages/admin/AdminAds';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 selection:bg-[#635BFF]/20 selection:text-[#635BFF] transition-colors font-sans antialiased">
            <Navbar onOpenSearch={() => setSearchOpen(true)} />
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            <div className="flex-1">
              <Routes>
                {/* Public Editorial Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/article/:slug" element={<ArticleDetailPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/category/:slug" element={<CategoryDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/authors" element={<AuthorsPage />} />
                <Route path="/author/:username" element={<AuthorDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/newsletter" element={<NewsletterPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/cookie-policy" element={<CookiePage />} />

                {/* User & Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/saved" element={<SavedArticlesPage />} />

                {/* Admin CMS Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/articles" element={<AdminArticles />} />
                <Route path="/admin/articles/new" element={<AdminArticleEditor />} />
                <Route path="/admin/articles/:id" element={<AdminArticleEditor />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/comments" element={<AdminComments />} />
                <Route path="/admin/newsletter" element={<AdminNewsletter />} />
                <Route path="/admin/ads" element={<AdminAds />} />
                <Route path="/admin/settings" element={<AdminSettings />} />

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
