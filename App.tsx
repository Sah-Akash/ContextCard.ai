import React, { useState, useEffect } from 'react';
import { UploadZone } from './components/UploadZone';
import { DeckView } from './components/DeckView';
import { ChallengeView } from './components/ChallengeView';
import { PracticeTestView } from './components/PracticeTestView';
import { AppState, Deck, ChallengeData, ExamTopic } from './types';
import { Button } from './components/Button';
import { examTopics } from './lib/exams';

export default function App() {
  const [view, setView] = useState<AppState>(AppState.DASHBOARD);
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeData | null>(null);
  const [activeTopic, setActiveTopic] = useState<ExamTopic | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);

  // Check for Challenge Link on Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challengeParam = params.get('challenge');
    
    if (challengeParam) {
        try {
            const decoded = atob(challengeParam);
            const challengeData: ChallengeData = JSON.parse(decoded);
            setActiveChallenge(challengeData);
            setView(AppState.CHALLENGE_LANDING);
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        } catch (e) {
            console.error("Invalid Challenge Link", e);
        }
    }
  }, []);

  // Load decks from local storage on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem('contextcard_decks');
    if (savedDecks) {
      try {
        setDecks(JSON.parse(savedDecks));
      } catch (e) {
        console.error("Failed to load decks", e);
      }
    }
  }, []);

  // Save decks when changed
  useEffect(() => {
    localStorage.setItem('contextcard_decks', JSON.stringify(decks));
  }, [decks]);

  const handleDeckCreated = (newDeck: Deck) => {
    setDecks(prev => [newDeck, ...prev]);
    setActiveDeck(newDeck);
    setView(AppState.STUDY);
  };

  const handleSelectDeck = (deck: Deck) => {
    setActiveDeck(deck);
    setView(AppState.STUDY);
  };

  const handleDeleteDeck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this deck?')) {
        setDecks(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleSelectTopic = (topic: ExamTopic) => {
    setActiveTopic(topic);
    setView(AppState.PRACTICE_TEST);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 bg-white/95 supports-backdrop-blur:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between py-4">
             <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setView(AppState.DASHBOARD)}
             >
                <div className="bg-indigo-600 rounded-lg p-1.5">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">ContextCard<span className="text-indigo-600">.ai</span></h1>
             </div>
             
             {view !== AppState.UPLOAD && view !== AppState.STUDY && view !== AppState.CHALLENGE_LANDING && view !== AppState.PRACTICE_TEST && (
               <Button onClick={() => setView(AppState.UPLOAD)}>
                 + New Deck
               </Button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-8">
        
        {view === AppState.DASHBOARD && (
          <div className="space-y-12 animate-in fade-in duration-500">
            
            {/* User Decks Section */}
            <div className="space-y-6">
                {decks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="mx-auto h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-3xl">📚</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Your library is empty</h2>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Upload your first PDF or image to generate AI-powered flashcards instantly.</p>
                    <Button onClick={() => setView(AppState.UPLOAD)} size="lg" className="px-8 py-3">Create First Deck</Button>
                </div>
                ) : (
                <>
                    <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Your Decks</h2>
                        <p className="text-slate-500 mt-1">Manage your study materials and progress.</p>
                    </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map((deck) => (
                        <div 
                        key={deck.id}
                        onClick={() => handleSelectDeck(deck)}
                        className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col"
                        >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <button 
                                onClick={(e) => handleDeleteDeck(e, deck.id)}
                                className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{deck.title}</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{deck.summary}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                {deck.cards.length} Cards
                            </span>
                            <span className="text-indigo-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                Study &rarr;
                            </span>
                        </div>
                        </div>
                    ))}
                    </div>
                </>
                )}
            </div>

            {/* Practice Hub Section (SEO) */}
            <div>
               <h2 className="text-xl font-bold text-slate-900 mb-4">Popular Practice Tests</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examTopics.map(topic => (
                     <div 
                        key={topic.slug}
                        onClick={() => handleSelectTopic(topic)}
                        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                     >
                        <div>
                           <div className="text-xs font-bold text-indigo-500 mb-1">{topic.category}</div>
                           <h3 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{topic.title}</h3>
                        </div>
                        <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">&rarr;</span>
                     </div>
                  ))}
               </div>
            </div>

          </div>
        )}

        {view === AppState.UPLOAD && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-6">
                <button 
                    onClick={() => setView(AppState.DASHBOARD)}
                    className="text-sm text-slate-500 hover:text-slate-900 mb-4 flex items-center"
                >
                    &larr; Back to Dashboard
                </button>
             </div>
            <UploadZone onDeckCreated={handleDeckCreated} />
          </div>
        )}

        {view === AppState.STUDY && activeDeck && (
          <div className="h-[calc(100vh-8rem)]">
             <DeckView 
                deck={activeDeck} 
                onExit={() => setView(AppState.DASHBOARD)} 
             />
          </div>
        )}

        {view === AppState.CHALLENGE_LANDING && activeChallenge && (
            <ChallengeView 
                challengeData={activeChallenge}
                onCreateReturnChallenge={() => setView(AppState.UPLOAD)}
            />
        )}

        {view === AppState.PRACTICE_TEST && activeTopic && (
            <PracticeTestView 
               topic={activeTopic}
               onConvert={() => setView(AppState.UPLOAD)}
               onBack={() => setView(AppState.DASHBOARD)}
            />
        )}

      </main>
    </div>
  );
}