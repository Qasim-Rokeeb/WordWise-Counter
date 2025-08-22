'use server';

/**
 * @fileOverview An AI agent for running writing quality tests on text.
 *
 * - testText - A function that runs a series of tests on a piece of text.
 * - TestResult - The return type for the testText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TestSchema = z.object({
    name: z.string().describe("The name of the test being performed (e.g., 'Passive Voice Usage', 'Run-on Sentences')."),
    passed: z.boolean().describe("Whether the text passed the test."),
    feedback: z.string().describe("A brief explanation of why the text passed or failed the test."),
});

const TestResultSchema = z.object({
  tests: z.array(TestSchema).describe("An array of test results."),
});
export type TestResult = z.infer<typeof TestResultSchema>;


export async function testText(text: string): Promise<TestResult> {
  return testTextFlow(text);
}

const prompt = ai.definePrompt({
  name: 'testTextPrompt',
  input: { schema: z.string() },
  output: { schema: TestResultSchema },
  prompt: `
    You are a writing quality assurance expert. Your task is to analyze the following text and evaluate it against a series of common writing tests. For each test, you must determine if the text passes or fails and provide brief, constructive feedback.

    Here are the tests to perform:
    1.  **Passive Voice Usage**: The text should use active voice primarily. If more than 10% of sentences are in passive voice, the test fails.
    2.  **Sentence Variety**: The text should have a good mix of sentence lengths. If all sentences are very long or all are very short, the test fails.
    3.  **Clarity and Conciseness**: The text should be clear and to the point. If it contains excessive jargon, wordiness, or convoluted phrasing, the test fails.
    4.  **Run-on Sentences**: The text should not contain run-on sentences. If any are found, the test fails.
    5.  **Spelling and Grammar**: The text should be free of obvious spelling and grammar errors. If significant errors are found, the test fails.

    Analyze the following text and provide your results in the specified JSON format.

    Text:
    {{{text}}}
  `,
});

const testTextFlow = ai.defineFlow(
  {
    name: 'testTextFlow',
    inputSchema: z.string(),
    outputSchema: TestResultSchema,
  },
  async (text) => {
    const { output } = await prompt(text);
    return output!;
  }
);
