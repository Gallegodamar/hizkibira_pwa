
import React, { useState } from 'react';
import { SynonymDictionaryEntry } from '../types';
import Button from './Button';

interface ConsultationScreenProps {
  synonymData: SynonymDictionaryEntry[];
  onGoBack: () => void;
}

const ConsultationScreen: React.FC<ConsultationScreenProps> = ({ synonymData, onGoBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = synonymData.filter(entry => 
    entry.targetWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.synonyms.some(syn => syn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-sky-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Button 
            onClick={onGoBack}
            variant="secondary" // Light button on dark header
            className="!w-auto !px-3 !py-1.5 text-sky-700 bg-white hover:bg-sky-100"
            ariaLabel="Itzuli hasierako pantailara"
          >
            &larr; Itzuli
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Sinonimoen Hiztegia</h1>
          <div className="w-1/4"></div> {/* Spacer for balance */}
        </div>
        <div className="container mx-auto mt-4">
          <input
            type="text"
            placeholder="Bilatu hitza edo sinonimoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 rounded-md border border-sky-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 text-slate-800"
            aria-label="Bilatu sinonimoak"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 overflow-y-auto">
        {filteredData.length === 0 && (
          <p className="text-center text-slate-600 mt-8 text-lg">
            {searchTerm ? "Ez da emaitzarik aurkitu zure bilaketarako." : "Ez dago sinonimorik erakusteko."}
          </p>
        )}
        <div className="space-y-4">
          {filteredData.map((entry) => (
            <div key={entry.targetWord} className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-slate-200">
              <h2 className="text-xl sm:text-2xl font-semibold text-sky-700 mb-2 break-words">
                {entry.targetWord}
              </h2>
              {entry.synonyms && entry.synonyms.length > 0 ? (
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed break-words">
                  <span className="font-medium text-slate-700">Sinonimoak:</span> {entry.synonyms.join(', ')}
                </p>
              ) : (
                <p className="text-slate-500 italic">Ez da sinonimorik aurkitu hitz honentzat.</p>
              )}
            </div>
          ))}
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-slate-500 border-t border-slate-200">
         Hizkibira Jokoa &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default ConsultationScreen;
