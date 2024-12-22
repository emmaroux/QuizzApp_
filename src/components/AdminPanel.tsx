import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserRoles } from '../hooks/useUserRoles';
import { Upload, Loader2, Flag, X, Home } from 'lucide-react';
import { importQuestionsFromCSV } from '../lib/csv';
import { AdminReports } from './AdminReports';
import { UserReports } from './UserReports';
import { useNavigate } from 'react-router-dom';

export function AdminPanel() {
  const { user } = useAuth();
  const { isAdmin } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [status, setStatus] = useState<{
    imported: number;
    errors: number;
    duplicates: number;
  } | null>(null);

  // Ne montrer le panneau admin qu'aux administrateurs
  if (!user || !isAdmin) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatus(null);

    try {
      const content = await file.text();
      const result = await importQuestionsFromCSV(content);
      setStatus(result);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error importing questions:', err);
      setStatus({ imported: 0, errors: 1, duplicates: 0 });
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowReports(true)}
            className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            title="Voir les signalements"
          >
            <Flag className="w-6 h-6" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            title="Importer des questions (CSV)"
          >
            {importing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </button>
        </div>

        {status && (
          <div className={`p-4 rounded-lg shadow-lg ${
            status.errors > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
          }`}>
            <p>{status.imported} question(s) importée(s)</p>
            {status.duplicates > 0 && (
              <p>{status.duplicates} question(s) ignorée(s) (doublons)</p>
            )}
            {status.errors > 0 && (
              <p>{status.errors} erreur(s) lors de l'import</p>
            )}
          </div>
        )}
      </div>

      {showReports && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mt-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gestion des signalements</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
                  title="Retour à l'accueil"
                >
                  <Home className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowReports(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
                  title="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {isAdmin ? (
                <AdminReports />
              ) : (
                <UserReports />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}