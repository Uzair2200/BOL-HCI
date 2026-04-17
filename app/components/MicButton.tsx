import { motion } from "motion/react";
import { MicIcon, MicOffIcon } from "./AppIcons";

interface MicButtonProps {
  isRecording: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: "md" | "lg";
}

export function MicButton({ isRecording, onToggle, disabled = false, size = "lg" }: MicButtonProps) {
  const sizeClasses = size === "lg" ? "w-20 h-20" : "w-16 h-16";
  
  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled}
      className={`${sizeClasses} rounded-full flex items-center justify-center relative disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{
        background: isRecording 
          ? "linear-gradient(135deg, #FC8181 0%, #F56565 100%)"
          : "linear-gradient(135deg, #8B7FFF 0%, #6B5FDD 100%)",
        boxShadow: isRecording 
          ? "0 8px 24px rgba(252, 129, 129, 0.4)"
          : "0 8px 24px rgba(139, 127, 255, 0.4)"
      }}
      animate={{
        scale: isRecording ? [1, 1.05, 1] : 1
      }}
      transition={{
        duration: 1,
        repeat: isRecording ? Infinity : 0
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-center">
        {isRecording ? (
          <MicOffIcon className="w-8 h-8 text-white" />
        ) : (
          <MicIcon className="w-8 h-8 text-white" />
        )}
      </div>
      
      {isRecording && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-red-400"
          animate={{
            scale: [1, 1.3],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        />
      )}
    </motion.button>
  );
}