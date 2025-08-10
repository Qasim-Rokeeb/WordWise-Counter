// Summarize Text feature implementation.

'use server';

/**
 * @fileOverview A text summarization AI agent.
 *
 * - summarizeText - A function that summarizes the given text.
 * - SummarizeTextInput - The input type for the summarizeText function.
 * - SummarizeTextOutput - The return type for the summarizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextInputSchema = z.string().describe('The text to summarize.');
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the input text.'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export async function summarizeText(text: string): Promise<SummarizeTextOutput> {
  return summarizeTextFlow(text);
}

const summarizeTextPrompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: {schema: SummarizeTextInputSchema},
  output: {schema: SummarizeTextOutputSchema},
  prompt: `Summarize the following text in a concise format:\n\n{{{text}}}`, // Access the input text using Handlebars syntax
});

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async text => {
    const {output} = await summarizeTextPrompt(text);
    return output!;
  }
);
