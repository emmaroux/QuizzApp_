import React from 'react';
import { BookOpen } from 'lucide-react';
import type { Discipline } from '../types';

interface DisciplineSelectorProps {
  disciplines: Discipline[];
  selectedDiscipline: Discipline | null;
  onSelectDiscipline: (discipline: Discipline) => void;
}

export function DisciplineSelector({
  disciplines,
  selectedDiscipline,
  onSelectDiscipline
}: DisciplineSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {disciplines.map(discipline => (
        <button
          key={discipline.id}
          onClick={() => onSelectDiscipline(discipline)}
          className={`p-4 rounded-lg flex items-start gap-3 transition-colors ${
            selectedDiscipline?.id === discipline.id
              ? 'bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500'
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          <BookOpen className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <div className="font-medium">{discipline.name}</div>
            {discipline.description && (
              <div className="text-sm mt-1 text-gray-500">
                {discipline.description}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}