import { useMemo, useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";

const users = [
  "sam_speaks",
  "alex_english",
  "leo_reads",
  "maya_words",
  "zara_talks",
  "bolbuddy01",
  "grammarfox",
  "sunnypanda",
];

export default function AddFriends() {
  const [query, setQuery] = useState("");
  const [addedUsers, setAddedUsers] = useState<string[]>([]);
  const [popupUser, setPopupUser] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return users;
    return users.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const handleAddFriend = (username: string) => {
    if (addedUsers.includes(username)) return;
    setAddedUsers((prev) => [...prev, username]);
    setPopupUser(username);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      <TopBar showBack />

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28">
        <h1 className="mb-5 text-xl font-bold text-[#3F2F63]">Add Friends</h1>

        <p className="mb-3 text-sm text-[#6F5F8E]">Search by username</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type username..."
          className="w-full rounded-2xl border border-[#D9CFC0] bg-[#FFF9F0] px-4 py-3 text-sm outline-none focus:border-violet-400"
        />

        <div className="mt-4 space-y-3">
          {results.map((username) => {
            const isAdded = addedUsers.includes(username);
            return (
              <div
                key={username}
                className="flex items-center justify-between rounded-2xl border border-[#E7DDCF] bg-[#FFF9F0] px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-[#382A58]">{username}</p>
                  <p className="text-xs text-[#8B7EA6]">Project Bol learner</p>
                </div>
                <button
                  onClick={() => handleAddFriend(username)}
                  disabled={isAdded}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    isAdded
                      ? "border border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border border-violet-400 text-violet-700 hover:bg-violet-50"
                  }`}
                >
                  {isAdded ? "Sent" : "Add"}
                </button>
              </div>
            );
          })}

          {results.length === 0 && (
            <div className="rounded-2xl border border-[#E7DDCF] bg-[#FFF9F0] px-4 py-5 text-center text-sm text-[#7E6EA0]">
              No users found.
            </div>
          )}
        </div>
      </div>

      {popupUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-6">
          <div className="w-full max-w-xs rounded-2xl border border-[#E2D7C6] bg-[#FFF9F0] p-4 text-center">
            <p className="text-base font-semibold text-[#3F2F63]">Friend Request Sent</p>
            <p className="mt-1 text-sm text-[#7D6EA0]">{popupUser} was added to your friends list.</p>
            <button
              onClick={() => setPopupUser(null)}
              className="mt-4 rounded-full border border-violet-400 px-4 py-1.5 text-sm font-semibold text-violet-700 hover:bg-violet-50"
            >
              Nice!
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
