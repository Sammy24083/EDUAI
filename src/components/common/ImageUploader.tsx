import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Check, Loader2, Sparkles } from 'lucide-react';
import { uploadImageFile } from '../../services/storageService';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  recommendedAspect?: string;
  helperText?: string;
}

const CURATED_TECH_COVERS = [
  {
    title: 'Neural Matrix',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'AI Silicon',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Autonomous Nodes',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Cyber Grid',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Quantum Hardware',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
  },
];

export function ImageUploader({
  label = 'Cover Image',
  value,
  onChange,
  folder = 'articles',
  recommendedAspect = '16:9 ratio (e.g. 1200x675)',
  helperText,
}: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const result = await uploadImageFile(file, folder);
      onChange(result.url);
      setUrlInput(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleApplyUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
        <span className="text-[10px] text-neutral-400">{recommendedAspect}</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
            activeTab === 'upload'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
            activeTab === 'url'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Image URL
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
            activeTab === 'presets'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
          Presets
        </button>
      </div>

      {/* Upload Drop Zone Tab */}
      {activeTab === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? 'border-[#635BFF] bg-[#635BFF]/5'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#635BFF]" />
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Optimizing &amp; uploading image...
              </p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  Click to browse or drop your image here
                </p>
                <p className="text-[11px] text-neutral-500">
                  PNG, JPG, WebP, GIF, SVG up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL Tab */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyUrl();
              }
            }}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
          />
          <button
            type="button"
            onClick={() => handleApplyUrl()}
            className="px-3 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-[#635BFF] transition flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Set URL
          </button>
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CURATED_TECH_COVERS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setUrlInput(preset.url);
              }}
              className="group relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 text-left hover:ring-2 hover:ring-[#635BFF] transition"
            >
              <img
                src={preset.url}
                alt={preset.title}
                className="w-full h-16 object-cover group-hover:scale-105 transition"
              />
              <span className="absolute inset-x-0 bottom-0 bg-neutral-950/70 p-1 text-[10px] font-semibold text-white truncate block text-center">
                {preset.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 mt-2">
          <img
            src={value}
            alt="Preview"
            className="w-full h-44 object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-neutral-900/80 hover:bg-red-600 text-white transition backdrop-blur-xs"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-neutral-900/80 text-[10px] font-semibold text-neutral-200 backdrop-blur-xs flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-emerald-400" />
            Cover Image Ready
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-neutral-400">{helperText}</p>
      )}
    </div>
  );
}
