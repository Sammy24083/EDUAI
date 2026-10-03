import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  Save,
  ArrowLeft,
  Eye,
  Edit3,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Image as ImageIcon,
  Upload,
  Loader2,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import {
  getArticleById,
  createArticle,
  updateArticle,
} from '../../services/articleService';
import { getCategories } from '../../services/categoryService';
import { useAuth } from '../../context/AuthContext';
import { Article, Category, ArticleStatus } from '../../types';
import { useSEO } from '../../hooks/useSEO';
import { ImageUploader } from '../../components/common/ImageUploader';
import { uploadImageFile } from '../../services/storageService';

export function AdminArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsoredBrand, setSponsoredBrand] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const contentFileInputRef = useRef<HTMLInputElement>(null);

  const handleInsertContentImage = async (file: File) => {
    setInsertingImage(true);
    setError(null);
    try {
      const res = await uploadImageFile(file, 'article-inline');
      const markdownSnippet = `\n\n![${res.name.replace(/\.[^/.]+$/, '')}](${res.url})\n\n`;
      setContent((prev) => prev + markdownSnippet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image into content.');
    } finally {
      setInsertingImage(false);
      if (contentFileInputRef.current) contentFileInputRef.current.value = '';
    }
  };

  useSEO({
    title: isNew ? 'Compose Article — EduAI CMS' : 'Edit Article — EduAI CMS',
    description: 'Editorial article drafting and editing suite.',
  });

  // Calculate estimated reading time
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }

        if (!isNew && id) {
          const art = await getArticleById(id);
          if (art) {
            setTitle(art.title);
            setSubtitle(art.subtitle || '');
            setSlug(art.slug);
            setContent(art.content);
            setFeaturedImage(art.featuredImage || '');
            setCategoryId(art.categoryId);
            setTags(art.tags || []);
            setStatus(art.status);
            setIsFeatured(Boolean(art.isFeatured));
            setIsTrending(Boolean(art.isTrending));
            setIsSponsored(Boolean(art.isSponsored));
            setSponsoredBrand(art.sponsoredBrand || '');
            setSeoTitle(art.seoTitle || '');
            setSeoDescription(art.seoDescription || '');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isNew]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content body are required.');
      return;
    }
    if (!user) {
      setError('You must be signed in to save an article.');
      return;
    }

    setSaving(true);
    setError(null);

    const selectedCategory = categories.find((c) => c.id === categoryId);

    const articlePayload: Partial<Article> = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: content.trim(),
      featuredImage: featuredImage.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      categoryId,
      categoryName: selectedCategory?.name || 'Technology',
      categorySlug: selectedCategory?.slug || 'technology',
      tags,
      readingTime: estimatedReadingTime,
      status,
      isFeatured,
      isTrending,
      isSponsored,
      sponsoredBrand: isSponsored ? sponsoredBrand.trim() : undefined,
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || subtitle.trim() || title.trim(),
      authorId: user.uid,
      authorName: profile?.displayName || user.displayName || 'EduAI Editorial',
      authorUsername: profile?.username || 'editorial',
      authorPhotoURL: profile?.photoURL || user.photoURL || undefined,
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
    };

    try {
      if (isNew) {
        const newId = await createArticle(articlePayload as Parameters<typeof createArticle>[0]);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/admin/articles/${newId}`);
        }, 1200);
      } else if (id) {
        await updateArticle(id, articlePayload);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/articles"
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-500" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                {isNew ? 'New Editorial Dispatch' : 'Edit Article'}
              </h1>
              <span className="text-xs text-neutral-400">
                {wordCount} words • {estimatedReadingTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ArticleStatus)}
              className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : isNew ? 'Publish / Save' : 'Update'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Article successfully saved to publication database.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Writing Column */}
          <div className="lg:col-span-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Reasoning Agents and LLM Memory Hierarchies"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-base font-bold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                Subtitle / Deck (Summary)
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                placeholder="A compelling 1-2 sentence lead summarizing key findings..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>

            {/* Editor vs Preview Tabs & Image Insert */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'write'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                    Write Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'preview'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    Live Preview
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Inline Content Image Upload */}
                  <input
                    ref={contentFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleInsertContentImage(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={insertingImage}
                    onClick={() => contentFileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-[#635BFF] text-xs font-medium text-neutral-700 dark:text-neutral-200 transition flex items-center gap-1.5 disabled:opacity-50"
                    title="Upload an image directly from your computer into the article content"
                  >
                    {insertingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#635BFF]" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-[#635BFF]" />
                    )}
                    <span>{insertingImage ? 'Uploading Image...' : 'Insert Image to Body'}</span>
                  </button>
                  <span className="text-[11px] text-neutral-400 hidden sm:inline">
                    Markdown Supported
                  </span>
                </div>
              </div>

              {activeTab === 'write' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  required
                  placeholder="## Introduction&#10;&#10;Write the technical analysis in markdown...&#10;&#10;```python&#10;# Example code&#10;```"
                  className="w-full font-mono text-sm px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                />
              ) : (
                <div className="p-6 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 min-h-[400px] prose prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown>{content || '*No content to preview yet.*'}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Taxonomy & Metadata */}
          <div className="lg:col-span-4 space-y-5">
            {/* Classification Card */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Taxonomy &amp; Organization
              </h3>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  Primary Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  Tags (press Enter to add)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. agents, dspy, python"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-neutral-400 hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Media & Artwork Card */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <ImageUploader
                label="Featured Cover Image"
                value={featuredImage}
                onChange={setFeaturedImage}
                helperText="Upload image directly from your device or supply a direct URL."
              />
            </div>

            {/* Feature Flags */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3 shadow-sm text-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Editorial Flags
              </h3>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#635BFF] focus:ring-[#635BFF]"
                />
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Lead Featured Story on Homepage
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-[#635BFF] focus:ring-[#635BFF]"
                />
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Pin to "Trending on EduAI"
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <input
                  type="checkbox"
                  checked={isSponsored}
                  onChange={(e) => setIsSponsored(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Sponsored Partner Content
                </span>
              </label>

              {isSponsored && (
                <input
                  type="text"
                  value={sponsoredBrand}
                  onChange={(e) => setSponsoredBrand(e.target.value)}
                  placeholder="Sponsor brand name (e.g. Anthropic, Cloudflare)"
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
                />
              )}
            </div>

            {/* SEO Metadata */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3 shadow-sm text-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                SEO &amp; OpenGraph
              </h3>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Custom meta title'}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">SEO Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  placeholder={subtitle || 'Custom meta description'}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
