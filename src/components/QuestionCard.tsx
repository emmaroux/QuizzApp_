import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: boolean) => void;
  showExplanation: boolean;
  isCorrect: boolean | null;
  onNext?: () => void;
}

export function QuestionCard({
  question,
  onAnswer,
  showExplanation,
  isCorrect,
  onNext
}: QuestionCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Réinitialiser l'état de l'accordéon quand la question change
  useEffect(() => {
    setShowDetails(false);
  }, [question.id]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Affichage de la catégorie */}
      {question.subcategory && (
        <div className="flex items-center gap-2 mb-4 text-sm text-indigo-600">
          <BookOpen className="w-4 h-4" />
          <span>{question.subcategory}</span>
          {question.difficulty && (
            <span className="ml-auto px-2 py-1 bg-indigo-50 rounded-full text-xs">
              Niveau {question.difficulty}
            </span>
          )}
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center">
        {question.statement}
      </h2>
      
      {!showExplanation ? (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onAnswer(false)}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Faux
          </button>
          <button
            onClick={() => onAnswer(true)}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Vrai
          </button>
        </div>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${
          isCorrect ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex justify-center mb-4">
            {isCorrect ? (
              <Check className="w-8 h-8 text-green-500" />
            ) : (
              <X className="w-8 h-8 text-red-500" />
            )}
          </div>
          
          <p className="text-gray-700 mb-4">
            {question.explanation}
          </p>

          {question.detailed_explanation && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    <span>Masquer les détails</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    <span>En savoir plus</span>
                  </>
                )}
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showDetails ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}>
                <p className="text-gray-700 text-sm">
                  {question.detailed_explanation}
                </p>
              </div>
            </div>
          )}

          {onNext && (
            <button
              onClick={onNext}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors mt-6"
            >
              Question suivante
            </button>
          )}
        </div>
      )}
    </div>
  );
}