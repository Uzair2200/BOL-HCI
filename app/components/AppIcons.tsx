// Custom unified icon system for Project Bol
// All icons designed with consistent rounded style, 2px stroke, and premium game aesthetic

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

// ============ CARE ICONS ============

export function ToothbrushIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <rect x="5" y="3" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="6" y="9" width="2" height="12" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M13 5H18C19.1046 5 20 5.89543 20 7V7C20 8.10457 19.1046 9 18 9H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="13" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ============ NAVIGATION & CORE ============

export function HomeIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M3 12L5 10M5 10L12 4L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UserIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 20C5 16.6863 7.68629 14 11 14H13C16.3137 14 19 16.6863 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function TrophyIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M6 9C4.34315 9 3 7.65685 3 6V5C3 4.44772 3.44772 4 4 4H6M18 9C19.6569 9 21 7.65685 21 6V5C21 4.44772 20.5523 4 20 4H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 4V9C6 12.3137 8.68629 15 12 15C15.3137 15 18 12.3137 18 9V4H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 20H15M12 15V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function BookOpenIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 7V19M12 7C12 5.89543 11.1046 5 10 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H10C11.1046 20 12 19.1046 12 19M12 7C12 5.89543 12.8954 5 14 5H18C19.1046 5 20 5.89543 20 7V18C20 19.1046 19.1046 20 18 20H14C12.8954 20 12 19.1046 12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ============ TOP BAR STATS ============

export function FlameIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 3C12 3 8 7 8 11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11C16 7 12 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15C12 15 9.5 17 9.5 19C9.5 20.3807 10.6193 21.5 12 21.5C13.3807 21.5 14.5 20.3807 14.5 19C14.5 17 12 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function GemIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M6 3L4 9L12 21L20 9L18 3H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 21L4 9H20L12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 3L10 9M16 3L14 9M12 9V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function AwardIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 15L7 21L12 18L17 21L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="2" fill="currentColor"/>
    </svg>
  );
}

export function StarIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 2L14.5 9H22L16 14L18.5 21L12 16L5.5 21L8 14L2 9H9.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ============ ACTIVITY ICONS ============

export function SunIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2V4M12 20V22M22 12H20M4 12H2M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function MoonIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M21 12.79C20.8 13.92 20.35 14.98 19.69 15.89C17.75 18.67 14.54 20.5 10.92 20.5C5.91 20.5 1.84 16.43 1.84 11.42C1.84 7.8 3.67 4.59 6.45 2.65C7.36 1.99 8.42 1.54 9.55 1.34C9.18 2.4 9 3.53 9 4.71C9 9.72 13.07 13.79 18.08 13.79C19.26 13.79 20.39 13.61 21.45 13.24C21.25 13.37 21.13 13.57 21 13.79V12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UtensilsIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M6 2V12C6 12 6 14 8 14C10 14 10 12 10 12V2M8 14V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 2V10C17 11.1046 16.1046 12 15 12C15 12 15 12 15 12V22M15 2H18M15 5H18M15 8H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BathIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M3 12H21M5 12V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 6C7 4.89543 7.89543 4 9 4C10.1046 4 11 4.89543 11 6V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="7" cy="15" r="1" fill="currentColor"/>
      <circle cx="11" cy="15" r="1" fill="currentColor"/>
      <circle cx="15" cy="15" r="1" fill="currentColor"/>
    </svg>
  );
}

export function PlayIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M6 4L18 12L6 20V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export function SparklesIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 3L13.5 8L18 9.5L13.5 11L12 16L10.5 11L6 9.5L10.5 8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 4L19.5 6L21 6.5L19.5 7L19 9L18.5 7L17 6.5L18.5 6L19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 15L19.5 17L21 17.5L19.5 18L19 20L18.5 18L17 17.5L18.5 17L19 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function HeartIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.99872 7.05 2.99872C5.59096 2.99872 4.19169 3.5783 3.16 4.61C2.1283 5.64169 1.54872 7.04097 1.54872 8.5C1.54872 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MapPinIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export function StethoscopeIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M5 3V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V3M5 3H3M5 3H7M19 3H21M19 3H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M19 20V22C19 22 16 22 14 22C12 22 12 20 12 20V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function PenLineIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M17 3C17.5304 2.46957 18.2652 2.17157 19.03 2.17157C19.7948 2.17157 20.5296 2.46957 21.06 3C21.5904 3.53043 21.8884 4.26522 21.8884 5.03C21.8884 5.79478 21.5904 6.52957 21.06 7.06L7.5 20.61L3 22L4.39 17.5L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 5L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SproutIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 22V12M12 12C12 8 8 6 8 6C8 6 8 9 8 11C8 11.5 7.5 12 7 12C6.5 12 6 11.5 6 11C6 9 6 6 6 6C6 6 2 8 2 12C2 14.21 3.79 16 6 16H12M12 12C12 8 16 6 16 6C16 6 16 9 16 11C16 11.5 16.5 12 17 12C17.5 12 18 11.5 18 11C18 9 18 6 18 6C18 6 22 8 22 12C22 14.21 20.21 16 18 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MicIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 11C5 11 5 16 12 16C19 16 19 11 19 11M12 16V21M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MicOffIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M3 3L21 21M15 9.34V5C15 3.34315 13.6569 2 12 2C10.7857 2 9.73731 2.71779 9.26677 3.76122M12 17C8.13401 17 5 13.866 5 10V9M19 10V11C19 11.79 18.86 12.55 18.61 13.26M12 17V21M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13V14C9 15.6569 10.3431 17 12 17C12.3453 17 12.6804 16.9543 13 16.8689" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SwordsIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M14.5 6.5L17.5 3.5L20.5 6.5L17.5 9.5L14.5 6.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9.5 17.5L6.5 20.5L3.5 17.5L6.5 14.5L9.5 17.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M14.5 6.5L6.5 14.5M17.5 9.5L9.5 17.5M20.5 6.5L15 12M12 15L6.5 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function HeadphonesIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M3 14V12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="2" y="14" width="5" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="17" y="14" width="5" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

// ============ FEEDBACK & STATUS ============

export function CheckCircleIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function XCircleIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function LightbulbIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M9 18H15M12 3V4M18.36 5.64L17.66 6.34M21 12H20M18.36 18.36L17.66 17.66M5.64 5.64L6.34 6.34M4 12H3M5.64 18.36L6.34 17.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 15C7.5 13.5 7 12 7 10C7 7.23858 9.23858 5 12 5C14.7614 5 17 7.23858 17 10C17 12 16.5 13.5 15 15V17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 21H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function TrendingUpIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M22 7L15 14L11 10L2 19M22 7H16M22 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ZapIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ClockIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function Volume2Icon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CalendarIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 10H21M8 2V6M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="8" cy="15" r="1" fill="currentColor"/>
      <circle cx="12" cy="15" r="1" fill="currentColor"/>
      <circle cx="16" cy="15" r="1" fill="currentColor"/>
    </svg>
  );
}

export function DropletIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 2.69L17.66 8.35C19.78 10.47 19.78 13.91 17.66 16.03C15.54 18.15 12.1 18.15 9.98 16.03C7.86 13.91 7.86 10.47 9.98 8.35L12 2.69Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AlertCircleIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function BriefcaseIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function UsersIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 21C2 17.6863 4.68629 15 8 15H10C13.3137 15 16 17.6863 16 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 4C17.6569 4 19 5.34315 19 7C19 8.65685 17.6569 10 16 10M22 21C22 18.2386 19.7614 16 17 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function ChevronRightIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}