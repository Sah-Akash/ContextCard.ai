import React, { useEffect, useState } from 'react';
import { ExamTopic, PracticeQuestion } from '../types';
import { generatePracticeQuiz } from '../services/geminiService';
import { Button } from './Button';

interface PracticeTestViewProps {
  topic: ExamTopic;
  onConvert: () => void;
  onBack: () => void;
}

export const PracticeTestView: React.FC<PracticeTestViewProps> = ({ topic, onConvert, onBack }) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await generatePracticeQuiz(topic.title);
        setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [topic]);

  const handleOptionSelect = (qIndex: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }));
    setShowExplanation(prev => ({ ...prev, [qIndex]: true }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold text-slate-900">Generating {topic.title} Quiz...</h2>
        <p className="text-slate-500">Consulting the AI knowledge base for exam-grade questions.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-900">&larr; Back to Hub</button>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{topic.category}</span>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{topic.title} Practice Quiz</h1>
        <p className="text-slate-600">Free AI-generated practice questions to help you prepare.</p>
      </div>

      {questions.map((q, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{idx + 1}. {q.question}</h3>
          <div className="space-y-3">
            {q.options.map((opt) => {
              const isSelected = selectedAnswers[idx] === opt;
              const isCorrect = opt === q.correctAnswer;
              const showResult = showExplanation[idx];
              
              let btnClass = "w-full text-left p-4 rounded-lg border transition-all ";
              if (showResult) {
                if (isCorrect) btnClass += "bg-green-50 border-green-200 text-green-800";
                else if (isSelected) btnClass += "bg-red-50 border-red-200 text-red-800";
                else btnClass += "bg-slate-50 border-slate-200 text-slate-400";
              } else {
                btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-700";
              }

              return (
                <button 
                  key={opt}
                  disabled={showResult}
                  onClick={() => handleOptionSelect(idx, opt)}
                  className={btnClass}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {showExplanation[idx] && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-900">
              <span className="font-bold block mb-1">Explanation:</span>
              {q.explanation}
            </div>
          )}
        </div>
      ))}

      {/* The "Hook" - Conversion Strategy */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-center text-white shadow-xl mt-12">
        <h2 className="text-2xl font-bold mb-3">Need specific practice?</h2>
        <p className="text-indigo-200 mb-6 max-w-lg mx-auto">
          These questions were generated from general knowledge. Upload your actual textbook or class notes to get a custom quiz tailored exactly to your exam.
        </p>
        <Button 
          onClick={onConvert} 
          className="bg-white text-indigo-900 hover:bg-indigo-50 border-0 text-lg px-8 py-3 h-auto"
        >
          Upload My Notes &rarr;
        </Button>
      </div>
    </div>
  );
};