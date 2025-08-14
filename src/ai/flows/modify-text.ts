
'use server';

/**
 * @fileOverview An AI agent for modifying text.
 *
 * - modifyText - A function that modifies text based on a specified action.
 * - ModifyTextInput - The input type for the modifyText function.
 * - ModifyTextOutput - The return type for the modifyText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModifyTextInputSchema = z.object({
  text: z.string().describe('The text to modify.'),
  modification: z.object({
    type: z
      .string()
      .describe(
        'The type of modification to perform (e.g., "changeLength", "summarize", "explainLikeImFive", "explainCreatively", "humanize", "jargonize").'
      ),
    length: z
      .string()
      .optional()
      .describe(
        'The desired length for the output text (e.g., "100 words", "2 paragraphs"). Only used when type is "changeLength".'
      ),
  }),
});
export type ModifyTextInput = z.infer<typeof ModifyTextInputSchema>;

const ModifyTextOutputSchema = z.object({
  text: z.string().describe('The modified text.'),
});
export type ModifyTextOutput = z.infer<typeof ModifyTextOutputSchema>;

export async function modifyText(
  input: ModifyTextInput
): Promise<ModifyTextOutput> {
  return modifyTextFlow(input);
}

const modifyTextPrompt = ai.definePrompt({
  name: 'modifyTextPrompt',
  input: {schema: ModifyTextInputSchema},
  output: {schema: ModifyTextOutputSchema},
  prompt: `
    You are an expert text editor. Your task is to modify the provided text based on the user's request.

    Modification type: {{{modification.type}}}
    {{#if modification.length}}
    Desired length: {{{modification.length}}}
    {{/if}}

    Perform the requested modification on the following text.

    Text:
    {{{text}}}
  `,
});

const modifyTextFlow = ai.defineFlow(
  {
    name: 'modifyTextFlow',
    inputSchema: ModifyTextInputSchema,
    outputSchema: ModifyTextOutputSchema,
  },
  async input => {
    const {output} = await modifyTextPrompt(input);
    return {
        text: output!.text,
    };
  }
);
