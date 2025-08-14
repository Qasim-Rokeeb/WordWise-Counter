
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
    You are an expert text editor. Your task is to modify the provided text based on the user's series of requests. Apply them in order.

    {{#each modifications}}
    Modification {{@index}}:
    - Type: {{{this.type}}}
    {{#if this.length}}
    - Desired length: {{{this.length}}}
    {{/if}}
    {{/each}}

    Perform the requested modifications on the following text.

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
