import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from 'sonner';

interface MultipleChoiceQuestionProps {
  question: string;
  answerOptions: string[];
  singleChoice: boolean;
  instruction: string;
  onAnswer: (selectedIndexes: number[]) => void;
  selectedAnswers?: number[];
  disabled?: boolean;
}

export function MultipleChoiceQuestion({
  question,
  answerOptions,
  singleChoice,
  instruction,
  onAnswer,
  selectedAnswers,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>(selectedAnswers || []);

  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardContent>
        <h3 className="text-lg text-primary/80 font-semibold mb-4">{question}</h3>
        <p className="text-sm text-muted-foreground mb-4">{instruction}</p>
        <div className="space-y-2">
          {answerOptions.map((option, index) => (
            <Button
              key={index}
              variant={selectedIndexes?.includes(index) ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left truncate",
                selectedIndexes?.includes(index) && "bg-primary text-primary-foreground"
              )}
              onClick={() => !disabled && singleChoice ? setSelectedIndexes([index]) : setSelectedIndexes((prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index])}
              disabled={disabled}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className={cn(
          "mt-4",
          disabled && "hidden",
        )}>
          <Button
            onClick={() => !disabled && selectedIndexes.length > 0 ? onAnswer(selectedIndexes) : toast.warning("Please select at least one answer.")}
            disabled={disabled}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 