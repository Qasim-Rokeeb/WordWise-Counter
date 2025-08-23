
import syllable from 'syllable';
import { franc } from 'franc';
import stopwords from 'stopwords-iso';

export interface AnalysisOptions {
  includeSpaces: boolean;
  ignorePunctuation: boolean;
  ignoreStopwords: boolean;
  minWordLength: string;
  maxWordLength: string;
}

const calculateReadability = (
  wordCount: number,
  sentenceCount: number,
  syllableCount: number
) => {
  if (wordCount === 0 || sentenceCount === 0) return 0;
  const score =
    206.835 -
    1.015 * (wordCount / sentenceCount) -
    84.6 * (syllableCount / wordCount);
  return Math.max(0, Math.min(100, score)); // Ensure score is between 0 and 100
};

export const getReadabilityDescription = (score: number) => {
  if (score >= 90) return 'Very easy to read. Easily understood by an average 11-year-old student.';
  if (score >= 80) return 'Easy to read. Conversational English for consumers.';
  if (score >= 70) return 'Fairly easy to read.';
  if (score >= 60) return 'Plain English. Easily understood by 13- to 15-year-old students.';
  if (score >= 50) return 'Fairly difficult to read.';
  if (score >= 30) return 'Difficult to read.';
  return 'Very difficult to read. Best understood by university graduates.';
}


export const analyzeText = (inputText: string, options: AnalysisOptions) => {
    let processedText = inputText;
    if (options.ignorePunctuation) {
    processedText = processedText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    }
    
    const lang = franc(inputText, {minLength: 3, only: ['eng', 'spa', 'fra', 'deu', 'rus', 'ita', 'por', 'nld']});
    const langCode = lang === 'und' ? 'en' : lang.slice(0, 2);
    const stopwordSet = new Set(stopwords[langCode as keyof typeof stopwords] || []);


    const words = processedText.trim().split(/\s+/).filter(Boolean);
    
    const filteredWords = options.ignoreStopwords
    ? words.filter(word => !stopwordSet.has(word.toLowerCase()))
    : words;

    const sentences = inputText.match(/[^.!?]+[.!?]+/g) || (inputText ? [inputText] : []);

    const wordCount = filteredWords.length;
    const charCount = options.includeSpaces
    ? inputText.length
    : inputText.replace(/\s/g, '').length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    const syllableCount = filteredWords.reduce(
    (acc, word) => acc + syllable(word),
    0
    );
    const readabilityScore = calculateReadability(
    wordCount,
    sentences.length,
    syllableCount
    );

    const wordLengthDistribution = filteredWords.reduce((acc, word) => {
        const len = word.length;
        if (len > 0) {
        acc[len] = (acc[len] || 0) + 1;
        }
        return acc;
    }, {} as Record<number, number>);
    
    const chartData = Object.entries(wordLengthDistribution).map(([length, count]) => ({
    length: parseInt(length),
    count,
    })).sort((a,b) => a.length - b.length);

    const highlightedWords = filteredWords.filter(word => {
    const len = word.length;
    const min = parseInt(options.minWordLength, 10);
    const max = parseInt(options.maxWordLength, 10);
    const minMatch = !isNaN(min) ? len >= min : true;
    const maxMatch = !isNaN(max) ? len <= max : true;
    return minMatch && maxMatch;
    });

    return {
    wordCount,
    charCount,
    readingTime,
    syllableCount,
    readabilityScore,
    chartData,
    highlightedWords: new Set(highlightedWords),
    };
};
