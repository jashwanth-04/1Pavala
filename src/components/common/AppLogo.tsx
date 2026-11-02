import React from 'react';

export interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtitle?: string;
  rounded?: boolean;
}

const sizeMap = {
  xs: {
    box: 'w-6 h-6',
    rounded: 'rounded-[6px]',
    text: 'text-sm font-bold',
    sub: 'text-[10px]',
  },
  sm: {
    box: 'w-8 h-8 sm:w-9 sm:h-9',
    rounded: 'rounded-[10px] sm:rounded-[12px]',
    text: 'text-base sm:text-lg font-bold',
    sub: 'text-[11px]',
  },
  md: {
    box: 'w-10 h-10',
    rounded: 'rounded-[12px]',
    text: 'text-lg font-bold',
    sub: 'text-xs',
  },
  lg: {
    box: 'w-12 h-12',
    rounded: 'rounded-[14px]',
    text: 'text-xl font-bold',
    sub: 'text-xs',
  },
  xl: {
    box: 'w-16 h-16',
    rounded: 'rounded-[18px]',
    text: 'text-2xl font-extrabold',
    sub: 'text-sm',
  },
  '2xl': {
    box: 'w-24 h-24',
    rounded: 'rounded-[24px]',
    text: 'text-3xl font-extrabold',
    sub: 'text-base',
  },
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'sm',
  className = '',
  showText = false,
  textClassName = '',
  subtitle,
  rounded = true,
}) => {
  const config = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative overflow-hidden shrink-0 shadow-sm border border-black/5 dark:border-white/10 ${
          config.box
        } ${rounded ? config.rounded : ''}`}
      >
        <img
          src="/logo.svg"
          alt="1Pavala official app logo"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`tracking-tight text-[#1C1C1E] dark:text-white ${
              config.text
            } ${textClassName}`}
          >
            1Pavala
          </span>
          {subtitle && (
            <span className={`text-[#8E8E93] font-medium mt-0.5 ${config.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AppLogo;
