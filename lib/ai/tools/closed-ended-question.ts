import { tool } from 'ai';
import { z } from 'zod';

export const closedEndedQuestion = tool({
  description: 'Generates a multiple-choice UI for user interaction, facilitating clear and concise information gathering through closed-ended questions.',
  parameters: z.object({
    question: z.string(),
    answerOptions: z.string().array(),
    singleChoice: z.boolean(),
    instruction: z.string(),
  }),
  execute: async ({ question, answerOptions, singleChoice, instruction }) => {
    // This is a special tool that doesn't execute directly
    // Instead, it returns a structured response that the UI will handle
    return {
      content: 'A multiple-choice question was created and is now visible to the user.',
    };
  },
});