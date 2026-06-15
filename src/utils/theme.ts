export interface ThemeClasses {
  primaryBg: string;
  primaryHoverBg: string;
  primaryText: string;
  primaryBorder: string;
  primaryRing: string;
  gradientFrom: string;
  accentBg: string;
  lightBg: string;
}

export function getThemeClasses(color: string): ThemeClasses {
  switch (color) {
    case 'emerald':
      return {
        primaryBg: 'bg-emerald-600',
        primaryHoverBg: 'hover:bg-emerald-700',
        primaryText: 'text-emerald-600',
        primaryBorder: 'border-emerald-500',
        primaryRing: 'focus:ring-emerald-500',
        gradientFrom: 'from-emerald-600',
        accentBg: 'bg-emerald-50',
        lightBg: 'bg-emerald-50/50',
      };
    case 'blue':
      return {
        primaryBg: 'bg-blue-600',
        primaryHoverBg: 'hover:bg-blue-700',
        primaryText: 'text-blue-600',
        primaryBorder: 'border-blue-500',
        primaryRing: 'focus:ring-blue-500',
        gradientFrom: 'from-blue-600',
        accentBg: 'bg-blue-50',
        lightBg: 'bg-blue-50/50',
      };
    case 'indigo':
      return {
        primaryBg: 'bg-indigo-600',
        primaryHoverBg: 'hover:bg-indigo-700',
        primaryText: 'text-indigo-600',
        primaryBorder: 'border-indigo-500',
        primaryRing: 'focus:ring-indigo-500',
        gradientFrom: 'from-indigo-600',
        accentBg: 'bg-indigo-50',
        lightBg: 'bg-indigo-50/50',
      };
    case 'rose':
      return {
        primaryBg: 'bg-rose-600',
        primaryHoverBg: 'hover:bg-rose-700',
        primaryText: 'text-rose-600',
        primaryBorder: 'border-rose-500',
        primaryRing: 'focus:ring-rose-500',
        gradientFrom: 'from-rose-600',
        accentBg: 'bg-rose-50',
        lightBg: 'bg-rose-50/50',
      };
    case 'crimson':
      return {
        primaryBg: 'bg-red-600',
        primaryHoverBg: 'hover:bg-red-700',
        primaryText: 'text-red-600',
        primaryBorder: 'border-red-500',
        primaryRing: 'focus:ring-red-500',
        gradientFrom: 'from-red-600',
        accentBg: 'bg-red-50',
        lightBg: 'bg-red-50/50',
      };
    case 'violet':
      return {
        primaryBg: 'bg-violet-600',
        primaryHoverBg: 'hover:bg-violet-700',
        primaryText: 'text-violet-600',
        primaryBorder: 'border-violet-500',
        primaryRing: 'focus:ring-violet-500',
        gradientFrom: 'from-violet-600',
        accentBg: 'bg-violet-50',
        lightBg: 'bg-violet-50/50',
      };
    case 'sky':
      return {
        primaryBg: 'bg-sky-500',
        primaryHoverBg: 'hover:bg-sky-600',
        primaryText: 'text-sky-600',
        primaryBorder: 'border-sky-400',
        primaryRing: 'focus:ring-sky-500',
        gradientFrom: 'from-sky-500',
        accentBg: 'bg-sky-50',
        lightBg: 'bg-sky-50/50',
      };
    case 'amber':
    default:
      return {
        primaryBg: 'bg-amber-600',
        primaryHoverBg: 'hover:bg-amber-700',
        primaryText: 'text-amber-600',
        primaryBorder: 'border-amber-500',
        primaryRing: 'focus:ring-amber-500',
        gradientFrom: 'from-amber-600',
        accentBg: 'bg-amber-50',
        lightBg: 'bg-amber-50/50',
      };
  }
}
