import { motion } from "motion/react";
import { ZapIcon, ClockIcon } from "../components/AppIcons";
import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { PromptCard } from "../components/PromptCard";
import { FeedbackCard } from "../components/FeedbackCard";
import { RewardCard } from "../components/RewardCard";

export default function Play() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showReward, setShowReward] = useState(false);

  const games = [
    { id: "category", title: "Category Sprint", emoji: "🏃", color: "bg-yellow-50", borderColor: "border-yellow-200" },
    { id: "synonym", title: "Synonyms", emoji: "🔄", color: "bg-blue-50", borderColor: "border-blue-200" },
    { id: "antonym", title: "Antonyms", emoji: "⚖️", color: "bg-purple-50", borderColor: "border-purple-200" },
    { id: "chain", title: "Word Chain", emoji: "🔗", color: "bg-green-50", borderColor: "border-green-200" },
  ];

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate game play
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRecording(false);
            setShowReward(true);
            return 0;
          }
          return prev - 1;
        });
        if (Math.random() > 0.7) {
          setScore(prev => prev + 1);
        }
      }, 1000);
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center p-6">
          <RewardCard
            xp={score * 5}
            diamonds={Math.floor(score / 2)}
            message={`You scored ${score} points! Dino had so much fun!`}
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        
        <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Play Time</span>
            </div>
            <h1 className="text-2xl font-bold">Play Games! 🎮</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a word game to play with Dino
            </p>
          </div>

          <div className="mb-6">
            <PetDisplay mood="excited" size="lg" />
          </div>

          <div className="space-y-3">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game.id)}
                className={`w-full ${game.color} border-2 ${game.borderColor} rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform active:scale-98`}
              >
                <div className="text-4xl">{game.emoji}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-lg">{game.title}</h3>
                  <p className="text-sm text-muted-foreground">Tap to play</p>
                </div>
                <ZapIcon className="w-6 h-6 text-amber-500" />
              </button>
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <ZapIcon className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <ClockIcon className="w-4 h-4 text-red-500" />
              <span className="font-semibold">{timeLeft}s</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Category Sprint 🏃</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Say as many words in this category as you can!
          </p>
        </div>

        <div className="mb-6">
          <PromptCard title="Category:" color="yellow">
            <div className="bg-white rounded-2xl p-6 mt-3 text-center">
              <p className="text-3xl font-bold">ANIMALS 🦁</p>
            </div>
          </PromptCard>
        </div>

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-2xl p-4 border-2 border-amber-200">
              <p className="text-center text-sm font-medium mb-3">Words recognized:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Dog", "Cat", "Lion", "Elephant", "Tiger"].slice(0, score).map((word, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
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
              {isRecording ? "Keep going!" : "Tap to start"}
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}