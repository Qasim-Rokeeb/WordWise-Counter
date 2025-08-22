

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
import { Copy, Replace, PlusCircle, XCircle, Clock } from "lucide-react";
import { ModifyTextInput } from "@/ai/schemas/modify-text";
import { Header } from "@/components/header";


interface Modification {
  id: number;
  type: string;
  length: string;
}

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [modifications, setModifications] = useState<Modification[]>([
    { id: 1, type: "changeLength", length: "100" },
  ]);
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const { toast } = useToast();

  const getWordCount = (str: string) => {
    if (str.trim() === "") return 0;
    return str.trim().split(/\s+/).length;
  }

  const calculateReadingTime = (wordCount: number) => {
    const wordsPerMinute = 225;
    if (wordCount === 0) return 0;
    const minutes = wordCount / wordsPerMinute;
    return Math.ceil(minutes);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentWordCount = getWordCount(text);
      setWordCount(currentWordCount);
      setCharCount(text.length);
      setReadingTime(calculateReadingTime(currentWordCount));
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [text]);
  
  const modifiedWordCount = useMemo(() => getWordCount(modifiedText), [modifiedText]);
  const modifiedCharCount = modifiedText.length;
  const modifiedReadingTime = useMemo(() => calculateReadingTime(modifiedWordCount), [modifiedWordCount]);


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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
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
                       <Label className="text-sm font-medium text-muted-foreground">Modified Text Counts</Label>
                       <div className="flex flex-col items-stretch gap-4 rounded-b-lg pt-2 sm:flex-row sm:items-center sm:justify-start sm:gap-8">
                          <div className="flex flex-row items-center justify-between rounded-lg bg-background/50 p-4 sm:flex-col sm:justify-center sm:p-6 sm:gap-1">
                            <span className="text-sm font-medium text-muted-foreground sm:order-2">
                              Words
                            </span>
                            <span className="text-4xl font-bold text-accent sm:order-1">
                              {modifiedWordCount}
                            </span>
                          </div>
                          <div className="flex flex-row items-center justify-between rounded-lg bg-background/50 p-4 sm:flex-col sm:justify-center sm:p-6 sm:gap-1">
                            <span className="text-sm font-medium text-muted-foreground sm:order-2">
                              Characters
                            </span>
                            <span className="text-4xl font-bold text-accent sm:order-1">
                              {modifiedCharCount}
                            </span>
                          </div>
                          <div className="flex flex-row items-center justify-between rounded-lg bg-background/50 p-4 sm:flex-col sm:justify-center sm:p-6 sm:gap-1">
                            <span className="text-sm font-medium text-muted-foreground sm:order-2">
                              Reading Time
                            </span>
                            <span className="text-4xl font-bold text-accent sm:order-1">
                              {modifiedReadingTime} min
                            </span>
                          </div>
                        </div>
                     </div>
                  </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 rounded-b-lg bg-muted/30 p-4 sm:p-6">
              <Label className="text-lg font-semibold">Original Text Counts</Label>
              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8 w-full">
                <div className="flex flex-row items-center justify-between rounded-lg bg-background/50 p-4 sm:flex-col sm:justify-center sm:p-6 sm:gap-1 flex-1">
                  <span className="text-sm font-medium text-muted-foreground sm:order-2">
                    Words
                  </span>
                  <span className="text-4xl font-bold text-accent sm:order-1">
                    {wordCount}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg bg-background/50 p-4 sm:flex-col sm:justify-center sm:p-6 sm:gap-1 flex-1">
                  <span className="text-sm font-medium text-muted-foreground sm:order-2">
                    Characters
                  </span>
                  <span className="text-4xl font-bold text-accent sm:order-1">
                    {charCount}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg bg-background/50 p-4 sm:flex-col sm:justify-center sm:p-6 sm:gap-1 flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground sm:order-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Reading Time
                    </span>
                  </div>
                  <span className="text-4xl font-bold text-accent sm:order-1">
                    {readingTime} min
                  </span>
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
