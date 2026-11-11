import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowDownToLine,
  Sliders,
  Maximize2
} from 'lucide-react';

export const DownloadApkSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const APK_RELEASE_URL = 'https://github.com/jashwanth-04/1Pavala/releases';
  const APK_DIRECT_URL = 'https://github.com/jashwanth-04/1Pavala/releases/latest/download/1Pavala.apk';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(APK_DIRECT_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const steps = [
    {
      step: '01',
      title: 'Download the APK',
      subtitle: 'Fast, direct & open-source',
      description: 'Tap the Download button below or grab the latest release artifact from our official GitHub repository. No app store account or sign-up needed.',
      badge: 'Step 1',
      icon: <ArrowDownToLine size={22} className="text-brand-700 dark:text-emerald-400" />,
    },
    {
      step: '02',
      title: 'Allow Installation',
      subtitle: 'Standard Android security gate',
      description: 'When Android prompts "File might be harmful" or asks for permission, tap "Download anyway" and enable "Install unknown apps" for your browser or file manager.',
      badge: 'Step 2',
      icon: <ShieldCheck size={22} className="text-brand-700 dark:text-emerald-400" />,
      note: 'Normal for direct open-source APKs outside the Play Store'
    },
    {
      step: '03',
      title: 'Place Homescreen Widget',
      subtitle: '2-second expense logging',
      description: 'Open 1Pavala, then return to your homescreen. Long-press any empty space, open Widgets, search "1Pavala", and add the wide Notes-style Quick Record bar!',
      badge: 'Step 3',
      icon: <Sliders size={22} className="text-brand-700 dark:text-emerald-400" />,
      note: 'Floats right over your wallpaper without opening full app'
    },
  ];

  return (
    <section 
      id="download" 
      className="py-14 sm:py-24 px-3 sm:px-4 bg-white dark:bg-[#181818] border-y border-black/[0.04] dark:border-white/[0.06] scroll-mt-20 transition-colors"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-400/15 border border-brand-500/20 text-brand-700 dark:text-emerald-400 text-xs font-semibold mb-3">
            <Smartphone size={13} className="shrink-0" />
            <span>Android Native APK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E] dark:text-white tracking-tight">
            Install 1Pavala on your mobile device
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#8E8E93] dark:text-[#AEAEB2] max-w-lg mx-auto mt-2 leading-relaxed">
            Get the full native Android experience with homescreen quick-capture widgets, floating entry windows, and guaranteed zero-cloud privacy.
          </p>
        </div>

        {/* Primary Hero Download Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#F2F8F4] to-[#E5F3E8] dark:from-[#112417] dark:to-[#0D1911] border border-brand-500/20 dark:border-emerald-500/20 p-6 sm:p-10 mb-10 sm:mb-14 shadow-sm overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            
            {/* Left Column: Value Prop & Badges */}
            <div className="text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/10 dark:bg-emerald-400/15 text-brand-700 dark:text-emerald-300 text-xs font-bold mb-3">
                <Sparkles size={13} />
                <span>Latest Stable Release • v1.3.0</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1C1C1E] dark:text-white tracking-tight leading-tight">
                Download 1Pavala for Android
              </h3>
              <p className="text-xs sm:text-sm text-[#48484A] dark:text-[#98989D] mt-2 leading-relaxed">
                Single self-contained APK package. Runs completely offline with local IndexedDB persistence, accurate paisa precision, and instant homescreen widgets.
              </p>

              {/* Security Pill Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mt-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-white/70 dark:bg-black/40 px-2.5 py-1 rounded-full border border-emerald-600/20">
                  <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                  100% Offline
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-white/70 dark:bg-black/40 px-2.5 py-1 rounded-full border border-emerald-600/20">
                  <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                  Zero Telemetry
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-white/70 dark:bg-black/40 px-2.5 py-1 rounded-full border border-emerald-600/20">
                  <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                  No Sign-in
                </span>
              </div>
            </div>

            {/* Right Column: Download Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                href={APK_DIRECT_URL}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(33,75,48,0.35)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <Download size={18} />
                <span>Download APK (Direct)</span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={APK_RELEASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white dark:bg-[#1E1E1E] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-[0.98] text-xs font-semibold text-[#1C1C1E] dark:text-white border border-black/[0.08] dark:border-white/[0.1] transition-all"
                >
                  <span>GitHub Releases</span>
                  <ExternalLink size={13} className="text-[#8E8E93]" />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white dark:bg-[#1E1E1E] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-[0.98] text-xs font-semibold text-[#1C1C1E] dark:text-white border border-black/[0.08] dark:border-white/[0.1] transition-all shrink-0"
                  title="Copy APK download link to send to mobile"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} className="text-[#8E8E93]" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3-Step Apple HIG Visual Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#F2F2F7] dark:bg-[#1F1F1F] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between transition-all hover:border-brand-500/30"
            >
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#272727] flex items-center justify-center shadow-xs border border-black/[0.03] dark:border-white/[0.05]">
                    {s.icon}
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#8E8E93]/40 tabular-nums">
                    {s.step}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-[10px] font-bold text-brand-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                    {s.subtitle}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-[#1C1C1E] dark:text-white leading-snug">
                    {s.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-[#8E8E93] dark:text-[#A1A1A6] leading-relaxed mt-2">
                  {s.description}
                </p>
              </div>

              {s.note && (
                <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06]">
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/90 font-medium leading-tight">
                    💡 {s.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Homescreen Widget Spotlight Preview Box */}
        <div className="rounded-3xl bg-white dark:bg-[#181818] border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="max-w-md text-center md:text-left">
            <span className="text-[11px] font-bold text-brand-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
              Included with the APK
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-[#1C1C1E] dark:text-white">
              Notes-Style Quick Record Widget
            </h4>
            <p className="text-xs sm:text-sm text-[#8E8E93] mt-1.5 leading-relaxed">
              Place our wide, slim pill bar directly on your phone’s homescreen. Tapping either shortcut launches a sleek floating window over your wallpaper without having to open the full app.
            </p>
          </div>

          {/* Interactive Visual Representation of the Widget */}
          <div className="w-full max-w-sm rounded-full bg-gradient-to-r from-[#E6F4EA] to-[#D4EED8] border border-[#A6D8B3] py-2.5 px-4 flex items-center shadow-md select-none shrink-0">
            <div className="flex-1 flex items-center justify-center gap-1.5 text-[#163A21] font-bold text-xs py-1">
              <svg className="w-4 h-4 fill-none stroke-[#163A21] stroke-2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Record</span>
            </div>

            <div className="w-px h-5 bg-[#1E452B]/20 mx-2"></div>

            <div className="flex-1 flex items-center justify-center gap-1.5 text-[#163A21] font-bold text-xs py-1">
              <svg className="w-4 h-4 fill-none stroke-[#163A21] stroke-2 stroke-linecap-round" viewBox="0 0 24 24">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                <polyline points="12 7 12 12 15 14"></polyline>
              </svg>
              <span>Recent</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
