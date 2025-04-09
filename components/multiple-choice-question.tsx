import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MultipleChoiceQuestionProps {
  question: string;
  options: string[];
  correctAnswer?: number;
  onAnswer: (selectedIndex: number) => void;
  selectedAnswer?: number;
  disabled?: boolean;
}

export function MultipleChoiceQuestion({
  question,
  options,
  correctAnswer,
  onAnswer,
  selectedAnswer,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">{question}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You can select one of the options below or type your own answer in the chat.
        </p>
        <div className="space-y-2">
          {options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left truncate",
                selectedAnswer === index && "bg-primary text-primary-foreground",
                correctAnswer !== undefined && index === correctAnswer && "border-green-500",
                correctAnswer !== undefined && selectedAnswer === index && index !== correctAnswer && "border-red-500"
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