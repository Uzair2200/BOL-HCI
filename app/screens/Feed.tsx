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

export default function Feed() {
  const { isRecording, setIsRecording } = useMic();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);

  const questions = [
    {
      sentence: "Yesterday, I ___ to the park.",
      options: ["go", "went", "going"],
      correct: "went",
      tense: "Past Simple"
    },
    {
      sentence: "She ___ English every day.",
      options: ["study", "studies", "studied"],
      correct: "studies",
      tense: "Present Simple"
    },
    {
      sentence: "They ___ a movie right now.",
      options: ["watch", "watching", "are watching"],
      correct: "are watching",
      tense: "Present Continuous"
    }
  ];

  const currentQ = questions[currentQuestion];

  const handleMicToggle = () => {
    if (!isRecording) {
      if (!selectedOption) return;
      setIsRecording(true);
    } else {
      setIsRecording(false);
      const isCorrect = selectedOption === currentQ.correct;
      const newAnswers = [...answers, isCorrect];
      setAnswers(newAnswers);
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAnswers([]);
          setSelectedOption(null);
        } else {
          setShowReward(true);
        }
      }, 2000);
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center p-6">
          <RewardCard
            xp={30}
            diamonds={8}
            message="Dino is full and happy! Great grammar work!"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF2DC] via-[#FDE8CB] to-[#F7E3CF] flex flex-col">
      {/* Decorative kitchen/dining background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Kitchen cabinets / backsplash */}
        <div className="absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-[#F8D7AE] to-[#F2C897]" />
        <div className="absolute left-6 top-8 h-18 w-28 rounded-lg bg-[#D9A873]/80" />
        <div className="absolute right-8 top-9 h-16 w-24 rounded-lg bg-[#D7A36D]/80" />

        {/* Counter */}
        <div className="absolute left-0 top-36 h-10 w-full bg-[#D7A16D]/85" />

        {/* Dining table */}
        <div className="absolute left-1/2 top-[13.5rem] h-18 w-[78%] -translate-x-1/2 rounded-2xl bg-gradient-to-b from-[#B87D4E] to-[#9D693E] shadow-[0_12px_24px_rgba(90,55,30,0.28)]" />

        {/* Chairs */}
        <div className="absolute left-[13%] top-[12.1rem] h-16 w-12 rounded-t-xl bg-[#A87145]/80" />
        <div className="absolute right-[13%] top-[12.1rem] h-16 w-12 rounded-t-xl bg-[#A87145]/80" />

        {/* Bowl / food */}
        <div className="absolute left-1/2 top-[14.15rem] h-8 w-16 -translate-x-1/2 rounded-b-[999px] rounded-t-[999px] border-2 border-white/70 bg-[#FDFCF8]" />
        <div className="absolute left-1/2 top-[14.35rem] h-3 w-10 -translate-x-1/2 rounded-full bg-[#F5B35B]" />

        {/* Utensils */}
        <div className="absolute left-[35%] top-[14.85rem] h-1 w-10 rotate-[12deg] rounded-full bg-[#D8DDE3]" />
        <div className="absolute right-[35%] top-[14.85rem] h-1 w-10 rotate-[-12deg] rounded-full bg-[#D8DDE3]" />
        <div className="absolute left-[33.6%] top-[14.66rem] h-1.5 w-1.5 rounded-full bg-[#D8DDE3]" />
        <div className="absolute right-[33.6%] top-[14.66rem] h-2 w-2 rounded-full bg-[#D8DDE3]" />

        {/* Warm ambient glow */}
        <div className="absolute -top-12 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#FFD9A6]/35 blur-2xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Feeding Time</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <h1 className="text-2xl font-bold">Feed Dino! 🍎</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Say the correct verb form to feed your pet
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Pet Display */}
        <div className="mb-6">
          <PetDisplay mood="hungry" size="lg" />
        </div>

        {/* Question Card */}
        <div className="mb-6">
          <PromptCard title={`Tense: ${currentQ.tense}`} color="green">
            <div className="bg-white rounded-2xl p-4 mt-3">
              <p className="text-lg font-medium text-center leading-relaxed">
                {currentQ.sentence}
              </p>
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Choose one and say it:</p>
              {currentQ.options.map((option, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedOption(option)}
                  disabled={answers.length > 0}
                  className={`w-full rounded-xl px-4 py-3 text-center font-medium transition-all ${
                    selectedOption === option
                      ? "bg-emerald-100 ring-2 ring-emerald-400"
                      : "bg-white hover:bg-emerald-50"
                  } ${answers.length > 0 ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                >
                  {option}
                </button>
              ))}
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
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        {answers.length > 0 && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <FeedbackCard
              correct={answers[answers.length - 1]}
              feedback={answers[answers.length - 1] 
                ? `Perfect! "${currentQ.correct}" is correct! 🎉` 
                : `Not quite. The correct answer is "${currentQ.correct}"`}
              suggestion={`This is ${currentQ.tense.toLowerCase()}. Remember the pattern!`}
            />
          </motion.div>
        )}

        {/* Mic Button */}
        <div className="flex justify-center">
          <div className="text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              disabled={(answers.length > 0 && !isRecording) || (!isRecording && !selectedOption)}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
              {isRecording ? "Tap to stop" : selectedOption ? "Tap to speak" : "Select an option first"}
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
      </div>
    </div>
  );
}
