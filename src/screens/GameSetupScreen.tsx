import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, HelpCircle, Timer } from 'lucide-react';
import { useGame } from '../hooks/useGame';

const QUESTION_OPTIONS = [
  { value: 10, label: '10 questions', icon: HelpCircle },
  { value: 20, label: '20 questions', icon: Trophy },
  { value: 30, label: '30 questions', icon: Timer },
];

export function GameSetupScreen() {
  const navigate = useNavigate();
  const { startNewGame, loading } = useGame();

  const handleStartGame = async (questionCount: number) => {
    const game = await startNewGame(questionCount);
    if (game) {
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Nouvelle Partie
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Choisissez le nombre de questions pour votre quiz
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUESTION_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleStartGame(value)}
              disabled={loading}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center disabled:opacity-50"
            >
              <Icon className="w-8 h-8 text-indigo-600 mb-3" />
              <span className="text-gray-900 font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}