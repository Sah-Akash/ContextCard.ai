import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';

interface InterstitialAdProps {
  onDismiss: () => void;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onDismiss }) => {
  const [countdown, setCountdown] = useState(5);
  const initialized = useRef(false);

  useEffect(() => {
    // Timer Logic
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

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

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh] max-h-[600px]">
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 text-white text-center flex-none">
            <h2 className="text-xl font-bold">Great job! Take a breath.</h2>
            <p className="text-indigo-100 text-sm">Next set loading...</p>
        </div>

        {/* Ad Container */}
        <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-4">
            <div className="absolute top-2 right-2 text-[10px] text-slate-400 uppercase tracking-wider font-bold">Advertisement</div>
            
            {/* 300x250 Medium Rectangle */}
            <div className="w-[300px] h-[250px] bg-white shadow-sm">
                <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: REPLACE THIS
                    data-ad-slot="1234567890"               // TODO: REPLACE THIS
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            </div>
        </div>

        {/* UX Safety: Separated Footer */}
        <div className="bg-white p-6 border-t border-slate-200 flex-none">
            {countdown > 0 ? (
                <button disabled className="w-full py-3 bg-slate-100 text-slate-400 rounded-lg font-medium cursor-wait">
                    Continue in {countdown}s
                </button>
            ) : (
                <button 
                    onClick={onDismiss}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-all transform hover:scale-[1.02]"
                >
                    Continue Studying &rarr;
                </button>
            )}
        </div>
      </div>
    </div>
  );
};