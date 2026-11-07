import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { TaglineRevealSection } from './TaglineRevealSection';
import { ProblemSolutionSection } from './ProblemSolutionSection';
import { BenefitsSection } from './BenefitsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { PrivacyProofSection } from './PrivacyProofSection';
import { FaqSection } from './FaqSection';
import { FinalCtaSection } from './FinalCtaSection';
import { LandingFooter } from './LandingFooter';

interface LandingPageViewProps {
  onOpenApp: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onOpenApp }) => {
  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] text-[#1C1C1E] dark:text-white transition-colors duration-200">
      <LandingNavbar onOpenApp={onOpenApp} />
      
      <main>
        <HeroSection onStartTracking={onOpenApp} />
        <TaglineRevealSection />
        <ProblemSolutionSection />
        <BenefitsSection />
        <HowItWorksSection />
        <PrivacyProofSection />
        <FaqSection />
        <FinalCtaSection onStartTracking={onOpenApp} />
      </main>

      <LandingFooter onOpenApp={onOpenApp} />
    </div>
  );
};
