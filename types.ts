export interface Flashcard {
  front: string;
  back: string;
  masteryLevel: number; // 0-5
}

export interface Deck {
  id: string;
  title: string;
  summary: string;
  cards: Flashcard[];
  createdAt: number;
  lastReviewed?: number;
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  STUDY = 'STUDY',
  CHALLENGE_LANDING = 'CHALLENGE_LANDING',
  PRACTICE_HUB = 'PRACTICE_HUB',
  PRACTICE_TEST = 'PRACTICE_TEST',
}

export interface StudySession {
  deckId: string;
  swipes: number;
}

export type FileType = 'application/pdf' | 'image/png' | 'image/jpeg' | 'image/webp';

export interface ChallengeData {
  deck: Deck;
  creatorName: string;
  creatorScore: number;
}

export interface ExamTopic {
  slug: string;
  title: string;
  category: string;
}

export interface PracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}