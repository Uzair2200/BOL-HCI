import { motion } from "motion/react";
import { BookOpenIcon, ChevronRightIcon } from "../components/AppIcons";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { PromptCard } from "../components/PromptCard";
import { FeedbackCard } from "../components/FeedbackCard";
import { RewardCard } from "../components/RewardCard";
import { useState } from "react";

export default function StoryTime() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const story = [
    {
      text: "Once upon a time, there was a little dinosaur named Dino who loved to learn new words.",
      image: "🦕"
    },
    {
      text: "Every day, Dino would practice speaking English with friends from around the world.",
      image: "🌍"
    },
    {
      text: "The more Dino practiced, the more confident and happy Dino became!",
      image: "⭐"
    }
  ];

  const question = {
    q: "What did Dino love to do?",
    a: "Learn new words"
  };

  const handleMicToggle = () => {
    if (!showQuestion) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasRead(true);
      }, 3000);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasAnswered(true);
        setTimeout(() => setShowReward(true), 2000);
      }, 2500);
    }
  };

  const handleNext = () => {
    if (currentPage < story.length - 1) {
      setCurrentPage(currentPage + 1);
      setHasRead(false);
    } else {
      setShowQuestion(true);
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center p-6">
          <RewardCard
            xp={35}
            diamonds={10}
            message="You read the whole story and answered perfectly!"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Story Time</span>
            </div>
            {!showQuestion && (
              <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage + 1}/{story.length}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold">Story Time 📖</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Read aloud and answer comprehension questions
          </p>
        </div>

        {/* Progress */}
        {!showQuestion && (
          <div className="h-2 bg-white rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-400 to-red-400"
              animate={{ width: `${((currentPage + 1) / story.length) * 100}%` }}
            />
          </div>
        )}

        <div className="mb-6">
          <PetDisplay mood="learning" size="md" />
        </div>

        {!showQuestion ? (
          <>
            {/* Story Page */}
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-8 border-2 border-orange-200 text-center mb-4">
                <div className="text-7xl mb-4">{story[currentPage].image}</div>
                <p className="text-lg leading-relaxed">
                  {story[currentPage].text}
                </p>
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
                  <span className="text-sm font-medium">Reading...</span>
                </div>
              </motion.div>
            )}

            {hasRead && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <FeedbackCard
                    correct={true}
                    feedback="Great reading! Clear and expressive!"
                  />
                </motion.div>
                
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold py-4 px-6 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {currentPage < story.length - 1 ? "Next Page" : "Answer Question"}
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </>
            )}

            {!hasRead && (
              <div className="flex justify-center">
                <div className="text-center">
                  <MicButton
                    isRecording={isRecording}
                    onToggle={handleMicToggle}
                    size="lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    {isRecording ? "Reading..." : "Tap to read aloud"}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Comprehension Question */}
            <div className="mb-6">
              <PromptCard title="Comprehension Question:" color="orange">
                <div className="bg-white rounded-2xl p-4 mt-3">
                  <p className="text-lg font-medium text-center leading-relaxed">
                    {question.q}
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

            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <FeedbackCard
                  correct={true}
                  feedback={`Perfect! The answer is "${question.a}"`}
                  suggestion="You understood the story very well!"
                />
              </motion.div>
            )}

            {!hasAnswered && (
              <div className="flex justify-center">
                <div className="text-center">
                  <MicButton
                    isRecording={isRecording}
                    onToggle={handleMicToggle}
                    size="lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    {isRecording ? "Tap to stop" : "Tap to answer"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}