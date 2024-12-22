import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Check, X, Loader2, History, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface Report {
  id: string;
  question_id: string;
  user_id: string;
  report_type: string;
  message: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  created_at: string;
  suggested_answer?: boolean;
  suggested_explanation?: string;
  suggested_difficulty?: number;
  user_email: string;
  question_statement: string;
  question_answer: boolean;
  question_explanation: string;
  question_difficulty?: number;
}

export function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
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

  async function updateReportStatus(id: string, status: Report['status']) {
    try {
      const { error } = await supabase
        .from('question_reports')
        .update({ 
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
      await loadReports();
    } catch (err) {
      console.error('Error updating report:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        {error}
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Signalements en attente */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Signalements en attente ({pendingReports.length})
        </h3>
        <div className="space-y-4">
          {pendingReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onUpdateStatus={updateReportStatus}
            />
          ))}
          {pendingReports.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucun signalement en attente
            </p>
          )}
        </div>
      </div>

      {/* Historique des signalements */}
      <div>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <History className="w-5 h-5" />
          <span>
            {showResolved ? "Masquer l'historique" : "Voir l'historique"}
          </span>
          {showResolved ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showResolved && (
          <div className="mt-4 space-y-4">
            {resolvedReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onUpdateStatus={updateReportStatus}
              />
            ))}
            {resolvedReports.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucun signalement traité
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ReportCardProps {
  report: Report;
  onUpdateStatus: (id: string, status: Report['status']) => void;
}

function ReportCard({ report, onUpdateStatus }: ReportCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* En-tête du signalement */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            report.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
            report.status === 'resolved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {report.status === 'pending' ? 'En attente' :
             report.status === 'reviewing' ? 'En cours' :
             report.status === 'resolved' ? 'Résolu' : 'Rejeté'}
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Signalé par {report.user_email} le {new Date(report.created_at).toLocaleDateString()}
          </p>
        </div>

        {report.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateStatus(report.id, 'resolved')}
              className="p-1 text-green-600 hover:text-green-700"
              title="Accepter"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => onUpdateStatus(report.id, 'rejected')}
              className="p-1 text-red-600 hover:text-red-700"
              title="Rejeter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Question signalée */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">Question signalée :</h4>
          {report.question_difficulty && (
            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
              Niveau {report.question_difficulty}
            </span>
          )}
        </div>
        <p className="text-gray-700 mb-4">{report.question_statement}</p>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Réponse actuelle :</span>{' '}
            {report.question_answer ? 'Vrai' : 'Faux'}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Explication actuelle :</span>{' '}
            {report.question_explanation}
          </p>
        </div>
      </div>

      {/* Détails du signalement */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-left text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        {showDetails ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Masquer les détails du signalement
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Voir les détails du signalement
          </>
        )}
      </button>

      {showDetails && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Type de signalement :</h4>
            <p className="text-gray-700">
              {report.report_type === 'answer' ? 'Réponse incorrecte' :
               report.report_type === 'explanation' ? 'Explication à améliorer' :
               report.report_type === 'difficulty' ? 'Niveau de difficulté inadapté' :
               'Autre problème'}
            </p>
          </div>

          {report.suggested_answer !== undefined && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Réponse suggérée :</h4>
              <p className="text-gray-700">
                {report.suggested_answer ? 'Vrai' : 'Faux'}
              </p>
            </div>
          )}

          {report.suggested_explanation && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Explication suggérée :</h4>
              <p className="text-gray-700">{report.suggested_explanation}</p>
            </div>
          )}

          {report.suggested_difficulty && (
            <div className="bg-indigo-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Difficulté suggérée :</h4>
              <p className="text-gray-700">Niveau {report.suggested_difficulty}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Commentaire :</h4>
            <p className="text-gray-700">{report.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}