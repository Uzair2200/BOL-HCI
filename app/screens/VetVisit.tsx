import { motion } from "motion/react";
import { AwardIcon, TrendingUpIcon, Volume2Icon, CheckCircleIcon } from "../components/AppIcons";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { PetDisplay } from "../components/PetDisplay";

export default function VetVisit() {
  const pronunciationScores = [
    { word: "Pronunciation", score: 92, color: "bg-green-400" },
    { word: "Fluency", score: 85, color: "bg-blue-400" },
    { word: "Intonation", score: 88, color: "bg-purple-400" },
    { word: "Clarity", score: 90, color: "bg-yellow-400" },
  ];

  const overallScore = 89;

  const feedback = [
    { icon: CheckCircleIcon, text: "Excellent consonant sounds", color: "text-green-600" },
    { icon: CheckCircleIcon, text: "Good rhythm and pacing", color: "text-green-600" },
    { icon: TrendingUpIcon, text: "Practice 'th' sound more", color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-[#FFF8F0] flex flex-col">
      <TopBar showBack />
      
      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Weekly Checkup</span>
          </div>
          <h1 className="text-2xl font-bold">Vet Visit 🩺</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your weekly pronunciation health report
          </p>
        </div>

        <div className="mb-6">
          <PetDisplay mood="happy" size="md" />
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-200 rounded-3xl p-6 mb-6"
        >
          <div className="text-center">
            <AwardIcon className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Overall Score</h2>
            <div className="text-5xl font-bold text-orange-600 mb-2">{overallScore}</div>
            <p className="text-sm font-medium text-orange-700">Excellent Progress!</p>
          </div>
        </motion.div>

        {/* Detailed Scores */}
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Volume2Icon className="w-5 h-5 text-orange-500" />
            Pronunciation Breakdown
          </h3>
          <div className="space-y-4">
            {pronunciationScores.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.word}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{item.score}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 mb-6">
          <h3 className="font-semibold mb-4">Vet's Notes</h3>
          <div className="space-y-3">
            {feedback.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
                  <p className="text-sm">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => window.history.back()}
          className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold py-4 px-6 rounded-2xl hover:opacity-90 transition-opacity"
        >
          Back to Home
        </button>
      </div>

      <BottomNav />
    </div>
  );
}