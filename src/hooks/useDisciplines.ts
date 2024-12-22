import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { retryableSupabaseRequest } from '../lib/supabaseUtils';
import type { Discipline } from '../types';

export function useDisciplines() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDisciplines() {
      try {
        setLoading(true);
        
        // Récupérer toutes les disciplines
        const disciplines = await retryableSupabaseRequest(() =>
          supabase
            .from('disciplines')
            .select('*')
            .order('name')
        );

        if (isMounted) {
          setDisciplines(disciplines);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching disciplines:', err);
        if (isMounted) {
          setError('Erreur lors du chargement des disciplines');
          setDisciplines([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDisciplines();

    return () => {
      isMounted = false;
    };
  }, []);

  return { disciplines, loading, error };
}