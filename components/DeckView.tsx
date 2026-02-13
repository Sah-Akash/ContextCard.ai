import React, { useState, useCallback, useEffect } from 'react';
import { Deck, Flashcard } from '../types';
import { Button } from './Button';
import { InterstitialAd } from './InterstitialAd';
import { ChallengeModal } from './ChallengeModal';
import { SidebarAd } from './SidebarAd';
import { RewardedAd } from './RewardedAd';
import { generateCheatSheet } from '../services/geminiService';

interface DeckViewProps {
  deck: Deck;
  onExit: () => void;
}

export const DeckView: React.FC<DeckViewProps> = ({ deck, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [easyCount, setEasyCount] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  
  // Rewarded Ad & Cheat Sheet State
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [cheatSheet, setCheatSheet] = useState<string | null>(null);
  const [loadingCheatSheet, setLoadingCheatSheet] = useState(false);

  const currentCard = deck.cards[currentIndex];

  // Task 3: Contextual Targeting - Inject Meta Keywords
  useEffect(() => {
    // Basic extraction of keywords from title and summary
    const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'of', 'for', 'with', 'study', 'deck'];
    const text = `${deck.title} ${deck.summary}`.toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];
    const keywords = [...new Set(words.filter(w => !stopWords.includes(w) && w.length > 3))].slice(0, 15).join(', ');

    // Find or create meta tag
    let metaTag = document.querySelector('meta[name="keywords"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'keywords');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', keywords);

    return () => {
      // Cleanup: remove content but keep tag to avoid flashing
      metaTag?.setAttribute('content', '');
    };
  }, [deck]);

  const handleSwipe = useCallback((difficulty: 'easy' | 'hard') => {
    // 1. Update swipe count for Ad logic
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    
    if (difficulty === 'easy') {
        setEasyCount(prev => prev + 1);
    }

    // 2. Determine if Ad should show (Every 10 swipes)
    if (newSwipeCount > 0 && newSwipeCount % 10 === 0) {
      setShowAd(true);
    }

    // 3. Move to next card
    setIsFlipped(false);
    if (currentIndex < deck.cards.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200); // Small delay for animation
    } else {
      setCompleted(true);
    }
  }, [currentIndex, deck.cards.length, swipeCount]);

  const handleUnlockCheatSheet = () => {
    setShowRewardedAd(true);
  };

  const handleRewardComplete = async () => {
    setShowRewardedAd(false);
    setLoadingCheatSheet(true);
    const content = await generateCheatSheet(deck.title, deck.cards);
    setCheatSheet(content);
    setLoadingCheatSheet(false);
  };

  if (showAd) {
    return <InterstitialAd onDismiss={() => setShowAd(false)} />;
  }

  if (showRewardedAd) {
    return <RewardedAd onComplete={handleRewardComplete} onCancel={() => setShowRewardedAd(false)} />;
  }

  const score = Math.round((easyCount / deck.cards.length) * 100);

  // Main Render Layout
  return (
    <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 min-h-[calc(100vh-8rem)]">
      
      {/* Left Column: Flashcards */}
      <div className="flex flex-col h-full w-full max-w-xl mx-auto lg:mx-0">
        
        {completed ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in zoom-in duration-300 py-20">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-4xl">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Deck Completed!</h2>
            <p className="text-slate-500 mb-6">You scored {score}% accuracy</p>
            
            <div className="w-full max-w-xs space-y-3">
               <Button 
                  onClick={() => setShowChallengeModal(true)} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
               >
                  ⚔️ Challenge a Friend
               </Button>
               
               <div className="grid grid-cols-2 gap-3">
                  <Button onClick={onExit} variant="outline" className="w-full">Dashboard</Button>
                  <Button onClick={() => {
                      setCurrentIndex(0);
                      setCompleted(false);
                      setSwipeCount(0);
                      setEasyCount(0);
                  }} variant="outline" className="w-full">Retry</Button>
               </div>
            </div>
          </div>
        ) : (
          <>
            {/* Deck Header & Controls */}
            <div className="flex justify-between items-center mb-6">
              <button onClick={onExit} className="text-slate-500 hover:text-slate-900 font-medium text-sm">
                &larr; Exit
              </button>
              <div className="text-sm font-semibold text-slate-700">
                {currentIndex + 1} / {deck.cards.length}
              </div>
              <div className="w-12"></div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full mb-8 overflow-hidden">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${((currentIndex) / deck.cards.length) * 100}%` }}
              />
            </div>

            {/* Flashcard */}
            <div className="flex-1 flex flex-col justify-center perspective-1000 mb-8 relative min-h-[400px]">
              <div 
                className={`relative w-full aspect-[4/5] sm:aspect-[3/2] cursor-pointer transition-transform duration-500 transform-style-3d group ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Front */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center backface-hidden">
                  <span className="absolute top-6 left-6 text-xs font-bold text-indigo-500 tracking-wider uppercase">Question</span>
                  <p className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed">
                    {currentCard.front}
                  </p>
                  <span className="absolute bottom-6 text-xs text-slate-400">Tap to flip</span>
                </div>

                {/* Back */}
                <div className="absolute inset-0 w-full h-full bg-indigo-50 rounded-2xl shadow-xl border border-indigo-100 p-8 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <span className="absolute top-6 left-6 text-xs font-bold text-emerald-600 tracking-wider uppercase">Answer</span>
                  <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-auto mb-8 lg:mb-0">
              <button 
                onClick={() => handleSwipe('hard')}
                className="flex items-center justify-center py-4 rounded-xl bg-red-50 text-red-600 font-bold border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors"
              >
                Hard
              </button>
              <button 
                onClick={() => handleSwipe('easy')}
                className="flex items-center justify-center py-4 rounded-xl bg-green-50 text-green-600 font-bold border-2 border-green-100 hover:bg-green-100 hover:border-green-200 transition-colors"
              >
                Easy
              </button>
            </div>
          </>
        )}
        
        {/* Task 4: Reward Video Section (Mobile/Desktop) */}
        {!completed && !cheatSheet && !loadingCheatSheet && (
           <div className="mt-8 text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
               <h3 className="font-bold text-yellow-800 mb-1">Struggling with this deck?</h3>
               <p className="text-sm text-yellow-700 mb-3">Unlock an AI-generated cheat sheet summary.</p>
               <Button onClick={handleUnlockCheatSheet} variant="primary" size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  🎥 Unlock Cheat Sheet
               </Button>
           </div>
        )}

        {loadingCheatSheet && (
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                <span className="animate-spin mr-2">⚙️</span> Generating Summary...
            </div>
        )}

        {cheatSheet && (
            <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-bottom-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <span className="mr-2">📝</span> Cheat Sheet
                </h3>
                <div className="prose prose-sm prose-slate max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600">{cheatSheet}</pre>
                </div>
            </div>
        )}
      </div>

      {/* Right Column: Sticky Ad (Desktop Only) */}
      <div className="hidden lg:block relative">
        <div className="sticky top-24">
          <SidebarAd />
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-slate-400 text-center">
             Pro Tip: Use arrow keys (Left/Right) to navigate cards.
          </div>
        </div>
      </div>

      {/* Modals */}
      {showChallengeModal && (
        <ChallengeModal 
            deck={deck} 
            score={score} 
            onClose={() => setShowChallengeModal(false)} 
        />
      )}
    </div>
  );
};