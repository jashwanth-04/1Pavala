import React, { useState, useEffect } from 'react';
import { AppLogo } from '../common/AppLogo';
import { Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LandingNavbarProps {
  onOpenApp: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenApp }) => {
  const { theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Benefits', href: '#benefits' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Privacy guarantee', href: '#privacy' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Floating Centered Navigation Bar per B7 Guidelines */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 sm:pt-4 pointer-events-none">
        <nav
          aria-label="Primary Navigation"
          className={`pointer-events-auto max-w-4xl mx-auto rounded-full transition-all duration-300 ease-base border ${
            scrolled
              ? 'bg-white/85 dark:bg-[#181818]/90 backdrop-blur-xl shadow-lg border-black/[0.08] dark:border-white/[0.1]'
              : 'bg-white/70 dark:bg-[#181818]/75 backdrop-blur-md border-black/[0.05] dark:border-white/[0.08]'
          } px-4 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between gap-4`}
        >
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700 rounded-full"
            aria-label="1Pavala Home"
          >
            <AppLogo size="sm" showText={false} />
            <span className="title-3 text-[#1C1C1E] dark:text-white font-bold tracking-tight">
              1Pavala
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="body-5 text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-700 rounded-md"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions: Theme Toggle & Launch CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[#1C1C1E] dark:text-white transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-700"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Launch App Primary CTA */}
            <button
              onClick={onOpenApp}
              className="button-sm bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-[0_2px_8px_rgba(33,75,48,0.25)] focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <span>Open App</span>
              <ArrowRight size={14} className="shrink-0" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] text-[#1C1C1E] dark:text-white transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Height Mobile Drawer per B7 Navigation Guidelines */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-2xl md:hidden flex flex-col justify-between pt-24 pb-12 px-6 animate-in fade-in duration-300">
          <div className="flex flex-col gap-5">
            <span className="caption-3 text-[#8E8E93] uppercase tracking-wider">
              Navigation
            </span>
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="heading-4 text-[#1C1C1E] dark:text-white hover:text-brand-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-black/[0.08] dark:border-white/[0.1]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApp();
              }}
              className="button-lg w-full bg-brand-700 text-white rounded-full py-3.5 flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Start Tracking Free</span>
              <ArrowRight size={16} />
            </button>
            <p className="caption-2 text-center text-[#8E8E93]">
              100% on device • Zero login required • Private
            </p>
          </div>
        </div>
      )}
    </>
  );
};
