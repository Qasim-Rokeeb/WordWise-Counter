
"use client";

import { useState, useMemo } from "react";
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
import { summarizeText, SummarizeTextInput } from "@/ai/flows/summarize-text";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [text, setText] = useState("");
  const [length, setLength] = useState("100");
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { wordCount, charCount } = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText.split(/\s+/).filter(Boolean);
    return {
      wordCount: trimmedText === "" ? 0 : words.length,
      charCount: text.length,
    };
  }, [text]);

  const { wordCount: modifiedWordCount, charCount: modifiedCharCount } = useMemo(() => {
    const trimmedText = modifiedText.trim();
    const words = trimmedText.split(/\s+/).filter(Boolean);
    return {
      wordCount: trimmedText === "" ? 0 : words.length,
      charCount: modifiedText.length,
    };
  }, [modifiedText]);

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
      const input: SummarizeTextInput = { text, length };
      const result = await summarizeText(input);
      setModifiedText(result.summary);
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

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl relative">
        <Card className="shadow-2xl shadow-primary/10">
          <CardHeader>
            <CardTitle className="font-headline text-3xl tracking-tight text-primary md:text-4xl">
              WordWise Counter
            </CardTitle>
            <CardDescription>
              Paste or type your text below to get an instant word and character
              count. You can also use AI to change the length of your text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Start writing, or paste your text here..."
              className="min-h-[250px] resize-y rounded-lg p-4 text-base focus-visible:ring-accent"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Text input area"
            />
             <div className="mt-4 flex gap-2">
              <Input
                placeholder="Desired word count (e.g. 100)"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
              <Button onClick={handleModify} disabled={isLoading}>
                {isLoading ? 'Modifying...' : 'Modify'}
              </Button>
            </div>
            {modifiedText && (
               <div className="mt-4">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-xl">Modified Text</CardTitle>
                  </CardHeader>
                  <Textarea
                    readOnly
                    value={modifiedText}
                    className="min-h-[150px] resize-y rounded-lg p-4 text-base bg-muted/30"
                  />
                   <div className="flex flex-col items-stretch gap-4 rounded-b-lg p-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8 sm:p-6">
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
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4 rounded-b-lg bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8 sm:p-6">
            <div className="flex flex-row items-center justify-between rounded-lg bg-background/50 p-4 sm:flex-col sm:justify-center sm:p-6 sm:gap-1">
              <span className="text-sm font-medium text-muted-foreground sm:order-2">
                Words
              </span>
              <span className="text-4xl font-bold text-accent sm:order-1">
                {wordCount}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg bg-background/50 p-4 sm:flex-col sm:justify-center sm:p-6 sm:gap-1">
              <span className="text-sm font-medium text-muted-foreground sm:order-2">
                Characters
              </span>
              <span className="text-4xl font-bold text-accent sm:order-1">
                {charCount}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
