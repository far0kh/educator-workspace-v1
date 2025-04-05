import { SuggestedPrompts } from "@/utils/types"
import { BookOpen, Rss } from "lucide-react";

const DefaultPrompts: Record<string, SuggestedPrompts[]> = {
  Free: [
    {
      category: "About Computer Olympiad",
      icon: BookOpen,
      prompts: [
        "What is Computer Olympiad?",
        "What are the stages of Computer Olympiad?",
        "How is the first stage conducted?",
        "Resources for the first stage?",
      ],
    },
    {
      category: "Computer Olympiad News",
      icon: Rss,
      prompts: [
        "What's new in Computer Olympiad?",
        "When is the first stage scheduled?",
      ],
    },
  ],
  Personal: [
    {
      category: "About Computer Olympiad",
      icon: BookOpen,
      prompts: [
        "How is the second stage conducted?",
        "Resources for the second stage?",
      ],
    },
    {
      category: "Computer Olympiad News",
      icon: Rss,
      prompts: [
        "What's new in Computer Olympiad?",
        "When is the second stage scheduled?",
      ],
    },
  ],
  Business: [
    {
      category: "About Computer Olympiad",
      icon: BookOpen,
      prompts: [
        "How is the third stage conducted?",
        "Resources for the third stage?",
      ],
    },
    {
      category: "Computer Olympiad News",
      icon: Rss,
      prompts: [
        "What's new in Computer Olympiad?",
        "When is the third stage scheduled?",
      ],
    },
  ],
};

export default DefaultPrompts;
