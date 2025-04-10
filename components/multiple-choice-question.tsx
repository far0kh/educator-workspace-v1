import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MultipleChoiceQuestionProps {
  question: string;
  answerOptions: string[];
  singleChoice: boolean;
  instruction: string;
  onAnswer: (selectedIndex: number) => void;
  selectedAnswer?: number;
  disabled?: boolean;
}

export function MultipleChoiceQuestion({
  question,
  answerOptions,
  singleChoice,
  instruction,
  onAnswer,
  selectedAnswer,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardContent>
        <h3 className="text-lg text-primary/80 font-semibold mb-4">{question}</h3>
        <p className="text-sm text-muted-foreground mb-4">{instruction}</p>
        <div className="space-y-2">
          {answerOptions.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left truncate",
                selectedAnswer === index && "bg-primary text-primary-foreground"
              )}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 