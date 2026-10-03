interface ArticleCardSkeletonProps {
  layout?: 'standard' | 'horizontal' | 'compact';
}

export function ArticleCardSkeleton({ layout = 'standard' }: ArticleCardSkeletonProps) {
  if (layout === 'compact') {
    return (
      <div className="flex gap-4 items-start py-3 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 animate-pulse">
        <div className="flex-1 space-y-2.5">
          {/* Category placeholder */}
          <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
          {/* Title placeholders */}
          <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
          {/* Meta placeholder */}
          <div className="flex items-center gap-2 pt-1">
            <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-2 w-2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-pulse">
        {/* Thumbnail image placeholder */}
        <div className="sm:w-52 h-40 rounded-lg shrink-0 bg-neutral-200 dark:bg-neutral-800" />

        {/* Content placeholders */}
        <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
          <div>
            <div className="h-3.5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
            <div className="h-5 w-full bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
            <div className="h-5 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
            <div className="h-3.5 w-11/12 bg-neutral-200 dark:bg-neutral-800 rounded mb-1.5" />
            <div className="h-3.5 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Card Skeleton
  return (
    <div
      role="status"
      aria-label="Loading article..."
      className="flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden animate-pulse"
    >
      <div>
        {/* Aspect-video image placeholder */}
        <div className="aspect-video w-full bg-neutral-200 dark:bg-neutral-800" />

        <div className="p-5 space-y-3">
          {/* Category & views metadata */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-10 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>

          {/* Title lines */}
          <div className="space-y-1.5 pt-1">
            <div className="h-4.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-4.5 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>

          {/* Subtitle / summary lines */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="px-5 pb-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Author avatar */}
          <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          {/* Author name */}
          <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>

        {/* Reading time & save icon placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-14 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

export function HeroFeaturedSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading featured article..."
      className="relative w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm animate-pulse"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[380px]">
        {/* Left: Editorial Content */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Pill and Category */}
            <div className="flex items-center gap-3">
              <div className="h-5 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* Headline Title */}
            <div className="space-y-2 pt-2">
              <div className="h-8 sm:h-9 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-8 sm:h-9 w-4/5 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* Excerpt paragraphs */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-11/12 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>

          {/* Author metadata & button */}
          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>
            <div className="h-9 w-32 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        {/* Right: Featured Visual placeholder */}
        <div className="lg:col-span-6 min-h-[260px] lg:min-h-full bg-neutral-200 dark:bg-neutral-800 relative" />
      </div>
    </div>
  );
}

export function TrendingListSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-36 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3 w-28 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in duration-300" aria-busy="true">
      {/* Hero Featured Skeleton */}
      <HeroFeaturedSkeleton />

      {/* Trending List Skeleton */}
      <TrendingListSkeleton />

      {/* Latest Dispatches Section Skeleton */}
      <section className="pt-6">
        {/* Header & Category Pills Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-5 w-36 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="h-8 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
            <div className="h-8 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
            <div className="h-8 w-28 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
            <div className="h-8 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
            <div className="h-8 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
          </div>
        </div>

        {/* 6-Card Standard Article Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <ArticleCardSkeleton key={idx} layout="standard" />
          ))}
        </div>
      </section>

      {/* Editorial Deep Dives Horizontal Skeletons */}
      <section className="pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ArticleCardSkeleton layout="horizontal" />
          <ArticleCardSkeleton layout="horizontal" />
        </div>
      </section>
    </div>
  );
}
