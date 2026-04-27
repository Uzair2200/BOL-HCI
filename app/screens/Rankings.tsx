import { useMemo } from "react";
import { useNavigate } from "react-router";
import { AwardIcon, TrophyIcon } from "../components/AppIcons";
import { BottomNav } from "../components/BottomNav";

type Tier = "Beginner" | "Bronze" | "Silver" | "Gold";

interface FriendEntry {
  petName: string;
  ownerName: string;
  level: number;
  avatar: string;
}

const friends: FriendEntry[] = [
  { petName: "Max", ownerName: "Sam", level: 10, avatar: "🐶" },
  { petName: "Buddy", ownerName: "Alex", level: 8, avatar: "🐼" },
  { petName: "Charlie", ownerName: "Leo", level: 7, avatar: "🐱" },
  { petName: "Luna", ownerName: "Maya", level: 6, avatar: "🦊" },
  { petName: "Coco", ownerName: "Zara", level: 5, avatar: "🐰" },
];

function getTier(level: number): Tier {
  if (level >= 9) return "Gold";
  if (level >= 7) return "Silver";
  if (level >= 4) return "Bronze";
  return "Beginner";
}

function tierStyles(tier: Tier): string {
  if (tier === "Gold") return "bg-amber-200 text-amber-900 border border-amber-300";
  if (tier === "Silver") return "bg-slate-200 text-slate-800 border border-slate-300";
  if (tier === "Bronze") return "bg-orange-200 text-orange-900 border border-orange-300";
  return "bg-violet-200 text-violet-900 border border-violet-300";
}

function rankLabel(index: number): string {
  const rank = index + 1;
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

export default function Rankings() {
  const navigate = useNavigate();

  const sortedFriends = useMemo(() => {
    return [...friends].sort((a, b) => b.level - a.level);
  }, []);

  const yourLevel = 4;
  const yourTier = getTier(yourLevel);
  const streakBars = [1, 1, 1, 1, 1];

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      <div className="sticky top-0 z-20 bg-[#F5F0E8]/95 border-b border-[#E6DDCE] px-5 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#3F2F63]">Friends Rankings</h1>
          <button
            onClick={() => navigate("/rankings/add-friends")}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            style={{
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Friends</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
        <div className="rounded-3xl border-2 border-violet-300 bg-[#FFF9F0] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-[#3F2F63]">
              <span className="text-xl" aria-hidden>
                🐾
              </span>
              <span className="font-semibold">Your Pet</span>
            </div>

            <div className="inline-flex items-center justify-end gap-2 text-right">
              <div className="inline-flex items-center gap-1 text-violet-700 font-bold">
                <AwardIcon className="w-4 h-4" />
                <span>Lvl 4</span>
              </div>
              <div className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tierStyles(yourTier)}`}>
                {yourTier}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-end gap-1.5">
            {streakBars.map((_, idx) => (
              <div
                key={idx}
                className="w-2 rounded-full bg-violet-500"
                style={{ height: `${10 + idx * 3}px`, opacity: 0.85 }}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-[#5D4B81]">Total XP</span>
            <span className="text-sm font-bold text-amber-700">600 xp</span>
          </div>

          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#E9DEC9]">
            <div className="h-full w-[60%] rounded-full bg-amber-500" />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-[#3F2F63]">
            <TrophyIcon className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold">Friends Leaderboard</h2>
          </div>

          <div className="relative">
            <div className="max-h-[52vh] overflow-y-auto space-y-3 pr-1">
              {sortedFriends.map((friend, index) => {
                const tier = getTier(friend.level);
                return (
                  <div
                    key={`${friend.petName}-${friend.ownerName}`}
                    className="rounded-2xl border border-[#E7DDCF] bg-[#FFF9F0] px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 text-sm font-semibold text-[#6E5B91]">{rankLabel(index)}</div>

                      <div className="h-10 w-10 flex-shrink-0 rounded-full border border-[#E4D9CA] bg-[#F3ECE2] flex items-center justify-center text-lg">
                        {friend.avatar}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-[#342554] leading-tight">{friend.petName}</p>
                        <p className="text-xs text-[#8B7EA6]">Owner: {friend.ownerName}</p>
                      </div>

                      <div className="ml-auto text-right">
                        <p className="text-xs font-semibold text-[#5A497B]">Lvl {friend.level}</p>
                        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tierStyles(tier)}`}>
                          {tier}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F5F0E8] to-transparent" />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
