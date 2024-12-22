import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, HelpCircle, Timer } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { useDisciplines } from '../hooks/useDisciplines';
import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AdminPanel } from '../components/AdminPanel';
import { CategorySelector } from '../components/CategorySelector';
import { DisciplineSelector } from '../components/DisciplineSelector';
import { PlayerRanking } from '../components/PlayerRanking';
import { AuthModal } from '../components/AuthModal';
import { shuffle } from '../utils/shuffle';
import type { Discipline } from '../types';

const QUESTION_OPTIONS = [
  { value: 10, label: '10 questions', icon: HelpCircle },
  { value: 20, label: '20 questions', icon: Trophy },
  { value: 30, label: '30 questions', icon: Timer },
];

export function HomeScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startNewGame, loading: gameLoading, error } = useGame();
  const { disciplines, loading: disciplinesLoading } = useDisciplines();
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const { categories, loading: categoriesLoading } = useCategories(selectedDiscipline?.id);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectDiscipline = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setSelectedCategories([]);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategories(current => 
      current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories(categories);
  };

  const handleSelectRandom = () => {
    const randomCount = Math.floor(Math.random() * (categories.length - 1)) + 1;
    const shuffled = shuffle([...categories]);
    setSelectedCategories(shuffled.slice(0, randomCount));
  };

  const handleStartGame = async (questionCount: number) => {
    if (!selectedDiscipline) return;

    setLoading(true);
    try {
      const game = await startNewGame(
        questionCount,
        selectedCategories,
        selectedDiscipline.id
      );
      if (game) {
        navigate('/quiz');
      }
    } catch (err) {
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || gameLoading || disciplinesLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Quiz App</h1>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Se connecter
          </button>
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          Quiz App
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Sélection de la discipline */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Choisissez une discipline
          </h2>
          
          <DisciplineSelector
            disciplines={disciplines}
            selectedDiscipline={selectedDiscipline}
            onSelectDiscipline={handleSelectDiscipline}
          />
        </div>

        {/* Sélection des catégories */}
        {selectedDiscipline && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sélectionnez vos catégories
            </h2>
            
            <CategorySelector
              categories={categories}
              selectedCategories={selectedCategories}
              onSelectCategory={handleSelectCategory}
              onSelectAll={handleSelectAll}
              onSelectRandom={handleSelectRandom}
            />
          </div>
        )}

        {/* Nombre de questions */}
        {selectedDiscipline && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Nombre de questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {QUESTION_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleStartGame(value)}
                  disabled={loading}
                  className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 transition-colors flex flex-col items-center gap-3 disabled:opacity-50"
                >
                  <Icon className="w-8 h-8 text-indigo-600" />
                  <span className="text-gray-900 font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Classement des joueurs */}
        <PlayerRanking />
      </div>

      <AdminPanel />
    </div>
  );
}