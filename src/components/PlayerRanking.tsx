import React from 'react';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { Trophy, Loader2, Award } from 'lucide-react';

export const PlayerRanking: React.FC = () => {
  const { players, loading, error } = usePlayerStats();

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        Une erreur est survenue lors du chargement du classement
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Classement des joueurs</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Joueur</th>
              <th className="px-4 py-2 text-right">Ratio</th>
              <th className="px-4 py-2 text-right">Questions</th>
              <th className="px-4 py-2 text-right">Correctes</th>
              <th className="px-4 py-2 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <span>Contribution</span>
                </div>
              </th>
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
                <td className="px-4 py-2 text-right font-medium text-indigo-600">
                  {player.contribution_score} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};