import React, { useEffect, useState, useRef } from 'react';

interface RewardedAdProps {
  onComplete: () => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const RewardedAd: React.FC<RewardedAdProps> = ({ onComplete, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const initialized = useRef(false);
  const DURATION = 5000; // 5 seconds forced view

  useEffect(() => {
    // AdSense Logic
    if (!initialized.current) {
        initialized.current = true;
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense Error", e);
        }
    }

    // Timer Logic
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur">
      <div className="relative w-full h-full md:w-auto md:h-auto md:min-w-[600px] bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center">
        
        {/* Header */}
        <div className="w-full p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-600">Sponsored Message</span>
            <span className="text-xs text-slate-400">Content unlocking in {Math.ceil((DURATION * (1 - progress / 100)) / 1000)}s</span>
        </div>

        {/* Ad Container */}
        <div className="p-8 bg-white flex items-center justify-center min-h-[300px] min-w-[300px]">
            {/* Large Rectangle / Responsive Unit */}
             <ins className="adsbygoogle"
                style={{ display: 'block', minWidth: '300px', minHeight: '250px' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: REPLACE THIS
                data-ad-slot="1234567890"               // TODO: REPLACE THIS
                data-ad-format="rectangle"
                data-full-width-responsive="true"></ins>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2">
            <div 
                className="bg-green-500 h-full transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
            />
        </div>

        {/* Close Button (Hidden initially to ensure viewability) */}
        <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
            style={{ display: progress > 20 ? 'block' : 'none' }} // Only show close after 1 second
        >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );
};