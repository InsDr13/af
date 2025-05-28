import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  content: string | null;
}

export function useContentSections() {
  const [data, setData] = useState<Record<string, ContentSection>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContentSections() {
      try {
        const { data, error } = await supabase
          .from('content_sections')
          .select('*');

        if (error) throw error;

        const sectionsMap = (data || []).reduce((acc, section) => {
          acc[section.section_key] = section;
          return acc;
        }, {} as Record<string, ContentSection>);

        setData(sectionsMap);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchContentSections();
  }, []);

  return { data, loading, error };
}