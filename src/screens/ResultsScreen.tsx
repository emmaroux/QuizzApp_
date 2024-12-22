import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { usePlayerStats } from '../hooks/usePlayerStats';
import type { Score } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function ResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const score = (location.state as { score: Score })?.score;
  const { players, loading } = usePlayerStats();

  useEffect(() => {
    if (!score) {
      navigate('/');
      return;
    }

    // Mettre à jour les statistiques
    const refreshStats = async () => {
      const { error } = await supabase.rpc('refresh_player_stats');
      if (error) {
        console.error('Error refreshing stats:', error);
      }
    };

    refreshStats();
  }, [score, navigate]);

  if (!score) return null;
  if (loading) return <LoadingSpinner />;

  const percentage = Math.round((score.correct / score.total) * 100);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Quiz terminé !
          </h1>
          
          <p className="text-2xl text-gray-700 mb-8">
            Score final : {score.correct}/{score.total} ({percentage}%)
          </p>

          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Nouvelle partie
          </button>
        </div>

        {players.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Classement des joueurs
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Position</th>
                    <th className="px-4 py-2 text-left">Joueur</th>
                    <th className="px-4 py-2 text-right">Ratio</th>
                    <th className="px-4 py-2 text-right">Questions</th>
                    <th className="px-4 py-2 text-right">Correctes</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={player.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">#{index + 1}</td>
                      <td className="px-4 py-2">{player.email}</td>
                      <td className="px-4 py-2 text-right">
                        {(player.ratio * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-2 text-right">{player.total_questions}</td>
                      <td className="px-4 py-2 text-right">{player.correct_answers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}