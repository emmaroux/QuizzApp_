import React, { useState } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';
import { useGameContext } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ReportModal } from './ReportModal';

export function GameActions() {
  const navigate = useNavigate();
  const { currentGame, currentQuestion, resetGame } = useGameContext();
  const [showReportModal, setShowReportModal] = useState(false);

  const handleCancel = async () => {
    if (!currentGame) return;

    if (window.confirm('Êtes-vous sûr de vouloir annuler cette partie ? Le score ne sera pas comptabilisé.')) {
      try {
        await supabase
          .from('games')
          .delete()
          .eq('id', currentGame.id);

        resetGame();
        navigate('/');
      } catch (err) {
        console.error('Error canceling game:', err);
      }
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => setShowReportModal(true)}
          className="p-2 text-yellow-600 hover:text-yellow-700 bg-yellow-50 rounded-full shadow-sm hover:shadow transition-all"
          title="Signaler une erreur"
        >
          <AlertTriangle className="w-5 h-5" />
        </button>

        <button
          onClick={handleCancel}
          className="p-2 text-red-600 hover:text-red-700 bg-red-50 rounded-full shadow-sm hover:shadow transition-all"
          title="Annuler la partie"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      {showReportModal && currentQuestion && (
        <ReportModal
          question={currentQuestion}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}