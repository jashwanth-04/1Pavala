import { useEffect } from 'react';

/**
 * Hook that listens to native Android WindowInsets events and synchronizes
 * CSS custom properties (--sat and --sab) dynamically.
 */
export function useSafeArea() {
  useEffect(() => {
    const syncInsets = () => {
      try {
        const bridge = (window as any).AndroidExportBridge;
        if (bridge) {
          if (typeof bridge.getSafeAreaTop === 'function') {
            const top = bridge.getSafeAreaTop();
            if (top > 0) {
              document.documentElement.style.setProperty('--sat', `${top}px`);
            }
          }
          if (typeof bridge.getSafeAreaBottom === 'function') {
            const bottom = bridge.getSafeAreaBottom();
            if (bottom > 0) {
              document.documentElement.style.setProperty('--sab', `${bottom}px`);
            }
          }
        }
      } catch (e) {
        console.error('Error synchronizing safe area insets:', e);
      }
    };

    // Sync on mount
    syncInsets();

    // Listen for safeareachange custom event dispatched by MainActivity
    const handleSafeAreaChange = (e: any) => {
      if (e?.detail) {
        if (typeof e.detail.top === 'number') {
          document.documentElement.style.setProperty('--sat', `${e.detail.top}px`);
        }
        if (typeof e.detail.bottom === 'number') {
          document.documentElement.style.setProperty('--sab', `${e.detail.bottom}px`);
        }
      } else {
        syncInsets();
      }
    };

    window.addEventListener('safeareachange', handleSafeAreaChange);
    window.addEventListener('resize', syncInsets);

    return () => {
      window.removeEventListener('safeareachange', handleSafeAreaChange);
      window.removeEventListener('resize', syncInsets);
    };
  }, []);
}
