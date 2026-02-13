import React, { useEffect, useState } from 'react';

interface RewardedAdProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const RewardedAd: React.FC<RewardedAdProps> = ({ onComplete, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const DURATION = 5000; // 5 seconds for demo

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
      <div className="relative w-full h-full md:w-auto md:h-auto md:aspect-video md:min-w-[600px] bg-slate-900 flex flex-col items-center justify-center text-white">
        
        {/* Fake Video Content */}
        <div className="text-center space-y-4 animate-pulse">
            <div className="text-6xl">🎥</div>
            <h2 className="text-2xl font-bold">Watch to Unlock Cheat Sheet</h2>
            <p className="text-slate-400">This helps support our free server costs.</p>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-10 left-10 right-10">
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                    className="bg-green-500 h-full transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-400">
                <span>Reward Video</span>
                <span>{Math.ceil((DURATION * (1 - progress / 100)) / 1000)}s remaining</span>
            </div>
        </div>

        {/* Close Button (Hidden until done usually, but visible for UX here if needed, keeping mostly hidden to simulate forced view) */}
        <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );
};