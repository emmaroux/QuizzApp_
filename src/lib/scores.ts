import { supabase } from './supabaseClient';

export async function resetAllScores() {
  try {
    // 1. Supprimer toutes les parties avec une requête RPC sécurisée
    const { error: deleteError } = await supabase.rpc('clear_all_games');
    if (deleteError) throw deleteError;

    // 2. Rafraîchir les statistiques
    const { error: refreshError } = await supabase.rpc('refresh_player_stats');
    if (refreshError) throw refreshError;

    return { success: true };
  } catch (err) {
    console.error('Error resetting scores:', err);
    throw err;
  }
}