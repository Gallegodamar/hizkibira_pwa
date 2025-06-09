
import React from 'react';
import Button from './Button';

interface LevelSelectionScreenProps {
  unlockedLevel: number;
  onSelectLevel: (level: number) => void;
  onGoBack: () => void;
}

const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({ unlockedLevel, onSelectLevel, onGoBack }) => {
  const levels = [1, 2, 3, 4];
  
  // Icons for categories - simplified representation or could use actual SVGs/images
  const levelIcons = [
    // Placeholder icons - ideally replace with actual SVGs or images
    "🐾", // Animal for Level 1 (as per image)
    "🍎", // Food for Level 2
    "👕", // Clothes for Level 3
    "🎨"  // Colors for Level 4
  ];

   const levelCardStyle = "bg-white rounded-xl p-4 sm:p-6 shadow-lg flex flex-col items-center justify-center transition-all duration-150 ease-in-out";
   const enabledCardStyle = "hover:shadow-xl cursor-pointer focus:ring-2 focus:ring-orange-400";
   const disabledCardStyle = "opacity-50 cursor-not-allowed";
   const iconTextStyle = "text-4xl sm:text-5xl mb-2 sm:mb-3";
   const levelNameStyle = "text-lg sm:text-xl font-semibold"; // color will be #6A994E

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8"
      style={{ backgroundColor: '#FAF0D7' }} // Light yellow background from image
    >
      <header className="w-full max-w-3xl flex justify-start items-center mb-6 sm:mb-10">
        <button 
            onClick={onGoBack} 
            className="text-3xl sm:text-4xl p-2 rounded-full hover:bg-black/10"
            style={{ color: '#6A994E' }}
            aria-label="Volver"
        >
          &larr;
        </button>
      </header>

      <h1 
        className="text-3xl sm:text-5xl font-bold text-center mb-8 sm:mb-12"
        style={{ color: '#6A994E' }} // Green text from image
      >
        ELIGE UN NIVEL
      </h1>
      
      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-md sm:max-w-xl">
        {levels.map((level, index) => {
          const isLocked = level > unlockedLevel;
          return (
            <button
              key={level}
              onClick={() => !isLocked && onSelectLevel(level)}
              disabled={isLocked}
              className={`${levelCardStyle} ${isLocked ? disabledCardStyle : enabledCardStyle}`}
              aria-label={`Nivel ${level} ${isLocked ? '(Bloqueado)' : ''}`}
            >
              <div className={iconTextStyle} aria-hidden="true">
                {/* For now, simple text icons based on your image. Replace with actual image/SVG if available. */}
                {level === 1 && '🐶'}
                {level === 2 && '🍎'}
                {level === 3 && '👕'}
                {level === 4 && '🎨'}
              </div>
              <span className={levelNameStyle} style={{ color: '#6A994E' }}>
                NIVEL {level}
              </span>
              {isLocked && (
                <div className="absolute top-2 right-2 text-xl" aria-hidden="true">
                  🔒
                </div>
              )}
            </button>
          );
        })}
      </div>
      <footer className="py-6 mt-auto text-sm" style={{ color: '#A7C957' }}>
        Hizkibira Jokoa Mailak
      </footer>
    </div>
  );
};

export default LevelSelectionScreen;
