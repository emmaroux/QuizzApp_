import React, { createContext, useContext, useState } from 'react';
import type { Game, Question, Score } from '../types';

interface GameState {
  currentGame: Game | null;
  questions: Question[];
  currentQuestionIndex: number;
  score: Score;
}

interface GameContextType extends GameState {
  setGameState: (state: Partial<GameState>) => void;
  resetGame: () => void;
  currentQuestion: Question | null;
}

const initialState: GameState = {
  currentGame: null,
  questions: [],
  currentQuestionIndex: 0,
  score: { correct: 0, total: 0 }
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const setGameState = (newState: Partial<GameState>) => {
    setState(current => ({
      ...current,
      ...newState
    }));
  };

  const resetGame = () => {
    setState(initialState);
  };

  // Calculer la question courante
  const currentQuestion = state.questions[state.currentQuestionIndex] || null;

  return (
    <GameContext.Provider value={{
      ...state,
      currentQuestion,
      setGameState,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}