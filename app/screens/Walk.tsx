import { motion } from "motion/react";
import { MapPinIcon } from "../components/AppIcons";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { PromptCard } from "../components/PromptCard";
import { FeedbackCard } from "../components/FeedbackCard";
import { RewardCard } from "../components/RewardCard";
import { useState } from "react";
import { useMic } from "../context/MicContext";

export default function Walk() {
  const [currentScene, setCurrentScene] = useState(0);
  const { isRecording, setIsRecording } = useMic();
  const [hasResponded, setHasResponded] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const scenarios = [
    {
      location: "Coffee Shop ☕",
      situation: "You're ordering a coffee",
      prompt: "Hello! What would you like to order today?",
      expected: "A latte, please"
    },
    {
      location: "Doctor's Office 🏥",
      situation: "The doctor asks how you feel",
      prompt: "How are you feeling today? Any symptoms?",
      expected: "I have a headache"
    },
    {
      location: "Restaurant 🍽️",
      situation: "The waiter takes your order",
      prompt: "Are you ready to order?",
      expected: "Yes, I'll have the pasta"
    }
  ];

  const current = scenarios[currentScene];

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setHasResponded(true);
      setTimeout(() => {
        if (currentScene < scenarios.length - 1) {
          setCurrentScene(currentScene + 1);
          setHasResponded(false);
        } else {
          setShowReward(true);
        }
      }, 2500);
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center p-6">
          <RewardCard
            xp={40}
            diamonds={12}
            message="Great walk! Dino learned real-life conversations!"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#CFEAFF] via-[#E4F3FF] to-[#F7F2E8] flex flex-col">
      {/* Decorative suburban walk background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Daytime sky glow */}
        <div className="absolute -top-14 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#FFE4A8]/35 blur-2xl" />

        {/* Clouds */}
        <div className="absolute left-10 top-16 h-8 w-20 rounded-full bg-white/85" />
        <div className="absolute left-16 top-13 h-10 w-14 rounded-full bg-white/80" />
        <div className="absolute right-10 top-20 h-8 w-24 rounded-full bg-white/85" />
        <div className="absolute right-24 top-16 h-10 w-14 rounded-full bg-white/80" />

        {/* Trees / bushes along the path */}
        <div className="absolute left-0 top-[11.5rem] h-44 w-12 bg-[#8A6446]/55" />
        <div className="absolute left-[-1rem] top-[8.7rem] h-20 w-20 rounded-full bg-[#6DBB61]/90" />
        <div className="absolute left-8 top-[9.2rem] h-16 w-16 rounded-full bg-[#79C86C]/90" />
        <div className="absolute right-0 top-[12rem] h-42 w-12 bg-[#8A6446]/55" />
        <div className="absolute right-[-0.8rem] top-[9.2rem] h-20 w-20 rounded-full bg-[#68B85D]/90" />
        <div className="absolute right-8 top-[9.6rem] h-16 w-16 rounded-full bg-[#7DCB70]/90" />
        <div className="absolute left-0 bottom-28 h-10 w-full bg-[#7EC56E]/80" />

        {/* Road on one side */}
        <div className="absolute right-0 bottom-0 h-44 w-[38%] bg-[#5B6471]" />
        <div className="absolute right-[7%] bottom-[4.35rem] h-1 w-10 rotate-12 rounded-full bg-white/70" />
        <div className="absolute right-[15%] bottom-[6.1rem] h-1 w-10 rotate-12 rounded-full bg-white/70" />
        <div className="absolute right-[23%] bottom-[7.85rem] h-1 w-10 rotate-12 rounded-full bg-white/70" />

        {/* Sidewalk running horizontally */}
        <div className="absolute left-0 bottom-0 h-36 w-full bg-[#D8D2C8]" />
        <div className="absolute left-0 bottom-[2.4rem] h-[2px] w-full bg-[#C3BCAF]/80" />
        <div className="absolute left-0 bottom-[5.1rem] h-[2px] w-full bg-[#C3BCAF]/80" />

        {/* Pet walking silhouette on pavement */}
        <div className="absolute left-1/2 bottom-[3.5rem] h-12 w-12 -translate-x-1/2 rounded-full bg-[#8ACC77]/90" />
        <div className="absolute left-[48.6%] bottom-[6.15rem] h-4 w-3 rotate-[-20deg] rounded-full bg-[#8ACC77]/90" />
        <div className="absolute left-[51.4%] bottom-[6.15rem] h-4 w-3 rotate-[20deg] rounded-full bg-[#8ACC77]/90" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-muted-foreground">Conversation Practice</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {currentScene + 1}/{scenarios.length}
            </span>
          </div>
          <h1 className="text-2xl font-bold">Walk! 🚶</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Practice real-life conversations with Dino
          </p>
        </div>

        {/* Progress */}
        <div className="h-2 bg-white rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-400 to-green-400"
            animate={{ width: `${((currentScene + 1) / scenarios.length) * 100}%` }}
          />
        </div>

        <div className="mb-6">
          <PetDisplay mood="happy" size="md" />
        </div>

        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 border-2 border-emerald-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{current.location.split(' ')[1]}</span>
              <h3 className="font-semibold">{current.location.split(' ')[0]}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{current.situation}</p>
          </div>

          <PromptCard title="They Say:" color="green">
            <div className="bg-white rounded-2xl p-4 mt-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  👤
                </div>
                <p className="text-base leading-relaxed pt-1.5">
                  "{current.prompt}"
                </p>
              </div>
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
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </motion.div>
        )}

        {hasResponded && !showReward && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <FeedbackCard
              correct={true}
              feedback="Perfect response! Very natural and polite!"
              suggestion="You used great conversational phrases!"
            />
          </motion.div>
        )}

        <div className="mx-auto w-fit text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              disabled={hasResponded}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
              {isRecording ? "Responding..." : "Tap to respond"}
            </p>
        </div>
      </div>

      <BottomNav />
      </div>
    </div>
  );
}