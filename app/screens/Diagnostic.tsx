import { useState } from "react";
import { useNavigate } from "react-router";
import { MicButton } from "../components/MicButton";
import { useMic } from "../context/MicContext";
import { AnimatePresence, motion } from "motion/react";

const diagnosticSentences = [
  "My name is Ali and I like to read books.",
  "The sun rises in the east and sets in the west.",
  "I enjoy playing with my friends after school.",
];

const petOptions = [
  { id: "panda", emoji: "🐼", ring: "border-[#C7BDE3] bg-[#E5DFF4]" },
  { id: "fox", emoji: "🦊", ring: "border-[#E3C8A9] bg-[#F6E5D3]" },
  { id: "bunny", emoji: "🐰", ring: "border-[#B9CFE5] bg-[#DDEAF7]" },
];

export default function Diagnostic() {
  const navigate = useNavigate();
  const { isRecording: isListening, setIsRecording: setIsListening } = useMic();
  const [step, setStep] = useState<"test" | "transition" | "name">("test");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [petName, setPetName] = useState("");
  const [selectedPet, setSelectedPet] = useState("panda");

  const handleMicTap = () => {
    if (isListening) {
      setIsListening(false);
      if (currentIndex < diagnosticSentences.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setStep("transition");
        window.setTimeout(() => setStep("name"), 1600);
      }
      return;
    }

    setIsListening(true);
  };

  const handleContinue = () => {
    navigate("/home");
  };

  const handleSkipDiagnostic = () => {
    setIsListening(false);
    setStep("name");
  };

  const totalSentences = diagnosticSentences.length;
  const progressLabel = `Sentence ${currentIndex + 1} of ${totalSentences}`;

  return (
    <div className="min-h-screen bg-[#F2F2F7] px-5 pb-8 pt-3 flex flex-col">
      <AnimatePresence mode="wait">
        {step === "test" && (
          <motion.div
            key="test"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-xl flex-1 flex flex-col justify-center"
          >
            <div className="text-center">
              <p className="text-[28px] leading-none text-[#8A8898]">Let&apos;s find your level</p>
              <h1 className="mt-3 text-[44px] leading-none font-bold text-[#151B48]">Quick voice test</h1>
            </div>

            <div className="mt-8 rounded-[2.25rem] bg-[#DDD9EE] px-5 py-6 text-center">
              <p className="text-[20px] font-semibold text-[#6558DF]">Say this sentence:</p>
              <p className="mt-4 text-[18px] leading-relaxed font-medium text-[#10194A]">
                &quot;{diagnosticSentences[currentIndex]}&quot;
              </p>

              <div className="mt-5">
                <p className="text-sm font-semibold text-[#6A63A8]">{progressLabel}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  {diagnosticSentences.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2.5 rounded-full transition-all ${
                        idx <= currentIndex ? "w-8 bg-[#6558DF]" : "w-5 bg-[#BBB4DE]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center">
              <MicButton
                isRecording={isListening}
                onToggle={handleMicTap}
                size="lg"
              />
              <p className="mt-5 text-[21px] text-[#8A8898]">
                {isListening ? "Listening... Tap again when done" : "Tap to speak"}
              </p>
            </div>
          </motion.div>
        )}

        {step === "transition" && (
          <motion.div
            key="transition"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-xl flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-full rounded-[2.25rem] bg-[#DDD9EE] px-6 py-8">
              <motion.div
                className="mx-auto h-16 w-16 rounded-full bg-[#6558DF]/15 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-3xl" aria-hidden>
                  ✨
                </span>
              </motion.div>

              <h2 className="mt-4 text-[28px] leading-none font-bold text-[#151B48]">Great job!</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-[#5F5B72]">
                We analyzed your voice test and prepared your learning journey.
              </p>
              <p className="mt-2 text-[17px] leading-relaxed text-[#5F5B72]">
                Next, let&apos;s name your pet companion.
              </p>
            </div>
          </motion.div>
        )}

        {step === "name" && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-xl flex-1 flex flex-col justify-center"
          >
            <div className="text-center">
              <h1 className="text-[44px] leading-none font-bold text-[#151B48]">Name your pet!</h1>
            </div>

            <div className="mx-auto mt-8 h-48 w-48 rounded-full bg-[#EAC6A3] shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center justify-center text-6xl">
              {petOptions.find((pet) => pet.id === selectedPet)?.emoji}
            </div>

            <p className="mt-6 text-center text-[22px] text-[#8A8898]">Your pet hatches as you learn</p>

            <input
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Enter pet name..."
              className="mt-8 h-16 w-full rounded-[1.75rem] border-2 border-[#D4D4D7] bg-transparent px-8 text-[20px] text-[#20254C] outline-none placeholder:text-[#BCBEC4] focus:border-[#6558DF]"
            />

            <div className="mt-8 flex items-center justify-center gap-7">
              {petOptions.map((pet) => {
                const isSelected = selectedPet === pet.id;
                return (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPet(pet.id)}
                    className={`h-24 w-24 rounded-full border-4 text-4xl transition-transform ${pet.ring} ${
                      isSelected ? "scale-105" : "opacity-90"
                    }`}
                  >
                    {pet.emoji}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleContinue}
              disabled={!petName.trim()}
              className={`mt-8 w-full rounded-full py-4 text-xl font-semibold transition-colors ${
                petName.trim()
                  ? "bg-[#5B50D6] text-white"
                  : "bg-[#CFCBEA] text-white"
              }`}
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step !== "name" && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSkipDiagnostic}
            className="min-h-11 rounded-full px-4 text-sm font-medium text-[#7A72CA]"
          >
            Skip diagnostic
          </button>
        </div>
      )}
    </div>
  );
}