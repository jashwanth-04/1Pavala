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
      className="py-24 sm:py-36 px-4 bg-white dark:bg-[#181818] border-y border-black/[0.04] dark:border-white/[0.06] transition-colors"
      aria-label="Core Philosophy"
    >
      <div className="max-w-4xl mx-auto text-center">
        <span className="caption-3 text-brand-700 dark:text-emerald-400 uppercase tracking-widest block mb-4">
          Our Core Conviction
        </span>

        {/* Word-by-word reveal headline */}
        <h2
          style={{ maxWidth: '680px' }}
          className="heading-3 sm:heading-2 mx-auto font-bold leading-tight select-none"
        >
          {words.map((word, idx) => {
            const isLit = idx < activeWordsCount;
            return (
              <span
                key={`${word}-${idx}`}
                className="inline-block mr-2.5 transition-all duration-500 ease-base"
                style={{
                  color: isLit ? undefined : 'currentColor',
                  opacity: isLit ? 1 : 0.28,
                  transform: isLit ? 'translateY(0)' : 'translateY(4px)',
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        <p className="body-4 text-[#8E8E93] mt-6 max-w-md mx-auto">
          Every transaction and budget balance stays completely offline on your device storage.
        </p>
      </div>
    </section>
  );
};
