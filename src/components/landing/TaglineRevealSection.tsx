import React, { useEffect, useRef, useState } from 'react';

export const TaglineRevealSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWordsCount, setActiveWordsCount] = useState<number>(0);

  // Core benefit tagline text: 2 lines with meaningful breaks
  const statement = "Financial clarity belongs in your hands, not on a corporate server.";
  const words = statement.split(' ');

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setActiveWordsCount(words.length);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!container) return;
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Activation trigger line: when section is in middle third of screen
          const progress = Math.min(
            1,
            Math.max(0, (windowHeight * 0.75 - rect.top) / (windowHeight * 0.5))
          );

          const count = Math.floor(progress * (words.length + 1));
          setActiveWordsCount(count);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [words.length]);

  return (
    <section
      ref={containerRef}
      className="py-14 sm:py-24 px-4 bg-white dark:bg-[#181818] border-y border-black/[0.04] dark:border-white/[0.06] transition-colors"
      aria-label="Core Philosophy"
    >
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-[11px] sm:text-xs font-semibold text-brand-700 dark:text-emerald-400 uppercase tracking-widest block mb-3">
          Our Core Conviction
        </span>

        {/* Word-by-word reveal headline: Responsive text size */}
        <h2
          style={{ maxWidth: '640px' }}
          className="text-xl sm:text-3xl lg:text-4xl mx-auto font-bold leading-snug sm:leading-tight select-none px-2"
        >
          {words.map((word, idx) => {
            const isLit = idx < activeWordsCount;
            return (
              <span
                key={`${word}-${idx}`}
                className="inline-block mr-1.5 sm:mr-2.5 transition-all duration-500 ease-base"
                style={{
                  color: isLit ? undefined : 'currentColor',
                  opacity: isLit ? 1 : 0.28,
                  transform: isLit ? 'translateY(0)' : 'translateY(3px)',
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        <p className="text-xs sm:text-sm text-[#8E8E93] mt-4 max-w-sm sm:max-w-md mx-auto">
          Every transaction and budget balance stays completely offline on your device storage.
        </p>
      </div>
    </section>
  );
};
