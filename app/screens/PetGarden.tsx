import { motion } from "motion/react";
import { SproutIcon, DropletIcon } from "../components/AppIcons";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { MicButton } from "../components/MicButton";
import { RewardCard } from "../components/RewardCard";
import { useState } from "react";
import { useMic } from "../context/MicContext";

interface Plant {
  word: string;
  growth: number;
  emoji: string;
}

export default function PetGarden() {
  const { isRecording, setIsRecording } = useMic();
  const [showReward, setShowReward] = useState(false);
  const [wateredWord, setWateredWord] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const [plants, setPlants] = useState<Plant[]>([
    { word: "happy", growth: 80, emoji: "🌻" },
    { word: "beautiful", growth: 60, emoji: "🌷" },
    { word: "explore", growth: 40, emoji: "🌱" },
    { word: "adventure", growth: 20, emoji: "🌿" },
  ]);

  const handleMicToggle = () => {
    if (!isRecording && selectedPlant !== null) {
      setIsRecording(true);
    } else if (isRecording) {
      const plantIndex = selectedPlant;
      if (plantIndex === null) return;

      setTimeout(() => {
        setIsRecording(false);
        setPlants(prev => prev.map((p, i) =>
          i === plantIndex ? { ...p, growth: Math.min(100, p.growth + 20) } : p
        ));
        setWateredWord(plants[plantIndex].word);
        setSelectedPlant(null);
        setTimeout(() => setShowReward(true), 500);
      }, 3000);
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center p-6">
          <RewardCard
            xp={15}
            diamonds={5}
            message={`"${wateredWord}" is growing! Keep using it in sentences.`}
            onContinue={() => setShowReward(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <SproutIcon className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Vocabulary Garden</span>
          </div>
          <h1 className="text-2xl font-bold">Pet Garden 🌱</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Grow vocabulary words by using them in sentences
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-6 mb-6 border-2 border-green-200 min-h-64">
          <div className="grid grid-cols-2 gap-4">
            {plants.map((plant, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedPlant(idx)}
                className={`bg-white rounded-2xl p-4 border-2 transition-all ${
                  selectedPlant === idx 
                    ? "border-green-500 scale-105" 
                    : "border-green-200 hover:border-green-300"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl mb-2">{plant.emoji}</div>
                <p className="font-semibold text-sm mb-2">{plant.word}</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-400"
                    animate={{ width: `${plant.growth}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{plant.growth}%</p>
              </motion.button>
            ))}
          </div>
        </div>

        {selectedPlant !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-3xl p-5 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <DropletIcon className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Water this plant!</h3>
              </div>
              <p className="text-sm mb-3">
                Say a sentence using the word <span className="font-bold text-green-600">"{plants[selectedPlant].word}"</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Example: "I feel {plants[selectedPlant].word} when I learn new things!"
              </p>
            </div>
          </motion.div>
        )}

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </motion.div>
        )}

        <div className="mx-auto w-fit text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              disabled={selectedPlant === null}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
              {selectedPlant === null 
                ? "Select a plant to water" 
                : isRecording 
                  ? "Tap to stop" 
                  : "Tap to speak"}
            </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}