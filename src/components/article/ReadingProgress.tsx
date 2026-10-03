import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(3)) * 100);
      }
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-transparent">
      <div
        className="h-full bg-[#635BFF] transition-all duration-75 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}
