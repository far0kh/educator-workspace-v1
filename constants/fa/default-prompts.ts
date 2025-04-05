import { SuggestedPrompts } from "@/utils/types"
import { BookOpen, Rss } from "lucide-react";

const DefaultPrompts: Record<string, SuggestedPrompts[]> = {
  Free: [
    {
      category: "درباره المپیاد کامپیوتر",
      icon: BookOpen,
      prompts: [
        "المپیاد کامپیوتر چیست؟",
        "المپیاد کامپیوتر چه مراحلی دارد؟",
        "شیوه برگزاری مرحله اول؟",
        "منابع برای مرحله اول؟",
      ],
    },
    {
      category: "اخبار المپیاد کامپیوتر",
      icon: Rss,
      prompts: [
        "چه خبر از المپیاد کامپیوتر؟",
        "مرحله اول در چه تاریخی برگزار می شود؟",
      ],
    },
  ],
  Personal: [
    {
      category: "درباره المپیاد کامپیوتر",
      icon: BookOpen,
      prompts: [
        "شیوه برگزاری مرحله دوم؟",
        "منابع برای مرحله دوم؟",
      ],
    },
    {
      category: "اخبار المپیاد کامپیوتر",
      icon: Rss,
      prompts: [
        "چه خبر از المپیاد کامپیوتر؟",
        "مرحله دوم در چه تاریخی برگزار می شود؟",
      ],
    },
  ],
  Business: [
    {
      category: "درباره المپیاد کامپیوتر",
      icon: BookOpen,
      prompts: [
        "شیوه برگزاری مرحله سوم؟",
        "منابع برای مرحله سوم؟",
      ],
    },
    {
      category: "اخبار المپیاد کامپیوتر",
      icon: Rss,
      prompts: [
        "چه خبر از المپیاد کامپیوتر؟",
        "مرحله سوم در چه تاریخی برگزار می شود؟",
      ],
    },
  ],
};

export default DefaultPrompts;
