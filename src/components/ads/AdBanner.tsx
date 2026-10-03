import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { AdPlacement, Advertisement } from '../../types';
import { getActiveAdsByPlacement, recordAdClick } from '../../services/adService';

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
}

export function AdBanner({ placement, className = '' }: AdBannerProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    let mounted = true;
    getActiveAdsByPlacement(placement).then((ads) => {
      if (mounted && ads && ads.length > 0) {
        // Pick a random or first active ad
        setAd(ads[Math.floor(Math.random() * ads.length)]);
      }
    });
    return () => {
      mounted = false;
    };
  }, [placement]);

  if (!ad) return null;

  const handleClick = () => {
    if (ad.id) {
      recordAdClick(ad.id);
    }
  };

  return (
    <div
      className={`relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-4 text-center overflow-hidden my-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 dark:text-neutral-500">
          Partner Sponsor
        </span>
        <span className="text-[10px] text-neutral-400">Ad</span>
      </div>

      <a
        href={ad.destinationUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="group flex flex-col sm:flex-row items-center gap-4 text-left"
      >
        {ad.imageUrl && (
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full sm:w-36 h-20 object-cover rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#635BFF] transition flex items-center gap-1">
            {ad.title}
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
            Explore cutting-edge tools and cloud infrastructure power tailored for modern software architects.
          </p>
        </div>
      </a>
    </div>
  );
}
