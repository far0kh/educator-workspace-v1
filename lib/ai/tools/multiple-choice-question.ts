import { tool } from 'ai';
import { z } from 'zod';

export const multipleChoiceQuestion = tool({
  description: 'Ask a multiple choice question to the user and get their response',
  parameters: z.object({
    question: z.string().describe("The question to ask the user"),
    options: z.array(z.string()).min(2).describe("Array of possible answers"),
    correctAnswer: z.number().optional().describe("Index of the correct answer (optional)"),
  }),
  execute: async ({ question, options, correctAnswer }) => {
    // This is a special tool that doesn't execute directly
    // Instead, it returns a structured response that the UI will handle
    return {
      type: "multiple_choice",
      question,
      options,
      correctAnswer,
      timestamp: new Date().toISOString(),
    };
  },
}); 