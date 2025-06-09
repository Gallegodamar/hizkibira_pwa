
import React, { useState, useEffect, useCallback } from 'react';
import { DailyQuestion, FeedbackType } from '../types';
import OptionsList from './OptionsList';
import TimerBar from './TimerBar';
import { MAX_QUESTION_DURATION_MS } from '../constants';

interface GameComponentProps {
  question: DailyQuestion;
  onOptionSelect: (option: string, timeTakenMs: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const GameComponent: React.FC<GameComponentProps> = ({ question, onOptionSelect, questionNumber, totalQuestions }) => {
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [timeElapsedMs, setTimeElapsedMs] = useState<number>(0);
  const [timerIntervalId, setTimerIntervalId] = useState<number | null>(null);

  const [playerSelection, setPlayerSelection] = useState<string | null>(null);
  const [feedbackActive, setFeedbackActive] = useState<boolean>(false);
  const [currentFeedbackType, setCurrentFeedbackType] = useState<FeedbackType>(FeedbackType.NONE);

  const resetTimer = useCallback(() => {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }
    setTimeElapsedMs(0);
    const newStartTime = performance.now();
    setQuestionStartTime(newStartTime);

    const intervalId = setInterval(() => {
      setTimeElapsedMs(performance.now() - newStartTime);
    }, 100); // Update timer display roughly every 100ms
    setTimerIntervalId(intervalId as unknown as number); // NodeJS.Timeout vs number
  }, [timerIntervalId]);

  useEffect(() => {
    setPlayerSelection(null);
    setFeedbackActive(false);
    setCurrentFeedbackType(FeedbackType.NONE);
    resetTimer();

    return () => {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    };
  }, [question.id]); // Reset when question changes

  useEffect(() => {
    if (timeElapsedMs >= MAX_QUESTION_DURATION_MS && !feedbackActive) {
      // Auto-trigger with max time if timer runs out and no answer yet
      // This ensures the game doesn't stall. Player gets 0 points for the question.
      if (timerIntervalId) clearInterval(timerIntervalId);
      setFeedbackActive(true); // Prevent further interaction
      // Pick a dummy option or the first option to proceed, score will be 0 due to time.
      const dummyOption = question.options[0] || ""; 
      setCurrentFeedbackType(FeedbackType.INCORRECT); // Or some 'TIMEOUT' feedback
      setPlayerSelection(dummyOption); // Show something was "selected"
      
      // console.log("Time ran out!");
      // Proceed after a short delay to show it timed out visually (optional)
      setTimeout(() => {
        onOptionSelect(dummyOption, MAX_QUESTION_DURATION_MS);
      }, 1500);
    }
  }, [timeElapsedMs, feedbackActive, question.options, onOptionSelect, timerIntervalId]);


  const handlePlayerChoice = (option: string) => {
    if (feedbackActive) return; // Already answered or timed out

    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }
    
    const endTime = performance.now();
    const timeTaken = Math.min(endTime - questionStartTime, MAX_QUESTION_DURATION_MS); // Cap timeTaken at max duration

    setPlayerSelection(option);
    setFeedbackActive(true);
    const isCorrect = option === question.correctSynonym;
    setCurrentFeedbackType(isCorrect ? FeedbackType.CORRECT : FeedbackType.INCORRECT);

    setTimeout(() => {
      onOptionSelect(option, timeTaken);
    }, 1500); // Delay to show feedback
  };

  const remainingTime = Math.max(0, MAX_QUESTION_DURATION_MS - timeElapsedMs);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-xl text-center">
        <header className="mb-4 sm:mb-6">
          <p className="text-sm font-medium text-sky-600">
            {questionNumber}. Galdera / {totalQuestions}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Zein da sinonimoa?</h1>
        </header>

        <TimerBar remainingTime={remainingTime} maxTime={MAX_QUESTION_DURATION_MS} />

        <div className="my-6 sm:my-8 p-6 sm:p-8 bg-sky-600 rounded-lg shadow-inner">
          <p className="text-sm text-sky-200 mb-1">Hitz hau:</p>
          <p className="text-3xl sm:text-4xl font-bold text-white break-words">
            {question.targetWord}
          </p>
        </div>

        <OptionsList
          options={question.options}
          onOptionSelect={handlePlayerChoice}
          selectedOption={playerSelection}
          correctOption={question.correctSynonym}
          // allCorrectSynonyms might be useful if question.correctSynonym is one of many possibilities.
          // For now, assuming question.correctSynonym is the single target for this interface.
          feedback={currentFeedbackType}
          disabled={feedbackActive}
        />
      </div>
    </div>
  );
};

export default GameComponent;
