import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface PlayerStats {
  id: string;
  email: string;
  total_questions: number;
  correct_answers: number;
  ratio: number;
}

export function usePlayerStats() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayerStats() {
      try {
        const { data: users, error: usersError } = await supabase
          .from('player_stats')
          .select('*')
          .order('ratio', { ascending: false });

        if (usersError) throw usersError;

        setPlayers(users || []);
      } catch (err) {
        console.error('Error fetching player stats:', err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerStats();
  }, []);

  return { players, loading, error };
}