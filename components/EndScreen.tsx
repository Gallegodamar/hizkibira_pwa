
import React from 'react';
import Button from './Button';
import { SCORE_TO_PASS_LEVEL } from '../constants'; // Assuming this is defined

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  onNavigate: () => void; // Navigates to level selection or next action
  currentLevel: number;
  unlockedLevel: number; // To know if next level can be suggested
  didPass: boolean;
}

const EndScreen: React.FC<EndScreenProps> = ({ 
    score, 
    totalQuestions, 
    onNavigate, 
    currentLevel, 
    unlockedLevel,
    didPass
}) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  let titleMessage = "Maila Amaituta!";
  let feedbackMessage = "";
  let buttonText = "Maila Hautaketa"; // Default button text

  if (didPass) {
    feedbackMessage = percentage === 100 ? "Primeran! Guztiak asmatu dituzu!" : "Oso Ondo! Maila gainditu duzu!";
    if (currentLevel < 4) {
      buttonText = "Hurrengo Maila";
    } else {
      titleMessage = "Zorionak! Jokoa Osatu Duzu!";
      feedbackMessage = "Jokoko maila guztiak gainditu dituzu!";
      buttonText = "Hasierara Itzuli"; // Or "Maila Aukeraketa" if preferred
    }
  } else {
    feedbackMessage = `Ez duzu maila gainditu (gutxienez ${SCORE_TO_PASS_LEVEL} behar dira). Saiatu berriro!`;
    buttonText = "Saiatu Berriro"; 
    // Note: "Saiatu Berriro" will be handled by onNavigate, which currently goes to Level Selection.
    // If direct retry of the same level is needed, App.tsx logic would need adjustment.
    // For now, it will take to Level Selection, where user can pick the same level.
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-700 text-yellow-400 p-6 sm:p-8 text-center">
      <div className="bg-indigo-600/80 backdrop-blur-md p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">{titleMessage}</h2>
        <p className="text-2xl mb-2">Zure Puntuazioa Maila Honetan:</p>
        <p className="text-5xl sm:text-7xl font-bold mb-4">{score} / {totalQuestions}</p>
        <p className="text-xl mb-1 sm:mb-2 text-indigo-200">({percentage}%)</p>
        <p className="text-xl sm:text-2xl mb-8">{feedbackMessage}</p>
        <Button 
          onClick={onNavigate} 
          className="text-xl sm:text-2xl px-8 py-3 sm:py-4" 
          variant="primary" 
        >
          {buttonText}
        </Button>
      </div>
       <footer className="absolute bottom-4 text-sm text-indigo-300/70">
        Hizkibira Jokoa
      </footer>
    </div>
  );
};

export default EndScreen;
