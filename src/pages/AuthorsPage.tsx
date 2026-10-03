import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ArrowRight, Twitter, Github, Linkedin } from 'lucide-react';
import { getPublishedArticles } from '../services/articleService';
import { useSEO } from '../hooks/useSEO';

interface AuthorSummary {
  username: string;
  name: string;
  avatar?: string;
  count: number;
}

export function AuthorsPage() {
  const [authors, setAuthors] = useState<AuthorSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Contributing Authors & Fellows',
    description: 'Meet the AI researchers, staff editors, and software engineers writing for EduAI.',
  });

  useEffect(() => {
    getPublishedArticles(50).then((arts) => {
      const map = new Map<string, AuthorSummary>();
      arts.forEach((a) => {
        const key = a.authorUsername || a.authorName;
        if (!map.has(key)) {
          map.set(key, {
            username: a.authorUsername,
            name: a.authorName,
            avatar: a.authorPhotoURL,
            count: 1,
          });
        } else {
          const prev = map.get(key)!;
          prev.count += 1;
        }
      });
      setAuthors(Array.from(map.values()));
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Publication Authors &amp; Fellows
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl">
          Meet the engineers, founders, and researchers examining the cutting edge of computation.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div
              key={author.username}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xl">
                      {author.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                      {author.name}
                    </h3>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      @{author.username}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                  Contributing analyses on machine intelligence, algorithmic paradigms, and systems engineering.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">
                  {author.count} {author.count === 1 ? 'article' : 'articles'}
                </span>
                <Link
                  to={`/author/${author.username}`}
                  className="text-xs font-bold text-[#635BFF] hover:underline flex items-center gap-1"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
