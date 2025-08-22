
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { modifyText } from '@/ai/flows/modify-text';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Copy,
  Replace,
  PlusCircle,
  XCircle,
  FileUp,
  BarChartHorizontal,
} from 'lucide-react';
import { ModifyTextInput } from '@/ai/schemas/modify-text';
import { Header } from '@/components/header';
import syllable from 'syllable';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in',
  'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not',
  'now', 'o', 'of', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 's', 'same', 'she', 'should', 'so', 'some', 'such', 't', 'than', 'that', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
  'who', 'whom', 'why', 'will', 'with', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);


interface Modification {
  id: number;
  type: string;
  length: string;
}

interface AnalysisOptions {
  includeSpaces: boolean;
  ignorePunctuation: boolean;
  ignoreStopwords: boolean;
  minWordLength: string;
  maxWordLength: string;
}

const initialAnalysisOptions: AnalysisOptions = {
  includeSpaces: true,
  ignorePunctuation: false,
  ignoreStopwords: false,
  minWordLength: '',
  maxWordLength: '',
};

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

const getReadabilityDescription = (score: number) => {
  if (score >= 90) return 'Very easy to read. Easily understood by an average 11-year-old student.';
  if (score >= 80) return 'Easy to read. Conversational English for consumers.';
  if (score >= 70) return 'Fairly easy to read.';
  if (score >= 60) return 'Plain English. Easily understood by 13- to 15-year-old students.';
  if (score >= 50) return 'Fairly difficult to read.';
  if (score >= 30) return 'Difficult to read.';
  return 'Very difficult to read. Best understood by university graduates.';
}

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [modifications, setModifications] = useState<Modification[]>([
    { id: 1, type: 'changeLength', length: '100' },
  ]);
  const [modifiedText, setModifiedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [analysisOptions, setAnalysisOptions] = useState(initialAnalysisOptions);
  const [modifiedAnalysisOptions, setModifiedAnalysisOptions] = useState(initialAnalysisOptions);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const analyzeText = useCallback(
    (inputText: string, options: AnalysisOptions) => {
      let processedText = inputText;
      if (options.ignorePunctuation) {
        processedText = processedText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      }

      const words = processedText.trim().split(/\s+/).filter(Boolean);
      
      const filteredWords = options.ignoreStopwords
        ? words.filter(word => !STOPWORDS.has(word.toLowerCase()))
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
    },
    []
  );

  const originalTextAnalysis = useMemo(
    () => analyzeText(text, analysisOptions),
    [text, analysisOptions, analyzeText]
  );
  const modifiedTextAnalysis = useMemo(
    () => analyzeText(modifiedText, modifiedAnalysisOptions),
    [modifiedText, modifiedAnalysisOptions, analyzeText]
  );

  const handleModificationChange = (
    id: number,
    field: keyof Omit<Modification, 'id'>,
    value: string
  ) => {
    setModifications((mods) =>
      mods.map((mod) => (mod.id === id ? { ...mod, [field]: value } : mod))
    );
  };

  const addModification = () => {
    setModifications((mods) => [
      ...mods,
      { id: Date.now(), type: 'summarize', length: '' },
    ]);
  };

  const removeModification = (id: number) => {
    setModifications((mods) => mods.filter((mod) => mod.id !== id));
  };
  
  const handleModify = useCallback(async () => {
    if (!text) {
      toast({
        title: 'Error',
        description: 'Please enter some text to modify.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setModifiedText('');
    try {
      const input: ModifyTextInput = {
        text,
        modifications: modifications.map(({ type, length }) => ({
          type,
          length,
        })),
      };
      const result = await modifyText(input);
      setModifiedText(result.text);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to modify text. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [text, modifications, toast]);

  const handleClear = useCallback(() => {
    setText('');
    setModifiedText('');
  }, []);

  const handleCopy = useCallback(() => {
    if(!modifiedText) return;
    navigator.clipboard.writeText(modifiedText);
    toast({
      title: 'Copied!',
      description: 'The modified text has been copied to your clipboard.',
    });
  }, [modifiedText, toast]);

  const handleSwitch = useCallback(() => {
    if(!modifiedText) return;
    setText(modifiedText);
    setModifiedText('');
  }, [modifiedText]);


  const handleAnalysisOptionChange = (
    setter: React.Dispatch<React.SetStateAction<AnalysisOptions>>,
    field: keyof AnalysisOptions,
    value: boolean | string
  ) => {
    setter((options) => ({ ...options, [field]: value }));
  };
  
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
        toast({
            title: "Success",
            description: `Imported text from ${file.name}`
        });
      };
      reader.readAsText(file);
    }
    // Reset file input to allow importing the same file again
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = {
      originalText: text,
      analysis: {
        ...originalTextAnalysis,
        readabilityDescription: getReadabilityDescription(originalTextAnalysis.readabilityScore),
        highlightedWords: Array.from(originalTextAnalysis.highlightedWords)
      },
      modifiedText: modifiedText,
      modifiedAnalysis: {
        ...modifiedTextAnalysis,
        readabilityDescription: getReadabilityDescription(modifiedTextAnalysis.readabilityScore),
        highlightedWords: Array.from(modifiedTextAnalysis.highlightedWords)
      },
    };

    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = 'wordwise_analysis.json';
      mimeType = 'application/json';
    } else {
      const headers = 'Metric,Original,Modified\n';
      const rows = [
        `Word Count,${data.analysis.wordCount},${data.modifiedAnalysis.wordCount}`,
        `Character Count,${data.analysis.charCount},${data.modifiedAnalysis.charCount}`,
        `Reading Time (minutes),${data.analysis.readingTime},${data.modifiedAnalysis.readingTime}`,
        `Syllable Count,${data.analysis.syllableCount},${data.modifiedAnalysis.syllableCount}`,
        `Readability Score,${data.analysis.readabilityScore.toFixed(2)},${data.modifiedAnalysis.readabilityScore.toFixed(2)}`,
        `Highlighted Words,"${data.analysis.highlightedWords.join(', ')}","${data.modifiedAnalysis.highlightedWords.join(', ')}"`,
      ];
      content = headers + rows.join('\n');
      filename = 'wordwise_analysis.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({
        title: "Exported!",
        description: `Your analysis has been downloaded as ${filename}.`
    });
  };

  const renderHighlightedText = (
    text: string,
    highlightedWords: Set<string>,
    options: AnalysisOptions
  ) => {
    if (
      !options.minWordLength &&
      !options.maxWordLength
    ) {
      return null;
    }

    const words = text.split(/(\s+)/); // Split by space but keep separators
    return (
      <p className="min-h-[100px] resize-y rounded-lg p-4 text-base bg-muted/30 whitespace-pre-wrap">
        {words.map((word, index) => {
          const wordToCheck = options.ignorePunctuation ? word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '') : word;
          return highlightedWords.has(wordToCheck) ? (
            <mark key={index} className="bg-accent/50 text-accent-foreground px-1 rounded">
              {word}
            </mark>
          ) : (
            <span key={index}>{word}</span>
          );
        })}
      </p>
    );
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
      if (active && payload && payload.length) {
        return (
          <div className="p-2 bg-background/80 border rounded-lg shadow-lg">
            <p className="label">{`Word Length: ${label}`}</p>
            <p className="intro">{`Count: ${payload[0].value}`}</p>
          </div>
        );
      }
      return null;
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey)) {
            switch(event.key.toLowerCase()){
                case 'enter':
                    event.preventDefault();
                    handleModify();
                    break;
                case 'backspace':
                     event.preventDefault();
                    handleClear();
                    break;
                case 'c':
                    if (event.shiftKey && modifiedText) {
                        event.preventDefault();
                        handleCopy();
                    }
                    break;
                case 's':
                    if (event.shiftKey && modifiedText) {
                        event.preventDefault();
                        handleSwitch();
                    }
                    break;
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [handleModify, handleClear, handleCopy, handleSwitch, modifiedText]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="w-full relative mt-8">
          <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold tracking-tight md:text-4xl">
                WordWise Counter
              </CardTitle>
              <CardDescription className="text-center">
                Paste or type your text below for an instant word and character
                count. Use AI to modify your text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="text-input"
                    className="text-lg font-semibold"
                  >
                    Your Text
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileImport}
                      accept=".txt,.md"
                    />
                    <Button onClick={handleImportClick} variant="outline" size="sm">
                       <FileUp className="mr-2" />
                       Import
                    </Button>
                    <Button onClick={handleClear} variant="outline" size="sm">
                      Clear Text
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="text-input"
                  placeholder="Start writing, or paste your text here..."
                  className="min-h-[250px] resize-y rounded-lg p-4 text-base focus-visible:ring-accent bg-background/50"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Text input area"
                />
                 <div className="mt-2">
                    {renderHighlightedText(text, originalTextAnalysis.highlightedWords, analysisOptions)}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <Label className="text-lg font-semibold">AI Modifications</Label>
                {modifications.map((mod, index) => (
                  <div
                    key={mod.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`modificationType-${mod.id}`}>
                          Modification {index + 1}
                        </Label>
                        <Select
                          value={mod.type}
                          onValueChange={(value) =>
                            handleModificationChange(mod.id, 'type', value)
                          }
                        >
                          <SelectTrigger id={`modificationType-${mod.id}`}>
                            <SelectValue placeholder="Select a modification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="changeLength">
                              Change Length
                            </SelectItem>
                            <SelectItem value="summarize">Summarize</SelectItem>
                            <SelectItem value="explainLikeImFive">
                              Explain Like I'm Five
                            </SelectItem>
                            <SelectItem value="explainCreatively">
                              Explain Creatively
                            </SelectItem>
                            <SelectItem value="humanize">Humanize</SelectItem>
                            <SelectItem value="jargonize">Jargonize</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {mod.type === 'changeLength' && (
                        <div className="flex flex-col gap-2">
                          <Label htmlFor={`length-${mod.id}`}>Word Count</Label>
                          <Input
                            id={`length-${mod.id}`}
                            placeholder="e.g. 100"
                            value={mod.length}
                            onChange={(e) =>
                              handleModificationChange(
                                mod.id,
                                'length',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                     <div className="flex gap-2 items-end md:col-start-3 justify-self-end">
                      {modifications.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeModification(mod.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <XCircle />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={addModification}>
                    <PlusCircle className="mr-2" />
                    Add Modification
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>(Ctrl + Enter)</span>
                    <Button onClick={handleModify} disabled={isLoading}>
                      {isLoading ? 'Modifying...' : 'Modify Text'}
                    </Button>
                  </div>
                </div>
              </div>

              {modifiedText && (
                <div className="mt-6">
                  <CardHeader className="p-0 mb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Modified Text</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <span>(Ctrl+Shift+S)</span>
                           <Button variant="ghost" size="icon" onClick={handleSwitch} title="Swap text">
                            <Replace className="h-4 w-4" />
                            <span className="sr-only">Switch</span>
                           </Button>
                        </div>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <span>(Ctrl+Shift+C)</span>
                           <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy text">
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                           </Button>
                        </div>
                    </div>
                  </CardHeader>
                  <Textarea
                    readOnly
                    value={modifiedText}
                    className="min-h-[150px] resize-y rounded-lg p-4 text-base bg-muted/30"
                  />
                  <div className="mt-2">
                    {renderHighlightedText(modifiedText, modifiedTextAnalysis.highlightedWords, modifiedAnalysisOptions)}
                  </div>
                   <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 rounded-b-lg pt-2">
                        <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Words
                          </Label>
                          <span className="text-4xl font-bold text-accent">
                            {modifiedTextAnalysis.wordCount}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Characters
                          </Label>
                          <span className="text-4xl font-bold text-accent">
                            {modifiedTextAnalysis.charCount}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Reading Time
                          </Label>
                          <span className="text-4xl font-bold text-accent">
                            ~{modifiedTextAnalysis.readingTime}
                            <span className="text-lg">min</span>
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Syllables
                          </Label>
                          <span className="text-4xl font-bold text-accent">
                            {modifiedTextAnalysis.syllableCount}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Readability
                          </Label>
                          <span className="text-4xl font-bold text-accent">
                            {modifiedTextAnalysis.readabilityScore.toFixed(0)}
                          </span>
                        </div>
                   </div>
                    {modifiedTextAnalysis.readabilityScore > 0 && <p className="text-sm text-muted-foreground text-center mt-2">{getReadabilityDescription(modifiedTextAnalysis.readabilityScore)}</p>}
                     <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                            id="mod-include-spaces"
                            checked={modifiedAnalysisOptions.includeSpaces}
                            onCheckedChange={(checked) =>
                                handleAnalysisOptionChange(setModifiedAnalysisOptions, 'includeSpaces', checked)
                            }
                            />
                            <Label htmlFor="mod-include-spaces">
                            Include spaces in character count
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                            id="mod-ignore-punctuation"
                            checked={modifiedAnalysisOptions.ignorePunctuation}
                            onCheckedChange={(checked) =>
                                handleAnalysisOptionChange(setModifiedAnalysisOptions, 'ignorePunctuation', checked)
                            }
                            />
                            <Label htmlFor="mod-ignore-punctuation">
                            Ignore Punctuation
                            </Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch
                            id="mod-ignore-stopwords"
                            checked={modifiedAnalysisOptions.ignoreStopwords}
                            onCheckedChange={(checked) =>
                                handleAnalysisOptionChange(setModifiedAnalysisOptions, 'ignoreStopwords', checked)
                            }
                            />
                            <Label htmlFor="mod-ignore-stopwords">
                             Ignore Stopwords (e.g., "the", "a")
                            </Label>
                        </div>
                    </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 rounded-b-lg bg-muted/30 p-4 sm:p-6">
              <div className="w-full flex justify-between items-center">
                <Label className="text-lg font-semibold">
                  Original Text Analysis
                </Label>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportData('json')}>Export JSON</Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('csv')}>Export CSV</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Words
                  </Label>
                  <span className="text-4xl font-bold text-accent">
                    {originalTextAnalysis.wordCount}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Characters
                  </Label>
                  <span className="text-4xl font-bold text-accent">
                    {originalTextAnalysis.charCount}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Reading Time
                  </Label>
                  <span className="text-4xl font-bold text-accent">
                    ~{originalTextAnalysis.readingTime}
                    <span className="text-lg">min</span>
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Syllables
                  </Label>
                  <span className="text-4xl font-bold text-accent">
                    {originalTextAnalysis.syllableCount}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Readability
                  </Label>
                  <span className="text-4xl font-bold text-accent">
                    {originalTextAnalysis.readabilityScore.toFixed(0)}
                  </span>
                </div>
              </div>
              {originalTextAnalysis.readabilityScore > 0 && <p className="text-sm text-muted-foreground text-center mt-2 w-full">{getReadabilityDescription(originalTextAnalysis.readabilityScore)}</p>}
               <div className="w-full flex flex-col gap-4 mt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                            id="include-spaces"
                            checked={analysisOptions.includeSpaces}
                            onCheckedChange={(checked) =>
                                handleAnalysisOptionChange(setAnalysisOptions, 'includeSpaces', checked)
                            }
                            />
                            <Label htmlFor="include-spaces">
                            Include spaces in character count
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                            id="ignore-punctuation"
                            checked={analysisOptions.ignorePunctuation}
                            onCheckedChange={(checked) =>
                                handleAnalysisOptionChange(setAnalysisOptions, 'ignorePunctuation', checked)
                            }
                            />
                            <Label htmlFor="ignore-punctuation">
                            Ignore Punctuation
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                            id="ignore-stopwords"
                            checked={analysisOptions.ignoreStopwords}
                            onCheckedChange={(checked) =>
                                handleAnalysisOptionChange(setAnalysisOptions, 'ignoreStopwords', checked)
                            }
                            />
                            <Label htmlFor="ignore-stopwords">
                             Ignore Stopwords (e.g., "the", "a")
                            </Label>
                        </div>
                    </div>
                     <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="min-word-length">Min Word Length</Label>
                                <Input
                                id="min-word-length"
                                type="number"
                                placeholder="e.g. 3"
                                value={analysisOptions.minWordLength}
                                onChange={(e) => handleAnalysisOptionChange(setAnalysisOptions, 'minWordLength', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="max-word-length">Max Word Length</Label>
                                <Input
                                id="max-word-length"
                                type="number"
                                placeholder="e.g. 10"
                                value={analysisOptions.maxWordLength}
                                onChange={(e) => handleAnalysisOptionChange(setAnalysisOptions, 'maxWordLength', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                 </div>
                 {originalTextAnalysis.chartData.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChartHorizontal className="text-muted-foreground"/>
                        <Label className="text-lg font-semibold">Word Length Distribution</Label>
                    </div>
                    <div className="w-full h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={originalTextAnalysis.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="length" />
                          <YAxis allowDecimals={false}/>
                          <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent) / 0.2)'}}/>
                          <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
               </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">
          &copy; 2025 WordWise Counter. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
