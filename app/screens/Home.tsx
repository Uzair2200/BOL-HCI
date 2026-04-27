import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useRef } from "react";
import { 
  SunIcon, UtensilsIcon, BathIcon, MoonIcon, PlayIcon, 
  MapPinIcon, StethoscopeIcon, SparklesIcon, BookOpenIcon, 
  PenLineIcon, SproutIcon, HeartIcon, MicIcon, SwordsIcon, HeadphonesIcon,
  ToothbrushIcon 
} from "../components/AppIcons";

interface ActivityCard {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  path: string;
  status?: "urgent" | "ready" | "locked";
}

export default function Home() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dailyCareRef = useRef<HTMLDivElement>(null);

  const handleScrollIndicatorClick = () => {
    if (dailyCareRef.current) {
      dailyCareRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    scrollContainerRef.current?.scrollBy({ top: 360, behavior: "smooth" });
  };

  const activities: ActivityCard[] = [
    { 
      id: "greeting", 
      title: "Morning Greeting", 
      icon: SunIcon, 
      color: "#D97706", 
      bgColor: "bg-amber-300",
      path: "/morning-greeting",
      status: "urgent"
    },
    { 
      id: "brush", 
      title: "Brush", 
      icon: ToothbrushIcon, 
      color: "#1D4ED8", 
      bgColor: "bg-blue-300",
      path: "/brush"
    },
    { 
      id: "feed", 
      title: "Feed", 
      icon: UtensilsIcon, 
      color: "#047857", 
      bgColor: "bg-emerald-300",
      path: "/feed",
      status: "urgent"
    },
    { 
      id: "bath", 
      title: "Bath", 
      icon: BathIcon, 
      color: "#0E7490", 
      bgColor: "bg-cyan-300",
      path: "/bath"
    },
    { 
      id: "play", 
      title: "Play", 
      icon: PlayIcon, 
      color: "#BE123C", 
      bgColor: "bg-rose-300",
      path: "/play"
    },
    { 
      id: "walk", 
      title: "Walk", 
      icon: MapPinIcon, 
      color: "#65A30D", 
      bgColor: "bg-lime-300",
      path: "/walk"
    },
    { 
      id: "tricks", 
      title: "Tricks", 
      icon: SparklesIcon, 
      color: "#7E22CE", 
      bgColor: "bg-purple-300",
      path: "/tricks"
    },
    { 
      id: "story", 
      title: "Story Time", 
      icon: BookOpenIcon, 
      color: "#3730A3", 
      bgColor: "bg-indigo-300",
      path: "/story"
    },
    { 
      id: "sleep", 
      title: "Sleep", 
      icon: MoonIcon, 
      color: "#6D28D9", 
      bgColor: "bg-violet-300",
      path: "/sleep"
    },
  ];

  const moreActivities: ActivityCard[] = [
    { id: "diary", title: "Pet Diary", icon: PenLineIcon, color: "#BE123C", bgColor: "bg-rose-300", path: "/diary" },
    { id: "garden", title: "Pet Garden", icon: SproutIcon, color: "#15803D", bgColor: "bg-green-300", path: "/garden" },
    { id: "vet", title: "Vet Visit", icon: StethoscopeIcon, color: "#B45309", bgColor: "bg-amber-300", path: "/vet" },
    { id: "interview", title: "Interview", icon: MicIcon, color: "#6D28D9", bgColor: "bg-purple-300", path: "/interview" },
    { id: "challenge", title: "Challenge", icon: SwordsIcon, color: "#A21CAF", bgColor: "bg-fuchsia-300", path: "/challenge" },
    { id: "listen", title: "Listen & Learn", icon: HeadphonesIcon, color: "#0369A1", bgColor: "bg-sky-300", path: "/listen" },
  ];

  const needsStats = [
    {
      label: "Health",
      value: 85,
      color: "#F87171",
      trackColor: "#FEE2E2",
      icon: HeartIcon,
      iconColor: "#EF4444",
    },
    {
      label: "Hunger",
      value: 45,
      color: "#34D399",
      trackColor: "#D1FAE5",
      icon: UtensilsIcon,
      iconColor: "#10B981",
    },
    {
      label: "Happiness",
      value: 92,
      color: "#F59E0B",
      trackColor: "#FEF3C7",
      icon: SparklesIcon,
      iconColor: "#F59E0B",
    },
  ];

  const getStatusBadge = (status?: string) => {
    if (status === "urgent") {
      return (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <TopBar />
      
      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #E5D4C1;
          border-radius: 10px;
          margin: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8B7FFF;
          border-radius: 10px;
          border: 2px solid #E5D4C1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7269E8;
        }
      `}</style>
      
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        {/* Pet Display Area */}
        <div className="relative px-6 py-8 bg-gradient-to-b from-purple-100/40 to-transparent">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold mb-1">Hello, Uzair! 👋</h1>
            <p className="text-sm text-muted-foreground">Your panda is happy to see you!</p>
          </div>
          
          <PetDisplay mood="happy" size="lg" />
          
          {/* Needs - 3D circular meters */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            {needsStats.map((stat) => {
              const Icon = stat.icon;
              const size = 88;
              const stroke = 9;
              const radius = (size - stroke) / 2;
              const circumference = 2 * Math.PI * radius;
              const progressOffset = circumference * (1 - stat.value / 100);

              return (
                <div
                  key={stat.label}
                  className="relative rounded-2xl px-2 py-3 text-center"
                  style={{
                    background: "linear-gradient(160deg, rgba(255,255,255,0.95), rgba(246,241,235,0.95))",
                    boxShadow: "inset 0 2px 5px rgba(255,255,255,0.95), inset 0 -3px 6px rgba(156,132,110,0.18), 0 8px 18px rgba(111,89,66,0.15)",
                  }}
                >
                  <div className="relative mx-auto mb-2" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="-rotate-90">
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={stat.trackColor}
                        strokeWidth={stroke}
                      />
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={stat.color}
                        strokeLinecap="round"
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={progressOffset}
                        style={{
                          filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.18))",
                          transition: "stroke-dashoffset 0.6s ease",
                        }}
                      />
                    </svg>

                    <div
                      className="absolute inset-[15px] rounded-full flex flex-col items-center justify-center"
                      style={{
                        background: "radial-gradient(circle at 30% 25%, #ffffff 0%, #f3efe9 70%, #e4d8ca 100%)",
                        boxShadow: "inset 0 3px 6px rgba(255,255,255,0.95), inset 0 -4px 6px rgba(120,98,77,0.18)",
                      }}
                    >
                      <Icon className="w-4 h-4 mb-0.5" style={{ color: stat.iconColor }} />
                      <span className="text-[11px] font-bold leading-none" style={{ color: stat.iconColor }}>
                        {stat.value}%
                      </span>
                    </div>

                    <div
                      className="absolute top-[14px] left-[18px] w-[36px] h-[16px] rounded-full"
                      style={{
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                        transform: "rotate(-18deg)",
                      }}
                    />
                  </div>

                  <p className="text-xs font-semibold text-slate-700">{stat.label}</p>
                </div>
              );
            })}
          </div>
          
          {/* Scroll indicator */}
          <motion.button
            type="button"
            onClick={handleScrollIndicatorClick}
            onTap={handleScrollIndicatorClick}
            whileTap={{ scale: 0.98 }}
            aria-label="Scroll down to Daily Care activities"
            className="mt-8 block mx-auto cursor-pointer"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-gradient-to-b from-purple-400 to-purple-500 rounded-full px-6 py-3 shadow-lg">
              <div className="text-center">
                <motion.svg 
                  className="w-7 h-7 text-white mx-auto" 
                  fill="none" 
                  strokeWidth="3" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7" opacity="0.5" />
                </motion.svg>
                <p className="text-sm text-white font-bold mt-1.5">Scroll Down</p>
                <p className="text-xs text-white/90 font-medium">More activities below</p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Daily Activities */}
        <div ref={dailyCareRef} className="px-6 py-6">
          <h2 className="text-[20px] font-bold mb-4">Daily Care</h2>
          <div className="grid grid-cols-3 gap-3">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <button
                  key={activity.id}
                  onClick={() => navigate(activity.path)}
                  className={`relative ${activity.bgColor} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95`}
                  style={{
                    border: '2px solid rgba(255,255,255,0.5)',
                  }}
                >
                  {getStatusBadge(activity.status)}
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: activity.color + "40",
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: activity.color, strokeWidth: "2.5" }} />
                  </div>
                  <span className="text-xs font-semibold text-center leading-tight text-gray-800">{activity.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* More Activities */}
        <div className="px-6 pb-6">
          <h2 className="text-[20px] font-bold mb-4">More Activities</h2>
          <div className="space-y-3">
            {moreActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <button
                  key={activity.id}
                  onClick={() => navigate(activity.path)}
                  className={`w-full ${activity.bgColor} rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] active:scale-98`}
                  style={{
                    border: '2px solid rgba(255,255,255,0.5)',
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: activity.color + "40",
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: activity.color, strokeWidth: "2.5" }} />
                  </div>
                  <span className="font-semibold text-gray-800">{activity.title}</span>
                  <svg className="w-5 h-5 ml-auto text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}