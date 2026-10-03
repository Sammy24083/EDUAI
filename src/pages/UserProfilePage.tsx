import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Bookmark, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { ImageUploader } from '../components/common/ImageUploader';

export function UserProfilePage() {
  const { user, profile, updateProfileData, isAdmin, isAuthor } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useSEO({ title: 'My Profile', description: 'Manage your EduAI reader profile and preferences.' });

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Sign in Required</h2>
        <p className="text-xs text-neutral-500 mb-6">Please sign in to view and edit your profile settings.</p>
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfileData({
        displayName,
        bio,
        photoURL: photoURL.trim() || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Manage your account identity and reader preferences</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/saved"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#635BFF]" />
            Saved Articles
          </Link>
          {(isAdmin || isAuthor) && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#635BFF] text-white text-xs font-semibold hover:bg-[#5248e5] transition"
            >
              <Shield className="w-3.5 h-3.5" />
              CMS Admin
            </Link>
          )}
        </div>
      </div>

      <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        {saved && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Profile successfully updated.</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center gap-5">
            {photoURL || profile?.photoURL ? (
              <img
                src={photoURL || profile?.photoURL}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold text-2xl">
                {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-sm text-neutral-900 dark:text-white">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-[#635BFF]">
                  Role: {profile?.role || 'user'}
                </span>
                {isAdmin && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
                    Admin Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Username (read-only)
              </label>
              <input
                type="text"
                value={profile?.username || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/40 text-sm text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              label="Profile Avatar Photo"
              value={photoURL}
              onChange={setPhotoURL}
              folder="avatars"
              recommendedAspect="Square 1:1 ratio (e.g. 400x400)"
              helperText="Upload a profile picture from your phone/computer or supply a direct image URL."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Brief professional background or research focus..."
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
