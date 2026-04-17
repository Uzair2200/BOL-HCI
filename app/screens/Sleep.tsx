import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { PromptCard } from "../components/PromptCard";
import { RewardCard } from "../components/RewardCard";
import { motion } from "motion/react";

export default function Sleep() {
  const [isRecording, setIsRecording] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const story = "The little dragon loved to fly among the clouds. Every evening, it would soar high above the mountains, watching the sunset paint the sky in beautiful colors.";

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      const interval = setInterval(() => {
        setReadingTime(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsRecording(false);
            setTimeout(() => setShowReward(true), 1500);
            return 100;
          }
          return prev + 10;
        });
      }, 800);
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center p-6">
          <RewardCard
            xp={25}
            diamonds={7}
            message="Dino is fast asleep! Sweet dreams! 💤"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#7E68B5] via-[#8B73C2] to-[#BDA9DF] flex flex-col">
      {/* Decorative nighttime bedroom background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Lavender wall depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.16),rgba(255,255,255,0)_55%)]" />

        {/* Window with dark sky */}
        <div className="absolute left-10 top-16 h-28 w-24 rounded-xl border-4 border-white/80 bg-[#1D2543] shadow-md" />
        <div className="absolute left-[4.7rem] top-16 h-28 w-1 bg-white/70" />
        <div className="absolute left-10 top-[5.8rem] h-1 w-24 bg-white/70" />

        {/* Crescent moon */}
        <div className="absolute left-[4.35rem] top-[5.2rem] h-6 w-6 rounded-full bg-[#F8E8A5]" />
        <div className="absolute left-[4.65rem] top-[5.1rem] h-6 w-6 rounded-full bg-[#1D2543]" />

        {/* Stars */}
        <div className="absolute left-[4.2rem] top-[7.1rem] h-1.5 w-1.5 rounded-full bg-white/90" />
        <div className="absolute left-[5.9rem] top-[6.9rem] h-1 w-1 rounded-full bg-white/85" />
        <div className="absolute left-[5.1rem] top-[8.25rem] h-1 w-1 rounded-full bg-white/85" />
        <div className="absolute left-[6.4rem] top-[8rem] h-1.5 w-1.5 rounded-full bg-white/90" />

        {/* Bed (center-right) */}
        <div className="absolute right-8 bottom-24 h-24 w-[62%] rounded-3xl bg-[#E7E2F6] shadow-[0_14px_24px_rgba(35,28,65,0.28)]" />
        <div className="absolute right-8 bottom-[10.2rem] h-10 w-[62%] rounded-t-2xl bg-[#B89DDD]" />
        <div className="absolute right-12 bottom-[9rem] h-8 w-20 rounded-xl bg-white/85" />
        <div className="absolute right-[8.6rem] bottom-[9rem] h-8 w-20 rounded-xl bg-[#D8C8EE]/95" />

        {/* Nightstand + nightlight */}
        <div className="absolute left-10 bottom-28 h-12 w-14 rounded-lg bg-[#8C72BE]/80" />
        <div className="absolute left-[3.45rem] bottom-[9.8rem] h-4 w-6 rounded-full bg-[#FFE1A8]/95" />
        <div className="absolute left-[2.75rem] bottom-[8.9rem] h-16 w-16 rounded-full bg-[#FFD9A1]/45 blur-xl" />

        {/* Floor */}
        <div className="absolute bottom-0 left-0 h-36 w-full bg-gradient-to-b from-[#A490CB]/60 to-[#8E79BA]/80" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Bedtime Story</span>
          </div>
          <h1 className="text-2xl font-bold">Bedtime! 🌙</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Read aloud to help Dino fall asleep
          </p>
        </div>

        {/* Sleep Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Sleep Progress</span>
            <span className="text-sm text-muted-foreground">{readingTime}%</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
              animate={{ width: `${readingTime}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="mb-6">
          <PetDisplay 
            mood={readingTime > 50 ? "sleepy" : "happy"} 
            size="lg" 
          />
        </div>

        <div className="mb-6">
          <PromptCard title="Read This Story:" color="purple">
            <div className="bg-white rounded-2xl p-5 mt-3">
              <p className="text-base leading-relaxed">
                {story}
              </p>
            </div>
          </PromptCard>
        </div>

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Keep reading...</span>
            </div>
          </motion.div>
        )}

        <div className="flex justify-center">
          <div className="text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              disabled={readingTime === 100}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
              {isRecording ? "Reading..." : "Tap to start reading"}
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
      </div>
    </div>
  );
}
