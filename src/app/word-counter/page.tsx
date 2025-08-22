
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
import { Copy, Replace, PlusCircle, XCircle } from "lucide-react";
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
  
  const { toast } = useToast();
  
  const { wordCount, charCount } = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return {
      wordCount: text ? words.length : 0,
      charCount: text.length,
    };
  }, [text]);

  const { modifiedWordCount, modifiedCharCount } = useMemo(() => {
    if (!modifiedText) return { modifiedWordCount: 0, modifiedCharCount: 0 };
    const words = modifiedText.trim().split(/\s+/).filter(Boolean);
    return {
      modifiedWordCount: modifiedText ? words.length : 0,
      modifiedCharCount: modifiedText.length,
    };
  }, [modifiedText]);


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
                    <Label htmlFor="text-input" className="text-lg font-semibold">Your Text</Label>
                    <Button onClick={handleClear} variant="outline" size="sm">Clear Text</Button>
                </div>
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
                <div className="flex justify-between">
                    <Button variant="outline" onClick={addModification}>
                      <PlusCircle className="mr-2"/>
                      Add Modification
                    </Button>
                    <Button onClick={handleModify} disabled={isLoading}>
                        {isLoading ? 'Modifying...' : 'Modify Text'}
                    </Button>
                </div>
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
                     <div className="mt-2 grid grid-cols-2 gap-4 rounded-b-lg pt-2">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                          <Label className="text-sm font-medium text-muted-foreground">Words</Label>
                          <span className="text-4xl font-bold text-accent">{modifiedWordCount}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                          <Label className="text-sm font-medium text-muted-foreground">Characters</Label>
                          <span className="text-4xl font-bold text-accent">{modifiedCharCount}</span>
                      </div>
                    </div>
                  </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 rounded-b-lg bg-muted/30 p-4 sm:p-6">
               <Label className="text-lg font-semibold">Original Text Analysis</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <Label className="text-sm font-medium text-muted-foreground">Words</Label>
                  <span className="text-4xl font-bold text-accent">{wordCount}</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background/50 p-4 sm:p-6 gap-1">
                  <Label className="text-sm font-medium text-muted-foreground">Characters</Label>
                  <span className="text-4xl font-bold text-accent">{charCount}</span>
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
