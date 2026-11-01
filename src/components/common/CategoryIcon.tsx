import React from 'react';
import {
  UtensilsCrossed,
  ShoppingCart,
  Car,
  ShoppingBag,
  Film,
  Zap,
  HeartPulse,
  GraduationCap,
  Plane,
  MoreHorizontal,
  Coffee,
  Home,
  Tag,
  Gift,
  Briefcase,
  LucideIcon,
} from 'lucide-react';
import { Category } from '../../types';

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  ShoppingCart,
  Car,
  ShoppingBag,
  Film,
  Zap,
  HeartPulse,
  GraduationCap,
  Plane,
  MoreHorizontal,
  Coffee,
  Home,
  Tag,
  Gift,
  Briefcase,
};

interface CategoryIconProps {
  category?: Category;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBg?: boolean;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 'md',
  showBg = true,
  className = '',
}) => {
  const iconName = category?.icon || 'MoreHorizontal';
  const IconComponent = ICON_MAP[iconName] || MoreHorizontal;
  const color = category?.color || '#64748b';
  const bgLight = category?.bgLight || '#f1f5f9';

  const sizeClasses = {
    sm: {
      box: 'w-7 h-7 rounded-lg text-xs',
      icon: 14,
    },
    md: {
      box: 'w-10 h-10 rounded-xl text-sm',
      icon: 18,
    },
    lg: {
      box: 'w-12 h-12 rounded-2xl text-base',
      icon: 22,
    },
    xl: {
      box: 'w-16 h-16 rounded-3xl text-lg',
      icon: 30,
    },
  }[size];

  if (!showBg) {
    return <IconComponent size={sizeClasses.icon} color={color} className={className} />;
  }

  return (
    <div
      className={`category-icon-box flex items-center justify-center shrink-0 ${sizeClasses.box} ${className}`}
      style={{ backgroundColor: bgLight }}
      title={category?.name}
    >
      <IconComponent size={sizeClasses.icon} color={color} strokeWidth={2.2} />
    </div>
  );
};
