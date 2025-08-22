
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { modifyText } from "@/ai/flows/modify-text";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, Replace, PlusCircle, XCircle, Clock, BookOpen, BrainCircuit } from "lucide-react";
import { ModifyTextInput } from "@/ai/schemas/modify-text";
import { Header } from "@/components/header";
import { syllable } from "syllable";
import { Switch } from "@/components/ui/switch";


interface Modification {
  id: number;
  type: string;
  length: string;
}

const stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];


export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [modifications, setModifications] = useState<Modification[]>([
    { id: 1, type: "changeLength", length: "100" },
  ]);
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [includeSpaces, setIncludeSpaces] = useState(true);
  const [ignorePunctuation, setIgnorePunctuation] = useState(false);
  const [ignoreStopwords, setIgnoreStopwords] = useState(false);

  
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [syllableCount, setSyllableCount] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);

  const { toast } = useToast();
  
  const processText = (str: string) => {
    let processedText = str;
    if (ignorePunctuation) {
      processedText = processedText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    }
    return processedText;
  }

  const getWordCount = (str: string) => {
    if (str.trim() === "") return 0;
    let words = str.trim().split(/\s+/);
    if(ignoreStopwords) {
      words = words.filter(word => !stopwords.includes(word.toLowerCase()));
    }
    return words.length;
  }
  
  const getSentenceCount = (str: string) => {
    if (str.trim() === "") return 0;
    const sentences = str.match(/[.!?]+/g);
    return sentences ? sentences.length : 1;
  }

  const getSyllableCount = (str: string) => {
    if (str.trim() === "") return 0;
    return syllable(str);
  }
  
  const getCharCount = (str: string, includeSpaces: boolean) => {
    return includeSpaces ? str.length : str.replace(/\s/g, '').length;
  }

  const calculateReadingTime = (wordCount: number) => {
    const wordsPerMinute = 225;
    if (wordCount === 0) return 0;
    const minutes = wordCount / wordsPerMinute;
    return Math.ceil(minutes);
  }

  const calculateReadability = (totalWords: number, totalSentences: number, totalSyllables: number) => {
    if (totalWords === 0 || totalSentences === 0) return 0;
    // Flesch Reading Ease formula
    const score = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
    return Math.max(0, Math.min(100, parseFloat(score.toFixed(1)))); // Clamp between 0 and 100
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const processed = processText(text);
      const currentWordCount = getWordCount(processed);
      const currentSyllableCount = getSyllableCount(processed);
      const currentSentenceCount = getSentenceCount(processed);
      const currentCharCount = getCharCount(text, includeSpaces);

      setWordCount(currentWordCount);
      setCharCount(currentCharCount);
      setReadingTime(calculateReadingTime(currentWordCount));
      setSyllableCount(currentSyllableCount);
      setReadabilityScore(calculateReadability(currentWordCount, currentSentenceCount, currentSyllableCount));
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [text, includeSpaces, ignorePunctuation, ignoreStopwords]);
  
  const { modifiedWordCount, modifiedCharCount, modifiedReadingTime, modifiedSyllableCount, modifiedReadabilityScore } = useMemo(() => {
    const processed = processText(modifiedText);
    const wc = getWordCount(processed);
    const sc = getSyllableCount(processed);
    const sentc = getSentenceCount(processed);
    const cc = getCharCount(modifiedText, includeSpaces);
    return {
      modifiedWordCount: wc,
      modifiedCharCount: cc,
      modifiedReadingTime: calculateReadingTime(wc),
      modifiedSyllableCount: sc,
      modifiedReadabilityScore: calculateReadability(wc, sentc, sc),
    };
  }, [modifiedText, includeSpaces, ignorePunctuation, ignoreStopwords]);


  const handleModificationChange = (id: number, field: keyof Omit<Modification, 'id'>, value: string) => {
    setModifications(mods => mods.map(mod => mod.id === id ? { ...mod, [field]: value } : mod));
  };
  
  const addModification = () => {
    setModifications(mods => [...mods, { id: Date.now(), type: 'summarize', length: ''}]);
  };

  const removeModification = (id: number) => {
    setModifications(mods => mods.filter(mod => mod.id !== id));
  }

  const handleModify = async () => {
    if (!text) {
      toast({
        title: "Error",
        description: "Please enter some text to modify.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setModifiedText("");
    try {
      const input: ModifyTextInput = {
        text,
        modifications: modifications.map(({ type, length }) => ({ type, length })),
      };
      const result = await modifyText(input);
      setModifiedText(result.text);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to modify text. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setModifiedText("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(modifiedText);
    toast({
      title: "Copied!",
      description: "The modified text has been copied to your clipboard.",
    });
  };

  const handleSwitch = () => {
    setText(modifiedText);
    setModifiedText("");
  };

  const AnalysisOptions = ({isModified = false} : {isModified?: boolean}) => (
    <div className="w-full flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
      <div className="flex items-center space-x-2">
          <Switch id={`include-spaces-${isModified ? 'modified' : 'original'}`} checked={includeSpaces} onCheckedChange={setIncludeSpaces} />
          <Label htmlFor={`include-spaces-${isModified ? 'modified' : 'original'}`} className="text-sm text-muted-foreground">Include spaces</Label>
      </div>
       <div className="flex items-center space-x-2">
          <Switch id={`ignore-punctuation-${isModified ? 'modified' : 'original'}`} checked={ignorePunctuation} onCheckedChange={setIgnorePunctuation} />
          <Label htmlFor={`ignore-punctuation-${isModified ? 'modified' : 'original'}`} className="text-sm text-muted-foreground">Ignore Punctuation</Label>
      </div>
       <div className="flex items-center space-x-2">
          <Switch id={`ignore-stopwords-${isModified ? 'modified' : 'original'}`} checked={ignoreStopwords} onCheckedChange={setIgnoreStopwords} />
          <Label htmlFor={`ignore-stopwords-${isModified ? 'modified' : 'original'}`} className="text-sm text-muted-foreground">Ignore Stopwords</Label>
      </div>
    </div>
  );

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
                <Label htmlFor="text-input" className="text-lg font-semibold">Your Text</Label>
                <Textarea
                  id="text-input"
                  placeholder="Start writing, or paste your text here..."
                  className="min-h-[250px] resize-y rounded-lg p-4 text-base focus-visible:ring-accent bg-background/50"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Text input area"
                />
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <Label className="text-lg font-semibold">AI Modifications</Label>
                {modifications.map((mod, index) => (
                  <div key={mod.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                      <div className="flex flex-col gap-2">
                          <Label htmlFor={`modificationType-${mod.id}`}>Modification {index + 1}</Label>
                          <Select value={mod.type} onValueChange={(value) => handleModificationChange(mod.id, 'type', value)}>
                              <SelectTrigger id={`modificationType-${mod.id}`}>
                                  <SelectValue placeholder="Select a modification" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="changeLength">Change Length</SelectItem>
                                  <SelectItem value="summarize">Summarize</SelectItem>
                                  <SelectItem value="explainLikeImFive">Explain Like I'm Five</SelectItem>
                                  <SelectItem value="explainCreatively">Explain Creatively</SelectItem>
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
                              onChange={(e) => handleModificationChange(mod.id, 'length', e.target.value)}
                          />
                       </div>
                    )}
                    <div className="flex gap-2 items-end md:col-start-3 justify-self-end">
                      {modifications.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeModification(mod.id)} className="text-muted-foreground hover:text-destructive">
                          <XCircle />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-start">
                    <Button variant="outline" onClick={addModification}>
                      <PlusCircle className="mr-2"/>
                      Add Modification
                    </Button>
                </div>
              </div>

               <div className="mt-6 grid grid-cols-2 gap-2">
                  <Button onClick={handleClear} variant="outline" className="w-full">Clear Text</Button>
                  <Button onClick={handleModify} disabled={isLoading} className="w-full">
                      {isLoading ? 'Modifying...' : 'Modify Text'}
                  </Button>
              </div>
              {modifiedText && (
                 <div className="mt-6">
                    <CardHeader className="p-0 mb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-xl">Modified Text</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleSwitch}>
                          <Replace className="h-4 w-4" />
                          <span className="sr-only">Switch</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCopy}>
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <Textarea
                      readOnly
                      value={modifiedText}
                      className="min-h-[150px] resize-y rounded-lg p-4 text-base bg-muted/30"
                    />
                     <div className="mt-2">
                       <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-muted-foreground">Modified Text Counts</Label>
                       </div>
                        <AnalysisOptions isModified={true} />
                       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 rounded-b-lg pt-2">
                          <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                            <span className="text-sm font-medium text-muted-foreground">Words</span>
                            <span className="text-4xl font-bold text-accent">{modifiedWordCount}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                            <span className="text-sm font-medium text-muted-foreground">Characters</span>
                            <span className="text-4xl font-bold text-accent">{modifiedCharCount}</span>
                          </div>
                           <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">Reading Time</span>
                              </div>
                              <span className="text-4xl font-bold text-accent">{modifiedReadingTime} min</span>
                          </div>
                          <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                               <div className="flex items-center gap-2 text-muted-foreground">
                                <BrainCircuit className="h-4 w-4" />
                                <span className="text-sm font-medium">Syllables</span>
                              </div>
                            <span className="text-4xl font-bold text-accent">{modifiedSyllableCount}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                               <div className="flex items-center gap-2 text-muted-foreground">
                                <BookOpen className="h-4 w-4" />
                                <span className="text-sm font-medium">Readability</span>
                              </div>
                            <span className="text-4xl font-bold text-accent">{modifiedReadabilityScore}</span>
                          </div>
                        </div>
                     </div>
                  </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 rounded-b-lg bg-muted/30 p-4 sm:p-6">
              <div className="w-full flex items-center justify-between">
                <Label className="text-lg font-semibold">Original Text Analysis</Label>
              </div>
              <AnalysisOptions />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Words</span>
                  <span className="text-4xl font-bold text-accent">{wordCount}</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Characters</span>
                  <span className="text-4xl font-bold text-accent">{charCount}</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Reading Time</span>
                  </div>
                  <span className="text-4xl font-bold text-accent">{readingTime} min</span>
                </div>
                 <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <BrainCircuit className="h-4 w-4" />
                    <span className="text-sm font-medium">Syllables</span>
                  </div>
                  <span className="text-4xl font-bold text-accent">{syllableCount}</span>
                </div>
                 <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Readability</span>
                  </div>
                  <span className="text-4xl font-bold text-accent">{readabilityScore}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
       <footer className="py-6 w-full shrink-0 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">&copy; 2025 WordWise Counter. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

    