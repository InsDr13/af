import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export function useSupabaseQuery<T = any>(
  tableName: string,
  options: {
    columns?: string;
    orderBy?: { column: string; ascending?: boolean };
    filter?: { column: string; value: any };
  } = {}
) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase
          .from(tableName)
          .select(options.columns || '*');

        if (options.filter) {
          query = query.eq(options.filter.column, options.filter.value);
        }

        if (options.orderBy) {
          query = query.order(
            options.orderBy.column,
            { ascending: options.orderBy.ascending ?? true }
          );
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setData(data);
        setError(null);
      } catch (err) {
        setError(err as PostgrestError);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, options.columns, options.orderBy?.column, options.orderBy?.ascending, options.filter?.column, options.filter?.value]);

  return { data, error, loading };
}