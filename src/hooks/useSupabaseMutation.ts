import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

type MutationFunction<T> = (data: T) => Promise<{ error: PostgrestError | null }>;

export function useSupabaseMutation<T = any>(
  tableName: string,
  operation: 'insert' | 'update' | 'delete' = 'insert'
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const mutate: MutationFunction<T> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      let result;

      switch (operation) {
        case 'insert':
          result = await supabase
            .from(tableName)
            .insert(data);
          break;

        case 'update':
          result = await supabase
            .from(tableName)
            .update(data)
            .eq('id', (data as any).id);
          break;

        case 'delete':
          result = await supabase
            .from(tableName)
            .delete()
            .eq('id', (data as any).id);
          break;
      }

      if (result.error) {
        throw result.error;
      }

      return { error: null };
    } catch (err) {
      setError(err as PostgrestError);
      return { error: err as PostgrestError };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}