import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onContinue: () => void;
  showContinue?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onContinue,
  showContinue = false
}) => {
  return (
    <div className="flex gap-4 justify-center mt-6">
      <button
        onClick={onNewGame}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <Play className="w-4 h-4" />
        Nouvelle partie
      </button>
      
      {showContinue && (
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <RotateCcw className="w-4 h-4" />
          Continuer
        </button>
      )}
    </div>
  );
};