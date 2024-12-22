import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Chargement...' }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}