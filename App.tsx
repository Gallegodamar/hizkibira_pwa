

import React, { useState, useEffect, useCallback } from 'react';
import { DailyQuestion, UserAnswer, GameState, StoredGameData, SynonymDictionaryEntry } from './types';
import { 
  NUM_QUESTIONS_TO_GENERATE, 
  LOCALSTORAGE_QUESTIONS_KEY,
  DAILY_RESET_HOUR,
  SCORE_CORRECT_ANSWER,
  BONUS_TIME_UNDER_5_SEC,
  BONUS_TIME_BETWEEN_5_AND_10_SEC,
  TIME_THRESHOLD_5_SEC_MS,
  TIME_THRESHOLD_10_SEC_MS,
  STREAK_BONUS_3_CORRECT,
  STREAK_BONUS_5_CORRECT,
  STREAK_THRESHOLD_3,
  STREAK_THRESHOLD_5
} from './constants';
import { getAllPredefinedQuestions, getSynonymDictionary } from './synonymsData'; 
import LoadingComponent from './components/LoadingComponent';
import ErrorComponent from './components/ErrorComponent';
import GameComponent from './components/GameComponent';
import ResultsComponent from './components/ResultsComponent';
import StartScreen from './components/StartScreen';
import ConsultationScreen from './components/ConsultationScreen';

// Helper function to determine the target date string for daily questions
const getTargetQuestionDateString = (): string => {
  const now = new Date();
  const targetDate = new Date(now);
  // If current local time is before DAILY_RESET_HOUR, the questions should be from "yesterday's" set.
  if (now.getHours() < DAILY_RESET_HOUR) {
    targetDate.setDate(now.getDate() - 1);
  }
  return `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
};

interface AppState extends Partial<StoredGameData> {
  gameState: GameState;
  errorMessage: string | null;
  correctStreak: number;
  questionsGeneratedDate?: string;
}

const getInitialState = (): AppState => {
  const storedDataRaw = localStorage.getItem(LOCALSTORAGE_QUESTIONS_KEY);
  const currentTargetDate = getTargetQuestionDateString();

  const defaultFreshState: AppState = { 
    gameState: 'START_SCREEN' as GameState, 
    questions: [], 
    currentQuestionIndex: 0, 
    userAnswers: [], 
    errorMessage: null, 
    correctStreak: 0,
    questionsGeneratedDate: undefined
  };

  if (storedDataRaw) {
    try {
      const storedData = JSON.parse(storedDataRaw) as StoredGameData;
      
      if (storedData.questionsGeneratedDate === currentTargetDate && storedData.questions && storedData.questions.length > 0) {
        if (storedData.gameState && storedData.gameState !== 'LOADING' && storedData.gameState !== 'ERROR' && storedData.gameState !== 'CONSULTATION') {
          if ((storedData.gameState === 'PLAYING' || storedData.gameState === 'RESULTS') && 
              (storedData.currentQuestionIndex === undefined || !storedData.userAnswers)) {
            console.warn("Invalid stored data for PLAYING/RESULTS state with current daily questions. Resetting progress.");
            return { 
              ...defaultFreshState,
              questions: storedData.questions, 
              questionsGeneratedDate: storedData.questionsGeneratedDate,
              gameState: 'START_SCREEN',
            };
          }
          return { 
            ...storedData, 
            errorMessage: null, 
            correctStreak: storedData.correctStreak || 0,
            questionsGeneratedDate: storedData.questionsGeneratedDate,
            gameState: storedData.gameState // Ensure gameState is properly typed
          };
        }
        console.warn("Stored gameState was invalid but daily questions are current. Resetting to START_SCREEN.");
        return {
          ...defaultFreshState,
          questions: storedData.questions,
          questionsGeneratedDate: storedData.questionsGeneratedDate,
          gameState: 'START_SCREEN',
        };
      } else {
        console.log("Stored questions are stale or missing. Needs fresh load.");
        localStorage.removeItem(LOCALSTORAGE_QUESTIONS_KEY);
        return defaultFreshState;
      }
    } catch (e) {
      console.error("Error parsing stored data on init, clearing storage:", e);
      localStorage.removeItem(LOCALSTORAGE_QUESTIONS_KEY);
      return defaultFreshState;
    }
  }
  return defaultFreshState;
};


const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const initialState = getInitialState();

  const [gameState, setGameState] = useState<GameState>(initialState.gameState);
  const [questions, setQuestions] = useState<DailyQuestion[]>(initialState.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(initialState.currentQuestionIndex || 0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(initialState.userAnswers || []);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialState.errorMessage);
  const [synonymDictionary, setSynonymDictionary] = useState<SynonymDictionaryEntry[]>([]);
  const [correctStreak, setCorrectStreak] = useState<number>(initialState.correctStreak || 0);
  const [questionsGeneratedDate, setQuestionsGeneratedDate] = useState<string | undefined>(initialState.questionsGeneratedDate);


  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await getSynonymDictionary();
        setSynonymDictionary(dict);
      } catch(error) {
        console.error("Errorea sinonimoen hiztegia kargatzean:", error);
        setErrorMessage("Ezin izan da sinonimoen hiztegia kargatu. Saiatu berriro geroago.");
        // Optionally set gameState to 'ERROR' if dictionary is crucial and fails to load
        // setGameState('ERROR');
      }
    };
    loadDictionary();
  }, []);


  useEffect(() => {
    if (gameState === 'LOADING' || gameState === 'ERROR') { 
      return;
    }
    const dataToStore: StoredGameData = {
      questions,
      currentQuestionIndex,
      userAnswers,
      gameState,
      correctStreak,
      questionsGeneratedDate,
    };
    localStorage.setItem(LOCALSTORAGE_QUESTIONS_KEY, JSON.stringify(dataToStore));
  }, [questions, currentQuestionIndex, userAnswers, gameState, correctStreak, questionsGeneratedDate]);


  const performFreshWordLoadAndStart = useCallback(async () => {
    setGameState('LOADING'); // Set loading state before async operation
    setErrorMessage(null);
    const currentTargetDate = getTargetQuestionDateString();
    console.log(`Performing fresh word load for date: ${currentTargetDate}`);
    try {
      const allQuestions = await getAllPredefinedQuestions(); // Now async
      if (!allQuestions || allQuestions.length < NUM_QUESTIONS_TO_GENERATE) {
        throw new Error(`Ez dago nahikoa galdera definituta. Beharrezkoak: ${NUM_QUESTIONS_TO_GENERATE}, Eskuragarri: ${allQuestions ? allQuestions.length : 0}`);
      }
      
      const shuffledAll = shuffleArray(allQuestions);
      const dailySet = shuffledAll.slice(0, NUM_QUESTIONS_TO_GENERATE);

      setQuestions(dailySet);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setCorrectStreak(0); 
      setQuestionsGeneratedDate(currentTargetDate);
      setGameState('PLAYING');

    } catch (error) {
      console.error("Errorea hitzak kargatzean:", error);
      let detailedMessage = "Errore ezezaguna hitzak eskuratzean.";
      if (error instanceof Error) {
        detailedMessage = error.message;
      }
      setQuestions([]);
      setQuestionsGeneratedDate(undefined);
      setErrorMessage(detailedMessage);
      setGameState('ERROR');
    }
  }, []);


  const handleStartGame = async () => {
    setErrorMessage(null);
    const currentTargetDate = getTargetQuestionDateString();

    if (questions.length === NUM_QUESTIONS_TO_GENERATE && questionsGeneratedDate === currentTargetDate) {
      console.log("Starting game with existing current daily questions.");
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setCorrectStreak(0);
      setGameState('PLAYING');
    } else {
      console.log("Need fresh questions. Current date vs stored: ", currentTargetDate, questionsGeneratedDate);
      await performFreshWordLoadAndStart(); // Await the async function
    }
  };
  
  const handleManualRefresh = useCallback(async () => {
    setErrorMessage(null);
    console.log("Manual refresh triggered.");
    await performFreshWordLoadAndStart(); // Await the async function
  }, [performFreshWordLoadAndStart]);

  const handleGoToConsultationScreen = () => {
    setGameState('CONSULTATION');
  };

  const handleGoBackFromConsultation = () => {
    const currentTargetDate = getTargetQuestionDateString();
    if (questionsGeneratedDate === currentTargetDate && questions.length > 0) {
        const previousValidState = initialState.gameState;
        if (previousValidState && previousValidState !== 'LOADING' && previousValidState !== 'ERROR' && previousValidState !== 'CONSULTATION') {
           setGameState(previousValidState);
        } else {
           setGameState('START_SCREEN');
        }
    } else {
        setGameState('START_SCREEN'); 
    }
  };

  const handleOptionSelect = (selectedOption: string, timeTakenMs: number) => {
    if (gameState !== 'PLAYING' || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctSynonym;
    let currentScore = 0;
    let newCorrectStreak = correctStreak;

    if (isCorrect) {
      currentScore += SCORE_CORRECT_ANSWER;
      newCorrectStreak++;

      if (timeTakenMs < TIME_THRESHOLD_5_SEC_MS) {
        currentScore += BONUS_TIME_UNDER_5_SEC;
      } else if (timeTakenMs < TIME_THRESHOLD_10_SEC_MS) {
        currentScore += BONUS_TIME_BETWEEN_5_AND_10_SEC;
      }

      if (newCorrectStreak === STREAK_THRESHOLD_3) {
        currentScore += STREAK_BONUS_3_CORRECT;
      }
      if (newCorrectStreak === STREAK_THRESHOLD_5) {
        currentScore += STREAK_BONUS_5_CORRECT; 
      }
      setCorrectStreak(newCorrectStreak);
    } else {
      setCorrectStreak(0);
    }
    
    currentScore = parseFloat(currentScore.toFixed(2));

    setUserAnswers(prevAnswers => [
      ...prevAnswers,
      {
        questionId: currentQuestion.id,
        targetWord: currentQuestion.targetWord,
        selectedOption,
        correctSynonym: currentQuestion.correctSynonym,
        isCorrect,
        score: currentScore,
      },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setGameState('RESULTS');
    }
  };

  const handleRetryOnError = async () => { 
    await performFreshWordLoadAndStart();
  };

  const handleGoToStartScreen = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCorrectStreak(0);
    setGameState('START_SCREEN');
  };

  if (gameState === 'START_SCREEN') {
    return <StartScreen onStartGame={handleStartGame} onGoToConsultation={handleGoToConsultationScreen} onManualRefresh={handleManualRefresh} />;
  }

  if (gameState === 'CONSULTATION') {
    return <ConsultationScreen synonymData={synonymDictionary} onGoBack={handleGoBackFromConsultation} />;
  }
  
  if (gameState === 'LOADING') { 
    return <LoadingComponent />;
  }

  if (gameState === 'ERROR') {
    return <ErrorComponent message={errorMessage || "Errore ezezagun bat gertatu da."} onRetry={handleRetryOnError} />;
  }

  if (gameState === 'PLAYING' && questions.length > 0 && currentQuestionIndex < questions.length && questions[currentQuestionIndex]) {
    return (
      <GameComponent
        question={questions[currentQuestionIndex]}
        onOptionSelect={handleOptionSelect}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
    );
  }

  if (gameState === 'RESULTS') {
    const rawTotalScore = userAnswers.reduce((sum, ans) => sum + ans.score, 0);
    const totalScore = parseFloat(rawTotalScore.toFixed(2));
    
    return (
      <ResultsComponent
        answers={userAnswers}
        score={totalScore}
        totalQuestions={questions.length}
        onPlayAgain={handleGoToStartScreen} 
      />
    );
  }
  
  console.warn("Unexpected game state or data, attempting to reset to StartScreen:", gameState, questions, currentQuestionIndex);
  // This case should ideally not be reached if logic is sound.
  // Forcing a reload or a clear state might be an option for recovery.
  // We know gameState is not 'START_SCREEN' here because the first 'if' block would have caught it.
  // Thus, the previous 'if (gameState !== 'START_SCREEN')' was redundant.
  setGameState('START_SCREEN');
  return <LoadingComponent />; 
};

export default App;
