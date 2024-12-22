import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { QuestionCard } from './QuestionCard';
import { ScoreDisplay } from './ScoreDisplay';
import { QuestionStats } from './QuestionStats';
import { GameActions } from './GameActions';

export function QuizScreen() {
  const {
    currentQuestion,
    score,
    updateGameScore,
    setCurrentQuestionIndex,
    remainingQuestions,
    totalQuestions,
  } = useGame();

  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = async (answer: boolean) => {
    const correct = answer === currentQuestion?.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    await updateGameScore(correct);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setIsCorrect(null);
    setCurrentQuestionIndex();
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <GameActions />
      
      <div className="w-full max-w-2xl mx-auto">
        <QuestionStats
          totalQuestions={totalQuestions}
          remainingQuestions={remainingQuestions}
        />
        <ScoreDisplay score={score} />
        
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showExplanation={showExplanation}
          isCorrect={isCorrect}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}