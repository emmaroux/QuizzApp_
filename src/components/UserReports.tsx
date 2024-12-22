import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface UserReport {
  id: string;
  question_statement: string;
  report_type: string;
  message: string;
  status: string;
  created_at: string;
}

export function UserReports() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const { data, error } = await supabase
        .from('report_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Erreur lors du chargement des signalements');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  if (reports.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        Vous n'avez fait aucun signalement
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map(report => (
        <div key={report.id} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              report.status === 'resolved' ? 'bg-green-100 text-green-800' :
              report.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {report.status === 'pending' ? 'En attente' :
               report.status === 'resolved' ? 'Résolu' :
               report.status === 'rejected' ? 'Rejeté' : 'En cours'}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(report.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-800 mb-2">{report.question_statement}</p>

          <button
            onClick={() => setShowDetails(showDetails === report.id ? null : report.id)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            {showDetails === report.id ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Masquer les détails
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Voir les détails
              </>
            )}
          </button>

          {showDetails === report.id && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Type de signalement :</span>{' '}
                {report.report_type === 'answer' ? 'Réponse incorrecte' :
                 report.report_type === 'explanation' ? 'Explication à améliorer' :
                 report.report_type === 'difficulty' ? 'Niveau de difficulté inadapté' :
                 'Autre problème'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Message :</span>{' '}
                {report.message}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}