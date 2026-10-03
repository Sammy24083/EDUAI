import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Twitter, Github, Linkedin, Globe, Mail } from 'lucide-react';
import { Article } from '../types';
import { getPublishedArticles } from '../services/articleService';
import { ArticleCard } from '../components/article/ArticleCard';
import { useSEO } from '../hooks/useSEO';

export function AuthorDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedArticles(50).then((arts) => {
      const filtered = arts.filter(
        (a) => a.authorUsername?.toLowerCase() === username?.toLowerCase()
      );
      setArticles(filtered);
      setLoading(false);
    });
  }, [username]);

  const authorName = articles[0]?.authorName || username;
  const authorAvatar = articles[0]?.authorPhotoURL;

  useSEO({
    title: `${authorName} — Editorial Contributor`,
    description: `Read technical dispatches and architectural analyses written by ${authorName} on EduAI.`,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6">
        <Link to="/" className="hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/authors" className="hover:underline">Authors</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          @{username}
        </span>
      </nav>

      {/* Author Bio Banner */}
      <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
        {authorAvatar ? (
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-neutral-100 dark:ring-neutral-800 shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-3xl shrink-0">
            {authorName?.charAt(0) || 'A'}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                {authorName}
              </h1>
              <p className="text-xs text-[#635BFF] font-bold uppercase tracking-wider mt-0.5">
                Staff Research Fellow &amp; Writer
              </p>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2 text-neutral-400">
              <a href="#" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
            Writing deeply about artificial general intelligence, agent architectures, retrieval mechanics, and enterprise software engineering. Researching automated code synthesis and self-improving workflows.
          </p>

          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-6 text-xs text-neutral-500">
            <span><strong>{articles.length}</strong> published dispatches</span>
            <span>•</span>
            <span>Joined Editorial Board 2026</span>
          </div>
        </div>
      </div>

      {/* Dispatches by Author */}
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
        Articles by {authorName}
      </h2>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      ) : articles.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
          <p className="text-sm text-neutral-500">No published articles under this author yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} layout="standard" />
          ))}
        </div>
      )}
    </div>
  );
}
