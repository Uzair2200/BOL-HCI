import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";
import { MicButton } from "../components/MicButton";
import { PromptCard } from "../components/PromptCard";
import { FeedbackCard } from "../components/FeedbackCard";
import { RewardCard } from "../components/RewardCard";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Bath() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [bubbles, setBubbles] = useState(0);

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasSpoken(true);
        setBubbles(8); // Simulate bubble count based on details
        setTimeout(() => setShowReward(true), 2000);
      }, 4000);
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
            message={`You described ${bubbles} details! Dino is squeaky clean!`}
            onContinue={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Bath Time</span>
          </div>
          <h1 className="text-2xl font-bold">Bath Time! 🛁</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Describe the image in English - more details = more bubbles!
          </p>
        </div>

        <div className="mb-6">
          <PetDisplay mood="dirty" size="lg" showBubbles={hasSpoken} />
        </div>

        {/* Bubble Counter */}
        {hasSpoken && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6 flex justify-center"
          >
            <div className="bg-blue-100 border-2 border-blue-200 rounded-2xl px-6 py-3 flex items-center gap-2">
              <span className="text-3xl">🫧</span>
              <div>
                <p className="text-sm text-muted-foreground">Bubbles Created</p>
                <p className="text-2xl font-bold text-blue-600">{bubbles}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-6">
          <PromptCard title="Describe This Picture:" color="blue">
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl p-4 mt-3 aspect-video flex items-center justify-center">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
                alt="Mountain landscape"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Try to describe: what you see, colors, objects, location, weather, feelings
            </p>
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

        {hasSpoken && !showReward && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <FeedbackCard
              correct={true}
              feedback="Great description! You mentioned mountains, sky, lake, and more!"
              suggestion="Try using more adjectives like 'beautiful', 'peaceful', 'snowy' next time!"
            />
          </motion.div>
        )}

        <div className="flex justify-center">
          <div className="text-center">
            <MicButton
              isRecording={isRecording}
              onToggle={handleMicToggle}
              disabled={hasSpoken}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-3">
              {isRecording ? "Keep describing..." : "Tap and describe"}
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
