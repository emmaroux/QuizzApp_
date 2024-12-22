import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { shuffle } from '../utils/shuffle';
import { useAuth } from './useAuth';
import { useGameContext } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

export function useGame() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const gameContext = useGameContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewGame = useCallback(async (
    questionCount: number, 
    categories?: string[],
    disciplineId?: string
  ) => {
    if (!user) {
      setError('Vous devez être connecté pour jouer');
      return null;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Construire la requête de base
      let query = supabase
        .from('questions')
        .select('*');

      // Filtrer par discipline
      if (disciplineId) {
        query = query.eq('discipline_id', disciplineId);
      }

      // Filtrer par catégories si spécifiées
      if (categories && categories.length > 0) {
        query = query.in('category', categories);
      }

      // Récupérer les questions
      const { data: questions, error: questionsError } = await query;

      if (questionsError) throw questionsError;
      if (!questions || questions.length === 0) {
        throw new Error('Aucune question disponible pour ces critères');
      }

      // Mélanger et limiter le nombre de questions
      const shuffledQuestions = shuffle(questions).slice(0, questionCount);

      // Créer une nouvelle partie
      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert([{
          user_id: user.id,
          total_questions: shuffledQuestions.length,
          score: 0
        }])
        .select()
        .single();

      if (gameError) throw gameError;

      // Mettre à jour le contexte
      gameContext.setGameState({
        currentGame: game,
        questions: shuffledQuestions,
        currentQuestionIndex: 0,
        score: { correct: 0, total: 0 }
      });

      return game;
    } catch (err) {
      console.error('Error starting new game:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du démarrage de la partie');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, gameContext]);

  const updateGameScore = useCallback(async (correct: boolean) => {
    if (!gameContext.currentGame) return;

    const newScore = {
      correct: gameContext.score.correct + (correct ? 1 : 0),
      total: gameContext.score.total + 1
    };

    try {
      const { error } = await supabase
        .from('games')
        .update({
          score: newScore.correct,
          total_questions: newScore.total,
          completed_at: gameContext.currentQuestionIndex === gameContext.questions.length - 1 
            ? new Date().toISOString() 
            : null
        })
        .eq('id', gameContext.currentGame.id);

      if (error) throw error;

      gameContext.setGameState({ score: newScore });
    } catch (err) {
      console.error('Error updating game score:', err);
      setError('Erreur lors de la mise à jour du score');
    }
  }, [gameContext]);

  const setCurrentQuestionIndex = useCallback(() => {
    if (gameContext.currentQuestionIndex >= gameContext.questions.length - 1) {
      navigate('/results', { state: { score: gameContext.score } });
      return;
    }

    gameContext.setGameState({
      currentQuestionIndex: gameContext.currentQuestionIndex + 1
    });
  }, [gameContext, navigate]);

  return {
    currentGame: gameContext.currentGame,
    currentQuestion: gameContext.questions[gameContext.currentQuestionIndex],
    score: gameContext.score,
    loading,
    error,
    startNewGame,
    updateGameScore,
    setCurrentQuestionIndex,
    totalQuestions: gameContext.questions.length,
    remainingQuestions: gameContext.questions.length - gameContext.currentQuestionIndex
  };
}