/**
 * @fileOverview Schemas and types for the modify-text flow.
 *
 * - ModifyTextInputSchema - The Zod schema for the input of the modifyText function.
 * - ModifyTextInput - The TypeScript type for the input of the modifyText function.
 * - ModifyTextOutputSchema - The Zod schema for the output of the modifyText function.
 * - ModifyTextOutput - The TypeScript type for the output of the modifyText function.
 */

import {z} from 'genkit';

const ModificationSchema = z.object({
  type: z
    .string()
    .describe(
      'The type of modification to perform (e.g., "changeLength", "summarize", "explainLikeImFive", "explainCreatively", "humanize", "jargonize", "formal").'
    ),
  length: z
    .string()
    .optional()
    .describe(
      'The desired length for the output text (e.g., "100 words", "2 paragraphs"). Only used when type is "changeLength".'
    ),
});

export const ModifyTextInputSchema = z.object({
  text: z.string().describe('The text to modify.'),
  modifications: z
    .array(ModificationSchema)
    .describe('An array of modifications to apply to the text.'),
});
export type ModifyTextInput = z.infer<typeof ModifyTextInputSchema>;

export const ModifyTextOutputSchema = z.object({
  text: z.string().describe('The modified text.'),
});
export type ModifyTextOutput = z.infer<typeof ModifyTextOutputSchema>;
