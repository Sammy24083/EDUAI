import { useMemo } from 'react';
import { AlignLeft } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const headings = useMemo(() => {
    const lines = markdown.split('\n');
    const items: TOCItem[] = [];

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);

      if (h2Match) {
        const text = h2Match[1].replace(/[`*#]/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        items.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].replace(/[`*#]/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        items.push({ id, text, level: 3 });
      }
    });

    return items;
  }, [markdown]);

  if (headings.length < 2) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav aria-label="Table of contents" className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 my-6">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        <AlignLeft className="w-4 h-4 text-[#635BFF]" />
        Table of Contents
      </div>
      <ul className="space-y-2 text-sm">
        {headings.map((item, idx) => (
          <li
            key={idx}
            className={`${item.level === 3 ? 'pl-4 text-xs' : 'font-medium text-neutral-800 dark:text-neutral-200'}`}
          >
            <button
              onClick={() => scrollToHeading(item.id)}
              className="text-left text-neutral-600 dark:text-neutral-400 hover:text-[#635BFF] dark:hover:text-[#635BFF] transition-colors line-clamp-1"
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
