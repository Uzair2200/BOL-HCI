import { FlameIcon, GemIcon, AwardIcon } from "./AppIcons";
import { useNavigate } from "react-router";

interface TopBarProps {
  showBack?: boolean;
  streak?: number;
  diamonds?: number;
  xp?: number;
}

export function TopBar({ showBack = false, streak = 7, diamonds = 245, xp = 1850 }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-border/50">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : (
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B7FFF] to-[#B3A4FF] flex items-center justify-center text-white font-semibold shadow-md"
        ><span className="font-bold">U</span></button>
      )}
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
          <FlameIcon className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-700">{streak}</span>
        </div>
        
        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
          <GemIcon className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-blue-700">{diamonds}</span>
        </div>
        
        <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-full">
          <AwardIcon className="w-4 h-4 text-[#8B7FFF]" />
          <span className="text-sm font-semibold text-[#8B7FFF]">{xp}</span>
        </div>
      </div>
    </div>
  );
}