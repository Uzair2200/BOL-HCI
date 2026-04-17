import { motion } from "motion/react";
import { SwordsIcon, TrophyIcon, UsersIcon } from "../components/AppIcons";
import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";

export default function ChallengeMode() {
  const [stage, setStage] = useState<"lobby" | "battle" | "result">("lobby");
  const [isRecording, setIsRecording] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const startBattle = () => {
    setStage("battle");
  };

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const score = Math.floor(Math.random() * 50) + 50;
        setMyScore(myScore + score);
        setOpponentScore(opponentScore + Math.floor(Math.random() * 40) + 40);
        
        if (myScore + opponentScore > 200) {
          setTimeout(() => setStage("result"), 1500);
        }
      }, 3000);
    }
  };

  if (stage === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        
        <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <SwordsIcon className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-muted-foreground">1v1 Battle</span>
            </div>
            <h1 className="text-2xl font-bold">Challenge Mode ⚔️</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Battle a friend on the same speaking task
            </p>
          </div>

          <div className="mb-6">
            <PetDisplay mood="excited" size="lg" />
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-pink-200 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <UsersIcon className="w-6 h-6 text-pink-500" />
              <h3 className="font-semibold">Online Players</h3>
            </div>
            <div className="space-y-3">
              {["Alex (Level 12)", "Emma (Level 10)", "Sam (Level 15)"].map((player, idx) => (
                <button
                  key={idx}
                  onClick={startBattle}
                  className="w-full bg-pink-50 hover:bg-pink-100 transition-colors rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                      {player.charAt(0)}
                    </div>
                    <span className="font-medium">{player}</span>
                  </div>
                  <SwordsIcon className="w-5 h-5 text-pink-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  if (stage === "result") {
    const won = myScore > opponentScore;
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 shadow-lg border-2 border-pink-100 max-w-sm w-full"
          >
            <div className="text-center">
              <TrophyIcon className={`w-20 h-20 mx-auto mb-4 ${won ? "text-yellow-500" : "text-gray-400"}`} />
              <h2 className="text-3xl font-bold mb-2">{won ? "You Won! 🎉" : "Good Try!"}</h2>
              <p className="text-muted-foreground mb-6">
                {won ? "Congratulations on your victory!" : "Keep practicing to win next time!"}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                  <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                  <p className="text-3xl font-bold text-green-600">{myScore}</p>
                </div>
                <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                  <p className="text-sm text-muted-foreground mb-1">Opponent Score</p>
                  <p className="text-3xl font-bold text-pink-600">{opponentScore}</p>
                </div>
              </div>

              {won && (
                <div className="bg-yellow-50 rounded-2xl p-3 mb-6 border-2 border-yellow-200">
                  <p className="text-sm font-semibold">Reward: +50 XP, +20 💎</p>
                </div>
              )}

              <button
                onClick={() => window.history.back()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-2xl"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center mb-4">Category: COLORS 🎨</h1>
          
          {/* Score Display */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200 text-center">
              <p className="text-sm text-muted-foreground mb-1">You</p>
              <p className="text-3xl font-bold text-green-600">{myScore}</p>
            </div>
            <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200 text-center">
              <p className="text-sm text-muted-foreground mb-1">Opponent</p>
              <p className="text-3xl font-bold text-pink-600">{opponentScore}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 border-2 border-pink-200">
            <p className="text-center font-medium">Say as many color names as you can!</p>
          </div>
        </div>

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Battle in progress...</span>
            </div>
          </motion.div>
        )}

        <div className="flex justify-center">
          <div className="text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
              {isRecording ? "Keep going!" : "Tap to speak"}
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}