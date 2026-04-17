import { motion } from "motion/react";
import { BriefcaseIcon, ClockIcon } from "../components/AppIcons";
import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { FeedbackCard } from "../components/FeedbackCard";

export default function InterviewMode() {
  const [currentQ, setCurrentQ] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "Why do you want this position?",
    "Where do you see yourself in 5 years?",
  ];

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasAnswered(true);
        const points = Math.floor(Math.random() * 20) + 70;
        setScore(score + points);
        setTimeout(() => {
          if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
            setHasAnswered(false);
          }
        }, 3000);
      }, 5000);
    }
  };

  const avgScore = Math.round(score / (currentQ + 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-muted-foreground">Mock Interview</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full">
              <ClockIcon className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium">{currentQ + 1}/{questions.length}</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Interview Mode 💼</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Practice answering common interview questions
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-white rounded-2xl p-4 mb-6 border-2 border-violet-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Average Score</span>
            <span className="text-2xl font-bold text-violet-600">{avgScore}/100</span>
          </div>
        </div>

        <div className="mb-6">
          <PetDisplay mood="learning" size="md" />
        </div>

        {/* Question */}
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl p-6 border-2 border-violet-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                Q{currentQ + 1}
              </div>
              <div className="pt-2">
                <p className="text-lg font-medium">{questions[currentQ]}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording answer...</span>
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
              feedback={`Great answer! Score: ${Math.floor(Math.random() * 20) + 70}/100`}
              suggestion="Clear structure, good confidence. Try adding more specific examples next time."
            />
          </motion.div>
        )}

        {currentQ === questions.length - 1 && hasAnswered && (
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Finish Interview
          </button>
        )}

        {(!hasAnswered || currentQ < questions.length - 1) && (
          <div className="flex justify-center">
            <div className="text-center">
              <MicButton
                isRecording={isRecording}
                onToggle={handleMicToggle}
                disabled={hasAnswered}
                size="lg"
              />
              <p className="text-sm text-muted-foreground mt-3">
                {isRecording ? "Speak naturally..." : "Tap to answer"}
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}