import { motion } from "motion/react";
import { HeartIcon, AlertCircleIcon } from "../components/AppIcons";
import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { FeedbackCard } from "../components/FeedbackCard";
import { RewardCard } from "../components/RewardCard";
import { useMic } from "../context/MicContext";

export default function PetDoctor() {
  const [currentMistake, setCurrentMistake] = useState(0);
  const { isRecording, setIsRecording } = useMic();
  const [hasFixed, setHasFixed] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const mistakes = [
    {
      wrong: "She go to school yesterday.",
      hint: "Check the verb tense",
      correct: "She went to school yesterday.",
      explanation: "Use past tense 'went' for actions in the past"
    },
    {
      wrong: "I have two cat.",
      hint: "Check singular/plural",
      correct: "I have two cats.",
      explanation: "Use plural 'cats' after 'two'"
    },
    {
      wrong: "He don't like pizza.",
      hint: "Check the auxiliary verb",
      correct: "He doesn't like pizza.",
      explanation: "Use 'doesn't' with third person singular"
    }
  ];

  const current = mistakes[currentMistake];
  const health = Math.max(0, 100 - (currentMistake * 30));

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setHasFixed(true);
      setTimeout(() => {
        if (currentMistake < mistakes.length - 1) {
          setCurrentMistake(currentMistake + 1);
          setHasFixed(false);
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
            message="Dino is healthy again! You're a grammar doctor!"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <HeartIcon className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-muted-foreground">Grammar Hospital</span>
          </div>
          <h1 className="text-2xl font-bold">Pet Doctor 🏥</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fix grammar mistakes to heal Dino
          </p>
        </div>

        {/* Health Bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-red-500" />
              <span className="font-semibold">Dino's Health</span>
            </div>
            <span className="font-bold text-red-600">{health}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${health > 60 ? "bg-green-400" : health > 30 ? "bg-yellow-400" : "bg-red-400"}`}
              animate={{ width: `${health}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <PetDisplay mood="sick" size="lg" />
        </div>

        {/* Mistake Card */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl p-5 border-2 border-red-200">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Mistake Found:</h3>
                <p className="text-lg line-through text-red-700">{current.wrong}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-red-200">
              <p className="text-xs font-medium text-muted-foreground mb-1">💡 Hint:</p>
              <p className="text-sm">{current.hint}</p>
            </div>
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
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </motion.div>
        )}

        {hasFixed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <FeedbackCard
              correct={true}
              feedback={`Perfect! "${current.correct}"`}
              suggestion={current.explanation}
            />
          </motion.div>
        )}

        <div className="flex justify-center">
          <div className="text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              disabled={hasFixed}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
              {isRecording ? "Tap to stop" : "Say the correct sentence"}
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}