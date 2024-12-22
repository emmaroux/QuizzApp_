import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useCategories(disciplineId?: string) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      if (!disciplineId) {
        setCategories([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('questions')
          .select('category')
          .eq('discipline_id', disciplineId)
          .not('category', 'is', null);

        if (error) throw error;

        // Extraire les catégories uniques
        const uniqueCategories = Array.from(new Set(data.map(q => q.category)))
          .filter(Boolean)
          .sort();

        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Erreur lors du chargement des catégories');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [disciplineId]);

  return { categories, loading, error };
}