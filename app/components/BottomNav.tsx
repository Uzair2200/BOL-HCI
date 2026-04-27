import { HomeIcon, UserIcon, UsersIcon, BookOpenIcon } from "./AppIcons";
import { useNavigate, useLocation } from "react-router";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/home" },
    { icon: BookOpenIcon, label: "Learn", path: "/story" },
    { icon: UsersIcon, label: "Friends", path: "/rankings" },
    { icon: UserIcon, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/rankings"
              ? location.pathname.startsWith("/rankings")
              : location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive 
                  ? "bg-[#8B7FFF] text-white" 
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}