import React, { useState } from 'react';
import { Deck } from '../types';
import { Button } from './Button';

interface ChallengeModalProps {
  deck: Deck;
  score: number;
  onClose: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({ deck, score, onClose }) => {
  const [nickname, setNickname] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    // For MVP: Encode deck data directly in URL to simulate shared backend state
    const challengeData = {
      deck: deck,
      creatorName: nickname,
      creatorScore: score
    };
    
    const encodedData = btoa(JSON.stringify(challengeData));
    const url = `${window.location.origin}?challenge=${encodedData}`;
    
    navigator.clipboard.writeText(`I scored ${score}% on ${deck.title}. Bet you can't beat me: ${url}`);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-1">Challenge a Friend</h2>
            <p className="text-indigo-100 text-sm">Dare them to beat your score of {score}%!</p>
        </div>
        
        <div className="p-6 space-y-4">
            {!copied ? (
                <>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Nickname</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="e.g. Akash"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={generateLink} 
                        className="w-full"
                        disabled={!nickname.trim()}
                    >
                        Generate Challenge Link
                    </Button>
                </>
            ) : (
                <div className="text-center py-4 space-y-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Link Copied!</h3>
                        <p className="text-slate-500 text-sm">Paste it in WhatsApp, Slack, or Twitter.</p>
                    </div>
                </div>
            )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
            <button onClick={onClose} className="text-slate-500 hover:text-slate-900 text-sm font-medium">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};