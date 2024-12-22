import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { QuestionCard } from '../components/QuestionCard';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { QuestionStats } from '../components/QuestionStats';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GameActions } from '../components/GameActions';

export function QuizScreen() {
  const navigate = useNavigate();
  const {
    currentGame,
    currentQuestion,
    score,
    updateGameScore,
    setCurrentQuestionIndex,
    remainingQuestions,
    totalQuestions,
  } = useGame();

  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rediriger vers l'accueil si aucune partie n'est en cours
    if (!currentGame) {
      navigate('/');
      return;
    }

    // Rediriger vers les résultats si la partie est terminée
    if (!currentQuestion && score.total > 0) {
      navigate('/results', { state: { score } });
      return;
    }

    setLoading(false);
  }, [currentGame, currentQuestion, score, navigate]);

  if (loading || !currentQuestion) {
    return <LoadingSpinner />;
  }

  const handleAnswer = async (answer: boolean) => {
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    await updateGameScore(correct);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setIsCorrect(null);
    setCurrentQuestionIndex();
  };

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