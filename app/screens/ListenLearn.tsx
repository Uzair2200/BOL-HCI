import { motion } from "motion/react";
import { HeadphonesIcon, Volume2Icon } from "../components/AppIcons";
import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { FeedbackCard } from "../components/FeedbackCard";
import { RewardCard } from "../components/RewardCard";

export default function ListenLearn() {
  const [stage, setStage] = useState<"listen" | "question">("listen");
  const [isRecording, setIsRecording] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audio = {
    title: "A Day at the Beach",
    transcript: "Yesterday, Sarah went to the beach with her family. They played in the sand and swam in the ocean. Sarah found a beautiful shell and took it home as a memory.",
  };

  const question = "Where did Sarah go yesterday?";

  const playAudio = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 5000);
  };

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasAnswered(true);
        setTimeout(() => setShowReward(true), 2000);
      }, 2500);
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
            message="Perfect listening comprehension!"
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <HeadphonesIcon className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium text-muted-foreground">Listening Practice</span>
          </div>
          <h1 className="text-2xl font-bold">Listen & Learn 🎧</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Listen to the audio and answer the question
          </p>
        </div>

        <div className="mb-6">
          <PetDisplay mood="learning" size="md" />
        </div>

        {stage === "listen" ? (
          <>
            {/* Audio Player */}
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl p-6 mb-6 border-2 border-sky-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                  <Volume2Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{audio.title}</h3>
                  <p className="text-xs text-muted-foreground">Duration: ~15 seconds</p>
                </div>
              </div>
              
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
                  isPlaying 
                    ? "bg-sky-300 text-sky-700" 
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
              >
                {isPlaying ? "Playing..." : "▶ Play Audio"}
              </button>
            </div>

            {/* Transcript (shown after playing) */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 mb-6 border-2 border-sky-200"
              >
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Transcript:</h4>
                <p className="text-sm leading-relaxed">{audio.transcript}</p>
              </motion.div>
            )}

            <button
              onClick={() => setStage("question")}
              disabled={!isPlaying}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Continue to Question
            </button>
          </>
        ) : (
          <>
            {/* Question */}
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl p-6 mb-6 border-2 border-sky-200">
              <h3 className="font-semibold mb-3">Comprehension Question:</h3>
              <p className="text-lg font-medium">{question}</p>
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
                  feedback="Perfect! She went to the beach with her family!"
                  suggestion="Great listening skills!"
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
                  {isRecording ? "Tap to stop" : "Tap to answer"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}