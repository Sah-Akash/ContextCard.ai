import React, { useCallback, useState } from 'react';
import { generateStudyMaterial } from '../services/geminiService';
import { Deck } from '../types';
import { Button } from './Button';

interface UploadZoneProps {
  onDeckCreated: (deck: Deck) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onDeckCreated }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    // Validate types
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF, PNG, or JPEG.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = reader.result as string;
          // Strip the data URL prefix (e.g., "data:image/png;base64,")
          const base64Data = base64String.split(',')[1];
          
          const deckData = await generateStudyMaterial(base64Data, file.type);
          
          const newDeck: Deck = {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            ...deckData,
          };

          onDeckCreated(newDeck);
        } catch (err) {
          setError('Failed to process with AI. Please try again.');
          console.error(err);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.onerror = () => {
        setError("Error reading file");
        setIsProcessing(false);
      }
      reader.readAsDataURL(file);
    } catch (err) {
       console.error(err);
       setError('An unexpected error occurred.');
       setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
          }
        `}
      >
        <div className="mb-6 flex justify-center">
            <div className={`p-4 rounded-full ${isProcessing ? 'bg-indigo-100 animate-pulse' : 'bg-slate-100'}`}>
                {isProcessing ? (
                   <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                ) : (
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                )}
            </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {isProcessing ? 'Generating Flashcards...' : 'Upload your Study Material'}
        </h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          {isProcessing 
            ? 'Gemini is analyzing your content to create specific recall and application questions.' 
            : 'Drag & drop a PDF, image, or screenshot here. We support visual notes and diagrams.'
          }
        </p>

        {!isProcessing && (
          <div className="relative">
            <input 
              type="file" 
              accept=".pdf,image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileInput}
              disabled={isProcessing}
            />
            <Button variant="primary" disabled={isProcessing}>
              Browse Files
            </Button>
          </div>
        )}
        
        {error && (
            <div className="mt-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                {error}
            </div>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold text-slate-900 text-sm">Instant Generation</h4>
              <p className="text-xs text-slate-500 mt-1">Powered by Gemini 1.5 Flash</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-slate-900 text-sm">Exam Focused</h4>
              <p className="text-xs text-slate-500 mt-1">Optimized for Recall & Application</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="text-2xl mb-2">🖼️</div>
              <h4 className="font-semibold text-slate-900 text-sm">Multimodal</h4>
              <p className="text-xs text-slate-500 mt-1">Reads Text, Diagrams & Charts</p>
          </div>
      </div>
    </div>
  );
};