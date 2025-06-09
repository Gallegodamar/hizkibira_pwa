
import React from 'react';
import { UserAnswer } from '../types';
import Button from './Button';
// import { BASE_SCORE_CORRECT_ANSWER } from '../constants'; // Ya no se necesita para este cálculo

interface ResultsComponentProps {
  answers: UserAnswer[];
  score: number; 
  totalQuestions: number;
  onPlayAgain: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ answers, score, totalQuestions, onPlayAgain }) => {
  // const maxPossibleScorePerQuestion = BASE_SCORE_CORRECT_ANSWER; // Eliminado
  // const maxTotalPossibleScore = totalQuestions * maxPossibleScorePerQuestion; // Eliminado
  // const percentage = maxTotalPossibleScore > 0 ? Math.round((score / maxTotalPossibleScore) * 100) : 0; // Percentage calculation removed

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 sm:p-6">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Jokoa Amaituta!</h1>
        <p className="text-5xl sm:text-6xl font-extrabold my-4 sm:my-6">
          {score.toFixed(2)} puntu
        </p>
        {/* Percentage display removed from here */}
        {/* <p className="text-xl sm:text-2xl text-indigo-200 mb-6 sm:mb-8">({percentage}%)</p> */}

        <div className="space-y-4 sm:space-y-5 my-6 sm:my-8 max-h-80 overflow-y-auto pr-2 text-left">
          {answers.map((answer, index) => (
            <div key={answer.questionId} className="bg-white/5 p-3 sm:p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-indigo-300">
                  {index + 1}. Hitza: <span className="font-semibold text-white">{answer.targetWord}</span>
                </p>
                <p className={`text-sm font-semibold ${answer.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                  {answer.score.toFixed(2)} pt.
                </p>
              </div>
              <p className={`text-base sm:text-lg ${answer.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                Zure erantzuna: <span className="font-semibold">{answer.selectedOption}</span>
                {answer.isCorrect ? 
                  <span className="ml-2">✅</span> : 
                  <span className="ml-2">❌</span>
                }
              </p>
              {!answer.isCorrect && (
                <p className="text-base sm:text-lg text-green-300 mt-1">
                  Zuzena: <span className="font-semibold">{answer.correctSynonym}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        <Button onClick={onPlayAgain} variant="primary" className="mt-6 sm:mt-8 text-lg sm:text-xl px-8 py-3">
          Berriro Jokatu 
        </Button>
         <p className="mt-8 text-xs text-indigo-300">
            Eskerrik asko Hizkibira jolasteagatik! Sakatu "Berriro Jokatu" hitz sorta berri batekin hasteko.
        </p>
      </div>
    </div>
  );
};

export default ResultsComponent;
