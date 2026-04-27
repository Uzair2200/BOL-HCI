import { motion } from "motion/react";
import { SparklesIcon } from "../components/AppIcons";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { PromptCard } from "../components/PromptCard";
import { FeedbackCard } from "../components/FeedbackCard";
import { RewardCard } from "../components/RewardCard";
import { useState } from "react";
import { useMic } from "../context/MicContext";

export default function Tricks() {
  const [currentTrick, setCurrentTrick] = useState(0);
  const { isRecording, setIsRecording } = useMic();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const tricks = [
    {
      name: "Sit",
      emoji: "🪑",
      sentence: "Can you ___ here?",
      words: ["sit", "sits", "sitting"],
      correct: "sit",
      rule: "Use base verb after 'can'"
    },
    {
      name: "Roll Over",
      emoji: "🔄",
      sentence: "The ball ___ down the hill.",
      words: ["roll", "rolled", "rolling"],
      correct: "rolled",
      rule: "Past tense - action completed"
    },
    {
      name: "High Five",
      emoji: "🖐️",
      sentence: "She ___ very tall.",
      words: ["is", "are", "am"],
      correct: "is",
      rule: "Singular subject uses 'is'"
    }
  ];

  const current = tricks[currentTrick];

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setHasAnswered(true);
      setTimeout(() => {
        if (currentTrick < tricks.length - 1) {
          setCurrentTrick(currentTrick + 1);
          setHasAnswered(false);
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
            xp={45}
            diamonds={15}
            message="Dino learned 3 new tricks! Amazing grammar!"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Grammar Builder</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Trick {currentTrick + 1}/{tricks.length}
            </span>
          </div>
          <h1 className="text-2xl font-bold">Teach Tricks! ✨</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build correct sentences to teach Dino new tricks
          </p>
        </div>

        {/* Progress */}
        <div className="h-2 bg-white rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
            animate={{ width: `${((currentTrick + 1) / tricks.length) * 100}%` }}
          />
        </div>

        {/* Current Trick */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 mb-6 text-center border-2 border-purple-200">
          <div className="text-5xl mb-2">{current.emoji}</div>
          <h2 className="text-xl font-bold text-purple-700">Teaching: {current.name}</h2>
        </div>

        <div className="mb-6">
          <PetDisplay mood="learning" size="md" />
        </div>

        <div className="mb-6">
          <PromptCard title="Complete the Sentence:" color="purple">
            <div className="bg-white rounded-2xl p-4 mt-3 mb-4">
              <p className="text-lg font-medium text-center leading-relaxed">
                {current.sentence}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Choose and say:</p>
              {current.words.map((word, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl px-4 py-3 text-center font-medium border-2 border-purple-100"
                >
                  {word}
                </div>
              ))}
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

        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <FeedbackCard
              correct={true}
              feedback={`Perfect! "${current.correct}" is correct! 🎉`}
              suggestion={current.rule}
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
  );
}