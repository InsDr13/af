import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface PersonalInfo {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  roles: string[];
  bio: string;
  about_me: string;
  who_am_i: string;
  location: string;
  email: string;
  phone: string;
  avatar_url: string;
}

export function usePersonalInfo() {
  const [data, setData] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPersonalInfo() {
      try {
        const { data, error } = await supabase
          .from('personal_info')
          .select('*')
          .single();

        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPersonalInfo();
  }, []);

  return { data, loading, error };
}