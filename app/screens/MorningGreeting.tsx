import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { useMic } from "../context/MicContext";
import { PromptCard } from "../components/PromptCard";
import { FeedbackCard } from "../components/FeedbackCard";
import { RewardCard } from "../components/RewardCard";
import { motion } from "motion/react";

export default function MorningGreeting() {
  const { isRecording, setIsRecording } = useMic();
  const [hasSpoken, setHasSpoken] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const prompt = "She sells sea shells by the sea shore";

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setHasSpoken(true);
      setTimeout(() => {
        setShowReward(true);
      }, 2000);
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center p-6">
          <RewardCard
            xp={25}
            diamonds={5}
            message="You woke up Dino with a perfect tongue twister!"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FBE6A2] via-[#F7E9B7] to-[#D8EEFF] flex flex-col">
      {/* Decorative sunrise background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Sun glow */}
        <div className="absolute left-1/2 top-8 h-52 w-52 -translate-x-1/2 rounded-full bg-[#FFD86B] blur-2xl opacity-70" />

        {/* Sun */}
        <div className="absolute left-1/2 top-10 h-32 w-32 -translate-x-1/2 rounded-full bg-[#FFD34D] shadow-[0_0_80px_20px_rgba(255,200,80,0.45)]" />

        {/* Soft radial rays */}
        <div className="absolute left-1/2 top-6 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,225,120,0.35)_0%,rgba(255,225,120,0.18)_35%,rgba(255,225,120,0)_70%)]" />

        {/* Clouds */}
        <div className="absolute left-10 top-24 h-8 w-20 rounded-full bg-white/85 blur-[0.4px]" />
        <div className="absolute left-20 top-20 h-10 w-14 rounded-full bg-white/80" />
        <div className="absolute right-12 top-28 h-8 w-24 rounded-full bg-white/85 blur-[0.4px]" />
        <div className="absolute right-24 top-22 h-10 w-14 rounded-full bg-white/80" />

        {/* Hills / grass */}
        <div className="absolute -bottom-20 left-[-6%] h-52 w-[68%] rounded-[50%] bg-gradient-to-b from-[#A7DB75] to-[#6FB74F]" />
        <div className="absolute -bottom-24 right-[-10%] h-60 w-[72%] rounded-[50%] bg-gradient-to-b from-[#95D56A] to-[#5CA53F]" />
        <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-b from-[#82C75C]/70 to-[#6FB74F]/80" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-[14px] font-medium text-muted-foreground">Morning Routine</span>
          </div>
          <h1 className="text-[32px] font-bold leading-none">Wake Up Dino! 🌅</h1>
          <p className="text-[16px] text-muted-foreground mt-2">
            Say the tongue twister to wake your sleepy pet
          </p>
        </div>

        {/* Pet Display */}
        <div className="mb-6">
          <PetDisplay mood="sleepy" size="lg" />
        </div>

        {/* Prompt Card */}
        <div className="mb-6">
          <PromptCard title="Say This:" color="yellow">
            <div className="bg-white rounded-2xl p-4 mt-3">
              <p className="text-[18px] font-medium text-center leading-relaxed">
                "{prompt}"
              </p>
            </div>
          </PromptCard>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[14px] font-medium">Listening...</span>
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        {hasSpoken && !showReward && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <FeedbackCard
              correct={true}
              feedback="Perfect pronunciation! Dino is waking up! 🎉"
              suggestion="Great job with the 's' and 'sh' sounds!"
            />
          </motion.div>
        )}

        {/* Mic Button */}
        <div className="flex justify-center">
          <div className="text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              disabled={hasSpoken}
              size="lg"
            />
            <p className="text-[14px] text-muted-foreground mt-3">
              {isRecording ? "Tap to stop" : "Tap to speak"}
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
      </div>
    </div>
  );
}