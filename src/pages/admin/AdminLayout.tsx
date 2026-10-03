import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  MessageSquare,
  Mail,
  DollarSign,
  Settings,
  ArrowLeft,
  Shield,
  PenSquare,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, profile, isAdmin, isAuthor, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center mx-auto mb-4">
          <PenSquare className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          Sign In to Publish
        </h2>
        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          Sign in or create a free author account to compose and publish technical articles on EduAI.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login?from=/admin/articles/new"
            className="px-5 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white text-xs font-bold transition shadow-sm"
          >
            Sign In to Publish
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const isContributor = isAdmin || isAuthor || profile?.role === 'user' || Boolean(user);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Articles', path: '/admin/articles', icon: FileText },
    { label: 'Categories & Tags', path: '/admin/categories', icon: FolderTree },
    { label: 'Comments', path: '/admin/comments', icon: MessageSquare },
    { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
    { label: 'Ads & Sponsors', path: '/admin/ads', icon: DollarSign },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-neutral-50/50 dark:bg-[#070707]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 shrink-0">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#635BFF]" />
            <span className="font-black text-sm uppercase tracking-wider text-neutral-900 dark:text-white">
              EduAI CMS
            </span>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            aria-label="View live site"
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mb-4">
          <Link
            to="/admin/articles/new"
            className="w-full py-2.5 px-3 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <PenSquare className="w-3.5 h-3.5" />
            Write New Article
          </Link>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 px-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-neutral-500 truncate">{user.email}</span>
          </div>
          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-[#635BFF]">
            Role: {profile?.role || 'admin'}
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
