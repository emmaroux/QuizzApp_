import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Role } from '../types';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const { data, error } = await supabase
          .from('roles')
          .select('*')
          .order('name');

        if (error) throw error;
        setRoles(data || []);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load roles');
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  const assignRole = async (userId: string, roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role_id: roleId }]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error assigning role:', err);
      return false;
    }
  };

  const removeRole = async (userId: string, roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: userId, role_id: roleId });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error removing role:', err);
      return false;
    }
  };

  return {
    roles,
    loading,
    error,
    assignRole,
    removeRole
  };
}