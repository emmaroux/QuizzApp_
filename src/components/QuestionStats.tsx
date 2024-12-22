import React from 'react';

interface QuestionStatsProps {
  totalQuestions: number;
  remainingQuestions: number;
}

export function QuestionStats({ totalQuestions, remainingQuestions }: QuestionStatsProps) {
  return (
    <div className="text-center mb-4">
      <p className="text-sm text-gray-600">
        Questions restantes : {remainingQuestions} / {totalQuestions}
      </p>
    </div>
  );
}