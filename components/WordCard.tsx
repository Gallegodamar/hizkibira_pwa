import React from 'react';

interface WordCardProps {
  word: string;
  label?: string;
}

const WordCard: React.FC<WordCardProps> = ({ word, label }) => {
  return (
    <div className="w-full max-w-xl text-center my-6 md:my-8">
      {label && <p className="text-lg sm:text-xl text-orange-100 mb-2 sm:mb-3">{label}</p>}
      <h2 className="text-4xl sm:text-5xl font-bold text-white break-words">{word}</h2>
    </div>
  );
};

export default WordCard;