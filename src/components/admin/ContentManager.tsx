import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface ContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
}

const ContentManager = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('section', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (id: string, value: string) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, value } : item
    ));
  };

  const handleSave = async (item: ContentItem) => {
    try {
      const { error } = await supabase
        .from('content')
        .update({ value: item.value })
        .eq('id', item.id);

      if (error) throw error;
      toast.success('Contenu mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Gestion du contenu
      </h2>

      <div className="grid gap-6">
        {content.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {item.section}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.key}
                </p>
              </div>
              <button
                onClick={() => handleSave(item)}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </button>
            </div>

            <textarea
              value={item.value}
              onChange={(e) => handleContentChange(item.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;