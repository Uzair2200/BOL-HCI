import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { TrophyIcon, AwardIcon, TrendingUpIcon, CalendarIcon, StarIcon, ZapIcon } from "../components/AppIcons";

export default function Profile() {
  const stats = {
    level: 12,
    xp: 1850,
    nextLevelXp: 2000,
    streak: 7,
    diamonds: 245,
    totalActivities: 156,
    perfectScores: 45,
    wordsLearned: 342,
  };

  const achievements = [
    { icon: "🔥", title: "7 Day Streak", desc: "Practice 7 days in a row", unlocked: true },
    { icon: "⭐", title: "Rising Star", desc: "Reach Level 10", unlocked: true },
    { icon: "💎", title: "Gem Collector", desc: "Collect 200 diamonds", unlocked: true },
    { icon: "📚", title: "Bookworm", desc: "Complete 10 stories", unlocked: false },
    { icon: "🎯", title: "Perfect Score", desc: "Get 100% on any activity", unlocked: true },
    { icon: "🌟", title: "Vocabulary Master", desc: "Learn 500 words", unlocked: false },
  ];

  const recentActivity = [
    { activity: "Feed", xp: 30, time: "2 hours ago", emoji: "🍎" },
    { activity: "Morning Greeting", xp: 25, time: "Today", emoji: "🌅" },
    { activity: "Play", xp: 40, time: "Yesterday", emoji: "🎮" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <TopBar />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 mb-6 border-2 border-purple-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B7FFF] to-[#B3A4FF] flex items-center justify-center text-white text-3xl font-bold shadow-lg">U</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">Uzair Ahmed</h1>
              <div className="flex items-center gap-2">
                <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Level {stats.level}
                </div>
                <TrophyIcon className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="bg-white rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">XP Progress</span>
              <span className="text-sm font-semibold text-purple-600">
                {stats.xp}/{stats.nextLevelXp}
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 border-2 border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Streak</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.streak}</p>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <StarIcon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Perfect</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.perfectScores}</p>
            <p className="text-xs text-muted-foreground mt-1">perfect scores</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <ZapIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Activities</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.totalActivities}</p>
            <p className="text-xs text-muted-foreground mt-1">completed</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Words</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.wordsLearned}</p>
            <p className="text-xs text-muted-foreground mt-1">learned</p>
          </div>
        </div>

        {/* Pet Collection */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">My Pet</h2>
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-100">
            <div className="flex justify-center mb-4">
              <PetDisplay mood="happy" size="md" />
            </div>
            <h3 className="text-center font-bold text-xl mb-1">Panda</h3>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Your learning companion since March 2026
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-red-50 rounded-xl p-2 text-center border border-red-100">
                <p className="text-xs text-muted-foreground">Health</p>
                <p className="font-bold text-red-600">85%</p>
              </div>
              <div className="bg-green-50 rounded-xl p-2 text-center border border-green-100">
                <p className="text-xs text-muted-foreground">Hunger</p>
                <p className="font-bold text-green-600">45%</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-2 text-center border border-yellow-100">
                <p className="text-xs text-muted-foreground">Happy</p>
                <p className="font-bold text-yellow-600">92%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-4 border-2 ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 flex items-center gap-4 border-2 border-purple-100">
                <div className="text-3xl">{item.emoji}</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.activity}</h4>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-purple-600">
                    <AwardIcon className="w-4 h-4" />
                    <span className="font-semibold">+{item.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}