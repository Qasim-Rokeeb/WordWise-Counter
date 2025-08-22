
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestResult } from "@/ai/flows/test-text";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TestSummaryProps {
  results: TestResult;
}

export function TestSummary({ results }: TestSummaryProps) {
  if (!results || !results.tests || results.tests.length === 0) {
    return (
      <Card className="bg-background/50">
        <CardContent className="pt-6">
          <p>No test results available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/50">
      <CardContent className="pt-6 grid gap-4">
        <TooltipProvider>
            {results.tests.map((test, index) => (
            <div key={index} className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                {test.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">{test.name}</span>
                </div>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{test.feedback}</p>
                    </TooltipContent>
                 </Tooltip>
            </div>
            ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
