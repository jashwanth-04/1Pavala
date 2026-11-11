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

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Benefits', href: '#benefits' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Download APK', href: '#download' },
    { label: 'Privacy guarantee', href: '#privacy' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Floating Centered Navigation Bar per B7 Guidelines */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-2.5 sm:pt-4 pointer-events-none">
        <nav
          aria-label="Primary Navigation"
          className={`pointer-events-auto max-w-4xl mx-auto rounded-full transition-all duration-300 ease-base border ${
            scrolled
              ? 'bg-white/85 dark:bg-[#181818]/90 backdrop-blur-xl shadow-lg border-black/[0.08] dark:border-white/[0.1]'
              : 'bg-white/75 dark:bg-[#181818]/80 backdrop-blur-md border-black/[0.05] dark:border-white/[0.08]'
          } px-3 py-1.5 sm:px-5 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4`}
        >
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700 rounded-full shrink-0"
            aria-label="1Pavala Home"
          >
            <AppLogo size="sm" showText={false} />
            <span className="text-sm sm:text-base text-[#1C1C1E] dark:text-white font-bold tracking-tight">
              1Pavala
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-700 rounded-md"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Buttons: Clean & Uncongested on Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle - Desktop only in header, inside drawer on mobile */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-[#1C1C1E] dark:text-white transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-700"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Launch App Primary CTA */}
            <button
              onClick={onOpenApp}
              className="bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white rounded-full text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-200 flex items-center gap-1 shadow-[0_2px_8px_rgba(33,75,48,0.25)] focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <span>Open App</span>
              <ArrowRight size={13} className="shrink-0 hidden xs:inline" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] text-[#1C1C1E] dark:text-white transition-colors active:scale-95"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Height Mobile Drawer per B7 Navigation Guidelines */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-2xl md:hidden flex flex-col justify-between pt-24 pb-12 px-6 animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="caption-3 text-[#8E8E93] uppercase tracking-wider">
                Menu Navigation
              </span>
              <div className="flex items-center gap-2">
                <span className="caption-4 text-[#8E8E93]">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.1] text-[#1C1C1E] dark:text-white"
                  aria-label="Toggle theme in menu"
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              </div>
            </div>

            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="text-2xl font-bold text-[#1C1C1E] dark:text-white hover:text-brand-700 transition-colors"
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
              className="button-lg w-full bg-brand-700 text-white rounded-full py-3.5 flex items-center justify-center gap-2 shadow-lg active:scale-98"
            >
              <span>Launch 1Pavala Tracker</span>
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
