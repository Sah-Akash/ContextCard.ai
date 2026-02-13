import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface InterstitialAdProps {
  onDismiss: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onDismiss }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh] max-h-[600px]">
        
        {/* Header - Encouraging Message */}
        <div className="bg-indigo-600 px-6 py-4 text-white text-center">
            <h2 className="text-xl font-bold">Great job! Take a breath.</h2>
            <p className="text-indigo-100 text-sm">Next set loading...</p>
        </div>

        {/* Ad Content Area */}
        <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-8">
            <div className="absolute top-2 right-2 text-[10px] text-slate-400 uppercase tracking-wider font-bold">Advertisement</div>
            
            <div className="text-center space-y-6">
                 <div className="w-20 h-20 bg-blue-500 rounded-xl mx-auto shadow-lg flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Ad</span>
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-slate-800">Premium Study Tools</h3>
                    <p className="text-slate-500 text-sm mt-2">Get access to 10,000+ verified exam questions.</p>
                 </div>
                 <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Install Now
                 </Button>
            </div>
        </div>

        {/* UX Safety: Separated Footer for Navigation */}
        <div className="bg-white p-6 border-t border-slate-200">
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