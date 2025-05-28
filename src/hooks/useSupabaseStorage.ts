import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseStorage(bucketName: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File, path: string) => {
    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${path}${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return { publicUrl, error: null };
    } catch (err) {
      setError(err as Error);
      return { publicUrl: null, error: err as Error };
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return { uploadFile, deleteFile, uploading, error };
}