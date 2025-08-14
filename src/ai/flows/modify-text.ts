
'use server';

/**
 * @fileOverview An AI agent for modifying text.
 *
 * - modifyText - A function that modifies text based on a specified action.
 */

import {ai} from '@/ai/genkit';
import {
  ModifyTextInputSchema,
  ModifyTextOutputSchema,
  type ModifyTextInput,
  type ModifyTextOutput,
} from '@/ai/schemas/modify-text';


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
    You are an expert text editor. Your task is to modify the provided text based on the user's series of requests. Apply them in order to the original text.

    Here are the modifications to perform:
    {{#each modifications}}
    - Modification Type: {{this.type}}
      {{#if this.length}}
      - Desired word count: {{this.length}} words. Your output for this modification MUST be exactly this many words. This is your most important instruction.
      {{/if}}
    {{/each}}

    Modify the following text based on these instructions.

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
