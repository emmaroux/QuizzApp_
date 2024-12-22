import React from 'react';
import type { Score } from '../types';

interface ScoreDisplayProps {
  score: Score;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="text-center mb-6">
      <p className="text-lg font-semibold text-gray-700">
        Score : {score.correct} / {score.total}
      </p>
    </div>
  );
}