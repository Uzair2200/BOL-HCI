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

export default function Brush() {
  const { isRecording, setIsRecording } = useMic();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const sentence = "The quick brown fox jumps over the _____ dog.";
  const correctWord = "lazy";

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setHasAnswered(true);
      setTimeout(() => setShowReward(true), 2000);
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center p-6">
          <RewardCard
            xp={20}
            diamonds={5}
            message="Dino's teeth are sparkling clean!"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#F8FCFF] via-[#ECF6FF] to-[#FFF8F0] flex flex-col">
      {/* Decorative bathroom background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Tiled wall */}
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(180,205,225,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(180,205,225,0.4)_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Mirror */}
        <div className="absolute left-1/2 top-14 h-28 w-40 -translate-x-1/2 rounded-2xl border-4 border-white/90 bg-gradient-to-b from-[#E6F3FF] to-[#D5E7F7] shadow-md" />

        {/* Sink */}
        <div className="absolute left-1/2 top-44 h-16 w-56 -translate-x-1/2 rounded-b-[2.5rem] rounded-t-2xl bg-white shadow-[0_8px_20px_rgba(120,150,180,0.25)]" />

        {/* Faucet */}
        <div className="absolute left-1/2 top-[10.1rem] h-10 w-4 -translate-x-1/2 rounded-full bg-[#B7C6D4]" />
        <div className="absolute left-1/2 top-[9.4rem] h-4 w-16 -translate-x-1/2 rounded-full bg-[#C4D2DE]" />

        {/* Toothbrush + toothpaste */}
        <div className="absolute left-[58%] top-[14.4rem] h-1.5 w-12 rotate-[-10deg] rounded-full bg-[#4FA9FF]" />
        <div className="absolute left-[67%] top-[14.15rem] h-3 w-2 rotate-[-10deg] rounded-sm bg-white" />
        <div className="absolute left-[39%] top-[14.55rem] h-2.5 w-14 rotate-[6deg] rounded-full bg-[#7BD0A5]" />
        <div className="absolute left-[39%] top-[14.35rem] h-1 w-14 rotate-[6deg] rounded-full bg-white/80" />

        {/* Counter floor tint */}
        <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-b from-[#F3FAFF]/40 to-[#EAF5FF]/75" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Dental Care</span>
          </div>
          <h1 className="text-2xl font-bold">Brush Time! 🪥</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete the sentence by saying the missing word
          </p>
        </div>

        <div className="mb-6">
          <PetDisplay mood="happy" size="lg" />
        </div>

        <div className="mb-6">
          <PromptCard title="Complete the Sentence:" color="blue">
            <div className="bg-white rounded-2xl p-4 mt-3">
              <p className="text-lg font-medium text-center leading-relaxed">
                {sentence}
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
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </motion.div>
        )}

        {hasAnswered && !showReward && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <FeedbackCard
              correct={true}
              feedback={`Excellent! "${correctWord}" is the missing word!`}
              suggestion="This is a famous pangram used to practice typing!"
            />
          </motion.div>
        )}

        <div className="flex justify-center">
          <div className="text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              disabled={hasAnswered}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
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
