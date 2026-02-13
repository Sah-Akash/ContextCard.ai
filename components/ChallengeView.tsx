import React, { useState, useCallback } from 'react';
import { ChallengeData } from '../types';
import { Button } from './Button';
import { InterstitialAd } from './InterstitialAd';

interface ChallengeViewProps {
  challengeData: ChallengeData;
  onCreateReturnChallenge: () => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({ challengeData, onCreateReturnChallenge }) => {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [easyCount, setEasyCount] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [completed, setCompleted] = useState(false);

  const deck = challengeData.deck;
  const currentCard = deck.cards[currentIndex];

  const handleSwipe = useCallback((difficulty: 'easy' | 'hard') => {
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    
    if (difficulty === 'easy') {
        setEasyCount(prev => prev + 1);
    }

    if (newSwipeCount > 0 && newSwipeCount % 10 === 0) {
      setShowAd(true);
    }

    setIsFlipped(false);
    if (currentIndex < deck.cards.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    } else {
      setCompleted(true);
    }
  }, [currentIndex, deck.cards.length, swipeCount]);

  // Landing State
  if (!started) {
      return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-6 text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-xl text-4xl shadow-indigo-200">
                  🥊
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Challenge Accepted?</h1>
              <p className="text-slate-600 mb-8 max-w-md text-lg">
                  <span className="font-bold text-slate-900">{challengeData.creatorName}</span> scored <span className="font-bold text-indigo-600">{challengeData.creatorScore}%</span> on this deck. Can you beat them?
              </p>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-sm mb-8">
                  <h3 className="font-bold text-slate-800 mb-1">{deck.title}</h3>
                  <p className="text-sm text-slate-500">{deck.cards.length} Cards • {deck.summary.substring(0, 60)}...</p>
              </div>

              <Button onClick={() => setStarted(true)} size="lg" className="w-full max-w-xs py-4 text-lg shadow-lg shadow-indigo-200">
                  Start Challenge
              </Button>
          </div>
      );
  }

  // Ad State
  if (showAd) {
    return <InterstitialAd onDismiss={() => setShowAd(false)} />;
  }

  // Results / Viral Hook State
  if (completed) {
      const myScore = Math.round((easyCount / deck.cards.length) * 100);
      const won = myScore >= challengeData.creatorScore;

      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-6 text-center animate-in zoom-in duration-300">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 text-4xl shadow-lg ${won ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
            {won ? '🏆' : '😢'}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {won ? 'You Won!' : 'Challenge Failed'}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            You scored <span className="font-bold">{myScore}%</span> vs {challengeData.creatorName}'s <span className="font-bold">{challengeData.creatorScore}%</span>.
          </p>

          <div className="w-full max-w-sm space-y-4">
            <Button 
                onClick={onCreateReturnChallenge} 
                className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700"
            >
                Create Return Challenge
            </Button>
            <p className="text-xs text-slate-400 mt-2">Upload your own PDF to strike back</p>

            <Button 
                onClick={() => alert("Redirecting to Sign Up flow...")} 
                variant="outline" 
                className="w-full"
            >
                See Detailed Explanations
            </Button>
          </div>
        </div>
      );
  }

  // Quiz State (Simplified DeckView)
  return (
    <div className="flex flex-col h-full max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider">
            Vs {challengeData.creatorName} ({challengeData.creatorScore}%)
        </span>
        <div className="text-sm font-semibold text-slate-700">
          {currentIndex + 1} / {deck.cards.length}
        </div>
      </div>

      <div className="w-full bg-slate-200 h-1.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIndex) / deck.cards.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center perspective-1000 mb-8 relative">
        <div 
          className={`relative w-full aspect-[4/5] sm:aspect-[3/2] cursor-pointer transition-transform duration-500 transform-style-3d group ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center backface-hidden">
            <span className="absolute top-6 left-6 text-xs font-bold text-indigo-500 tracking-wider uppercase">Question</span>
            <p className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed">
              {currentCard.front}
            </p>
            <span className="absolute bottom-6 text-xs text-slate-400">Tap to flip</span>
          </div>

          <div className="absolute inset-0 w-full h-full bg-indigo-50 rounded-2xl shadow-xl border border-indigo-100 p-8 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <span className="absolute top-6 left-6 text-xs font-bold text-emerald-600 tracking-wider uppercase">Answer</span>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
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
    </div>
  );
};