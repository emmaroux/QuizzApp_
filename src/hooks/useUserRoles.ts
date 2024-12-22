import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Role } from '../types';

export function useUserRoles(userId: string | undefined) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setRoles([]);
      setLoading(false);
      return;
    }

    async function fetchUserRoles() {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select(`
            role:roles (
              id,
              name,
              created_at
            )
          `)
          .eq('user_id', userId);

        if (error) throw error;
        setRoles(data?.map(item => item.role) || []);
      } catch (err) {
        console.error('Error fetching user roles:', err);
        setError('Failed to load user roles');
      } finally {
        setLoading(false);
      }
    }

    fetchUserRoles();
  }, [userId]);

  const isAdmin = roles.some(role => role.name === 'admin');

  return {
    roles,
    loading,
    error,
    isAdmin
  };
}