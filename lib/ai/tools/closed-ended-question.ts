import { tool } from 'ai';
import { z } from 'zod';

export const closedEndedQuestion = tool({
  description: 'Ask a multiple-choice closed-ended question',
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
      type: "multiple_choice",
      question,
      answerOptions,
      singleChoice,
      instruction,
      timestamp: new Date().toISOString(),
    };
  },
});