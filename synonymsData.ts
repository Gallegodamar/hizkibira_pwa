
import { DailyQuestion, SynonymDictionaryEntry, RawSynonymEntry } from './types';

// Helper to shuffle options
const shuffleOptions = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper to ensure options are distinct (case-insensitive) before adding to a Set
const addUniqueOptionToSet = (set: Set<string>, option: string): boolean => {
    const trimmedOption = option.trim();
    const lowerOption = trimmedOption.toLowerCase();
    let found = false;
    set.forEach(existing => {
        if (existing.toLowerCase() === lowerOption) {
            found = true;
        }
    });
    if (!found) {
        set.add(trimmedOption);
        return true;
    }
    return false;
};

let questionIdCounter = 0;

// Cache for the fetched synonym data
let cachedSynonymData: RawSynonymEntry[] | null = null;

// Function to fetch and cache synonym data from JSON file
const fetchAndCacheSynonymData = async (): Promise<RawSynonymEntry[]> => {
  if (cachedSynonymData) {
    return cachedSynonymData;
  }
  try {
    const response = await fetch('/synonyms.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} while fetching synonyms.json`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.some(item => typeof item.targetWord !== 'string' || typeof item.correctSynonym !== 'string' || !Array.isArray(item.optionsWithCorrect))) {
        throw new Error('Invalid data structure in synonyms.json');
    }
    cachedSynonymData = data as RawSynonymEntry[];
    return cachedSynonymData;
  } catch (error) {
    console.error("Error fetching or parsing synonym data:", error);
    throw error; // Re-throw to be caught by calling functions
  }
};


export const getAllPredefinedQuestions = async (): Promise<DailyQuestion[]> => {
  questionIdCounter = 0;
  const rawSynonymData = await fetchAndCacheSynonymData();

  const uniqueRawSynonymData = rawSynonymData.filter((item, index, self) =>
    index === self.findIndex((t) => t.targetWord.toLowerCase() === item.targetWord.toLowerCase())
  );

  const allSynonymsInDataset = Array.from(new Set(
    uniqueRawSynonymData.flatMap(entry => {
      const synonyms = new Set<string>();
      addUniqueOptionToSet(synonyms, entry.correctSynonym);
      entry.optionsWithCorrect.forEach(opt => addUniqueOptionToSet(synonyms, opt));
      return Array.from(synonyms);
    })
  ));

  return uniqueRawSynonymData.map(item => {
    const currentCorrectSynonym = item.correctSynonym.trim();
    const finalOptionsSet = new Set<string>();

    addUniqueOptionToSet(finalOptionsSet, currentCorrectSynonym);

    const localSynonyms = Array.from(new Set(item.optionsWithCorrect.map(s => s.trim())));
    const shuffledLocalSynonyms = shuffleOptions(localSynonyms);

    for (const localSyn of shuffledLocalSynonyms) {
      if (finalOptionsSet.size >= 3) break;
      addUniqueOptionToSet(finalOptionsSet, localSyn);
    }

    if (finalOptionsSet.size < 3) {
      const potentialGlobalDistractors = allSynonymsInDataset.filter(syn => {
        const synLower = syn.toLowerCase();
        if (synLower === item.targetWord.toLowerCase()) return false;
        if (synLower === currentCorrectSynonym.toLowerCase()) return false;
        if (item.optionsWithCorrect.map(o => o.toLowerCase()).includes(synLower)) return false;
        
        let isAlreadySelected = false;
        finalOptionsSet.forEach(selectedOpt => {
          if (selectedOpt.toLowerCase() === synLower) {
              isAlreadySelected = true;
          }
        });
        return !isAlreadySelected;
      });

      const shuffledGlobalDistractors = shuffleOptions(potentialGlobalDistractors);
      for (const globalDistractor of shuffledGlobalDistractors) {
        if (finalOptionsSet.size >= 3) break;
        addUniqueOptionToSet(finalOptionsSet, globalDistractor);
      }
    }
    
    let finalOptionsArray = Array.from(finalOptionsSet);

    if (finalOptionsArray.length < 3) {
       const fallbackPool = shuffleOptions(allSynonymsInDataset.filter(syn => {
          let isAlreadySelected = false;
          finalOptionsArray.forEach(selectedOpt => {
              if (selectedOpt.toLowerCase() === syn.toLowerCase()) {
                  isAlreadySelected = true;
              }
          });
          return !isAlreadySelected && syn.toLowerCase() !== item.targetWord.toLowerCase(); // Ensure fallback is not the target word itself
      }));


      for (const fallbackSyn of fallbackPool) {
          if (finalOptionsArray.length >= 3) break;
          if (!finalOptionsArray.map(o => o.toLowerCase()).includes(fallbackSyn.toLowerCase())) { // Ensure unique
            finalOptionsArray.push(fallbackSyn.trim());
          }
      }
    }
     // If still not enough options (e.g. very small dataset or many identical items), fill with correct synonym or placeholders
    if (finalOptionsArray.length === 0) { 
        finalOptionsArray = [currentCorrectSynonym, currentCorrectSynonym + " (A)", currentCorrectSynonym + " (B)"];
         // Ensure these placeholders are distinct if correctSynonym is short
        finalOptionsArray = Array.from(new Set(finalOptionsArray)); // Deduplicate
        while(finalOptionsArray.length < 3) finalOptionsArray.push(`Aukera ${finalOptionsArray.length + 1}`);

    } else {
        let fillCounter = 1;
        while (finalOptionsArray.length < 3) {
            const lastOption = finalOptionsArray.length > 0 ? finalOptionsArray[finalOptionsArray.length - 1] : currentCorrectSynonym;
            let placeholder = `${lastOption} (${String.fromCharCode(65 + fillCounter++)})`;
            // Ensure placeholder uniqueness if lastOption is very generic
            if (finalOptionsArray.map(o => o.toLowerCase()).includes(placeholder.toLowerCase())) {
                placeholder = `Aukera Gehigarria ${fillCounter}`;
            }
            finalOptionsArray.push(placeholder);
        }
    }
    
    return {
      id: `pd_q_${questionIdCounter++}`,
      targetWord: item.targetWord,
      correctSynonym: currentCorrectSynonym, 
      options: shuffleOptions(finalOptionsArray.slice(0, 3)) 
    };
  });
};

export const getSynonymDictionary = async (): Promise<SynonymDictionaryEntry[]> => {
  const rawSynonymData = await fetchAndCacheSynonymData();
  const dictionaryMap = new Map<string, Set<string>>();

  rawSynonymData.forEach(item => {
    const target = item.targetWord.trim();
    if (!dictionaryMap.has(target)) {
      dictionaryMap.set(target, new Set<string>());
    }
    const synonymsSet = dictionaryMap.get(target)!;
    
    addUniqueOptionToSet(synonymsSet, item.correctSynonym.trim());
    item.optionsWithCorrect.forEach(opt => {
      addUniqueOptionToSet(synonymsSet, opt.trim());
    });
  });

  const sortedEntries: SynonymDictionaryEntry[] = [];
  dictionaryMap.forEach((synonymsSet, targetWord) => {
    sortedEntries.push({
      targetWord,
      synonyms: Array.from(synonymsSet).sort((a, b) => a.localeCompare(b, 'eu')),
    });
  });
  
  return sortedEntries.sort((a,b) => a.targetWord.localeCompare(b.targetWord, 'eu'));
};

// Re-export RawSynonymEntry if it's used elsewhere, though it's mainly internal to this module now.
export type { RawSynonymEntry };
