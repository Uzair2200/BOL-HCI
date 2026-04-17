import { motion } from "motion/react";
import { SparklesIcon, TrendingUpIcon, GemIcon } from "./AppIcons";

interface RewardCardProps {
  xp: number;
  diamonds: number;
  message: string;
  onContinue: () => void;
}

export function RewardCard({ xp, diamonds, message, onContinue }: RewardCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-100"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-4"
        >
          <SparklesIcon className="w-8 h-8 text-white" />
        </motion.div>
        
        <h3 className="font-bold text-xl mb-2">Great Job!</h3>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
            <TrendingUpIcon className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-700">+{xp} XP</span>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <GemIcon className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-700">+{diamonds} 💎</span>
          </div>
        </div>
        
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-[#8B7FFF] to-[#6B5FDD] text-white font-semibold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}