

export interface DailyQuestion {
  id: string;
  targetWord: string;
  options: string[]; // Should contain 3 options, one of them being the correctSynonym
  correctSynonym: string;
}

export interface UserAnswer {
  questionId: string;
  targetWord: string;
  selectedOption: string;
  correctSynonym: string;
  isCorrect: boolean;
  score: number; // Puntuazioa galdera bakoitzeko
}

export type GameState = 'START_SCREEN' | 'LOADING' | 'PLAYING' | 'RESULTS' | 'ERROR' | 'CONSULTATION';

export interface StoredGameData {
  questions: DailyQuestion[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  gameState: GameState;
  correctStreak?: number; // Racha actual de respuestas correctas
  questionsGeneratedDate?: string; // YYYY-MM-DD format for when questions were set
}

export enum FeedbackType {
  NONE = 'NONE',
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
}

// For ConsultationScreen
export interface SynonymDictionaryEntry {
  targetWord: string;
  synonyms: string[];
}

// For raw data structure from synonyms.json (and previously inline)
export interface RawSynonymEntry {
  targetWord: string;
  correctSynonym: string;
  optionsWithCorrect: string[];
}
