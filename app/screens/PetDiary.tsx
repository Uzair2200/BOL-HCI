import { motion } from "motion/react";
import { CalendarIcon, PenLineIcon } from "../components/AppIcons";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { useState } from "react";
import { useMic } from "../context/MicContext";

export default function PetDiary() {
  const { isRecording, setIsRecording } = useMic();
  const [transcript, setTranscript] = useState("");
  const [hasSaved, setHasSaved] = useState(false);

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setTranscript("Today was amazing! I practiced English with Dino and we learned about animals. My favorite part was playing word games. I feel more confident speaking now.");
    }
  };

  const handleSave = () => {
    setHasSaved(true);
    setTimeout(() => window.history.back(), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <PenLineIcon className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-muted-foreground">Daily Journal</span>
          </div>
          <h1 className="text-2xl font-bold">Pet Diary 📝</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Share your day with Dino in spoken English
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 mb-6 border-2 border-rose-100">
          <CalendarIcon className="w-5 h-5 text-rose-500" />
          <span className="font-medium">Saturday, April 4, 2026</span>
        </div>

        <div className="mb-6">
          <PetDisplay mood="happy" size="md" />
        </div>

        {transcript ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-3xl p-5 border-2 border-rose-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>Your Entry</span>
                <span className="text-green-500">✓</span>
              </h3>
              <p className="text-base leading-relaxed mb-4">{transcript}</p>
              
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
                <p className="text-xs font-medium text-muted-foreground mb-2">💡 Gentle Suggestion:</p>
                <p className="text-sm">Great entry! Try using "we've learned" instead of "we learned" for recent past experience.</p>
              </div>
            </div>

            {!hasSaved ? (
              <button
                onClick={handleSave}
                className="w-full mt-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white font-semibold py-4 px-6 rounded-2xl hover:opacity-90 transition-opacity"
              >
                Save to Diary
              </button>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="mt-4 bg-green-50 text-green-700 font-semibold py-4 px-6 rounded-2xl text-center border-2 border-green-200"
              >
                ✓ Saved! +20 XP
              </motion.div>
            )}
          </motion.div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl p-6 mb-6 border-2 border-rose-200">
              <h3 className="font-semibold mb-2 text-center">💭 Prompts to help you:</h3>
              <ul className="text-sm space-y-2 text-muted-foreground text-center">
                <li>• What did you do today?</li>
                <li>• How are you feeling?</li>
                <li>• What did you learn?</li>
                <li>• What made you happy?</li>
              </ul>
            </div>

            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center"
              >
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Recording your diary...</span>
                </div>
              </motion.div>
            )}

            <div className="mx-auto w-fit text-center">
                <MicButton
                  isRecording={isRecording}
                  onToggle={handleMicToggle}
                  size="lg"
                />
                <p className="text-sm text-muted-foreground mt-3">
                  {isRecording ? "Keep talking..." : "Tap to start journaling"}
                </p>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}