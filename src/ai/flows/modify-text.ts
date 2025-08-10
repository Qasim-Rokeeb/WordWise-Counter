
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
        'The type of modification to perform (e.g., "changeLength", "summarize", "explainLikeImFive", "humanize", "jargonize").'
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
    {{#if (eq modification.type "changeLength")}}
    Rewrite the following text to be a total of {{{modification.length}}} words long. Do not change the original meaning of the text.
    {{/if}}
    {{#if (eq modification.type "summarize")}}
    Summarize the following text.
    {{/if}}
    {{#if (eq modification.type "explainLikeImFive")}}
    Explain the following text like I'm five years old.
    {{/if}}
    {{#if (eq modification.type "humanize")}}
    Rewrite the following text to make it sound more human and less robotic.
    {{/if}}
    {{#if (eq modification.type "jargonize")}}
    Rewrite the following text to include more technical jargon and sound more professional.
    {{/if}}

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
