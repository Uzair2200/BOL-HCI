import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { useNavigate } from "react-router";
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

  const activities: ActivityCard[] = [
    { 
      id: "greeting", 
      title: "Morning Greeting", 
      icon: SunIcon, 
      color: "#F59E0B", 
      bgColor: "bg-amber-200",
      path: "/morning-greeting",
      status: "urgent"
    },
    { 
      id: "brush", 
      title: "Brush", 
      icon: ToothbrushIcon, 
      color: "#2563EB", 
      bgColor: "bg-blue-200",
      path: "/brush"
    },
    { 
      id: "feed", 
      title: "Feed", 
      icon: UtensilsIcon, 
      color: "#059669", 
      bgColor: "bg-emerald-200",
      path: "/feed",
      status: "urgent"
    },
    { 
      id: "bath", 
      title: "Bath", 
      icon: BathIcon, 
      color: "#0891B2", 
      bgColor: "bg-cyan-200",
      path: "/bath"
    },
    { 
      id: "play", 
      title: "Play", 
      icon: PlayIcon, 
      color: "#E11D48", 
      bgColor: "bg-rose-200",
      path: "/play"
    },
    { 
      id: "walk", 
      title: "Walk", 
      icon: MapPinIcon, 
      color: "#16A34A", 
      bgColor: "bg-green-200",
      path: "/walk"
    },
    { 
      id: "tricks", 
      title: "Tricks", 
      icon: SparklesIcon, 
      color: "#9333EA", 
      bgColor: "bg-purple-200",
      path: "/tricks"
    },
    { 
      id: "story", 
      title: "Story Time", 
      icon: BookOpenIcon, 
      color: "#4338CA", 
      bgColor: "bg-indigo-200",
      path: "/story"
    },
    { 
      id: "sleep", 
      title: "Sleep", 
      icon: MoonIcon, 
      color: "#7C3AED", 
      bgColor: "bg-violet-200",
      path: "/sleep"
    },
  ];

  const moreActivities: ActivityCard[] = [
    { id: "diary", title: "Pet Diary", icon: PenLineIcon, color: "#E11D48", bgColor: "bg-rose-200", path: "/diary" },
    { id: "garden", title: "Pet Garden", icon: SproutIcon, color: "#16A34A", bgColor: "bg-green-200", path: "/garden" },
    { id: "vet", title: "Vet Visit", icon: StethoscopeIcon, color: "#D97706", bgColor: "bg-amber-200", path: "/vet" },
    { id: "interview", title: "Interview", icon: MicIcon, color: "#7C3AED", bgColor: "bg-purple-200", path: "/interview" },
    { id: "challenge", title: "Challenge", icon: SwordsIcon, color: "#C026D3", bgColor: "bg-fuchsia-200", path: "/challenge" },
    { id: "listen", title: "Listen & Learn", icon: HeadphonesIcon, color: "#0284C7", bgColor: "bg-sky-200", path: "/listen" },
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
      
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Pet Display Area */}
        <div className="relative px-6 py-8 bg-gradient-to-b from-purple-100/40 to-transparent">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold mb-1">Hello, Uzair! 👋</h1>
            <p className="text-sm text-muted-foreground">Your panda is happy to see you!</p>
          </div>
          
          <PetDisplay mood="happy" size="lg" />
          
          {/* Needs Bar */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartIcon className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium">Health</span>
              </div>
              <span className="text-sm text-muted-foreground">85%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-400 to-pink-400" style={{ width: "85%" }} />
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <UtensilsIcon className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Hunger</span>
              </div>
              <span className="text-sm text-muted-foreground">45%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400" style={{ width: "45%" }} />
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Happiness</span>
              </div>
              <span className="text-sm text-muted-foreground">92%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400" style={{ width: "92%" }} />
            </div>
          </div>
        </div>

        {/* Daily Activities */}
        <div className="px-6 py-6">
          <h2 className="text-[20px] font-bold mb-4">Daily Care</h2>
          <div className="grid grid-cols-3 gap-3">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <button
                  key={activity.id}
                  onClick={() => navigate(activity.path)}
                  className={`relative ${activity.bgColor} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform active:scale-95`}
                >
                  {getStatusBadge(activity.status)}
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: activity.color + "20" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: activity.color }} />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{activity.title}</span>
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
                  className={`w-full ${activity.bgColor} rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform active:scale-98`}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: activity.color + "20" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: activity.color }} />
                  </div>
                  <span className="font-medium">{activity.title}</span>
                  <svg className="w-5 h-5 ml-auto text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
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