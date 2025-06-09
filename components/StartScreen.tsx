
import React from 'react';
import Button from './Button';

interface StartScreenProps {
  onStartGame: () => void;
  onGoToConsultation: () => void;
  onManualRefresh: () => void; // New prop for manual refresh
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onGoToConsultation, onManualRefresh }) => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-8 text-center bg-gradient-to-br from-sky-500 to-sky-700 text-white"
    >
      <div className="flex-grow flex flex-col justify-center items-center w-full">
        <div className="my-8 sm:my-12">
          <h1 
            className="text-6xl sm:text-8xl font-extrabold text-white"
          >
            KAIXO!
          </h1>
          <p 
            className="text-4xl sm:text-6xl font-bold mt-2 text-white"
          >
            ONGI ETORRI
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-xs sm:max-w-sm pb-8 space-y-4">
        <Button 
          onClick={onStartGame} 
          className="w-full text-2xl py-4" 
          variant="primary"
          aria-label="Hasi jolasa"
        >
          HASI JOLASA
        </Button>
        <Button 
          onClick={onGoToConsultation} 
          className="w-full text-lg py-3" 
          variant="secondary"
          aria-label="Sinonimoak kontsultatu"
        >
          Sinonimoak Kontsultatu
        </Button>
      </div>
       <footer 
        className="py-6 text-sm text-white opacity-90"
        >
        Hizkibira Jokoa
      </footer>

      <button
        onClick={onManualRefresh}
        className="fixed bottom-4 right-4 bg-sky-600 hover:bg-sky-700 text-white font-bold p-3 w-12 h-12 flex items-center justify-center text-2xl rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-75 z-20 transition-transform active:scale-90"
        aria-label="Galderak eskuz freskatu"
        title="Galderak eskuz freskatu"
      >
        *
      </button>
    </div>
  );
};

export default StartScreen;