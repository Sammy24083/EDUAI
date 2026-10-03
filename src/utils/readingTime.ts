/**
 * Utility functions for calculating and formatting reading time and word counts.
 */

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
  badge: string;
}

export function calculateReadingTime(content?: string, wpm = 200): ReadingTimeResult {
  if (!content || !content.trim()) {
    return {
      minutes: 1,
      words: 0,
      text: '1 min read',
      badge: '1m read',
    };
  }

  // Strip markdown formatting characters to count real words accurately
  const cleanContent = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // remove markdown images
    .replace(/\[.*?\]\(.*?\)/g, '$1') // replace links with anchor text
    .replace(/[`*#_~>+-]/g, ' ') // remove markdown syntax chars
    .trim();

  const words = cleanContent.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wpm));

  return {
    minutes,
    words,
    text: `${minutes} min read`,
    badge: `${minutes}m read`,
  };
}

export function formatReadingTime(
  persistedReadingTime?: string,
  content?: string
): string {
  if (persistedReadingTime && persistedReadingTime.trim()) {
    // If it already says "X min read" or "X min", standardize it
    if (persistedReadingTime.includes('min')) {
      return persistedReadingTime;
    }
    return `${persistedReadingTime} min read`;
  }

  return calculateReadingTime(content).text;
}

export function getRemainingReadingTime(
  completionPercent: number,
  totalMinutes: number
): string {
  const fractionLeft = Math.max(0, 1 - completionPercent / 100);
  const minutesLeft = Math.ceil(totalMinutes * fractionLeft);
  if (minutesLeft <= 1) return 'Finishing up';
  return `~${minutesLeft} min left`;
}
