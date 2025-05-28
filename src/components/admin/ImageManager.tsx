import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface ImageManagerProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectImage {
  id: string;
  url: string;
  is_main: boolean;
}

const ImageManager: React.FC<ImageManagerProps> = ({ projectId, isOpen, onClose }) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, projectId]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-images/${projectId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('project_images')
        .insert([
          {
            project_id: projectId,
            url: publicUrl,
            is_main: images.length === 0 // First image is main by default
          }
        ]);

      if (dbError) throw dbError;

      toast.success('Image uploadée avec succès');
      fetchImages();
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string, imageUrl: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      // Delete from storage
      const imagePath = imageUrl.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from('images')
          .remove([`project-images/${projectId}/${imagePath}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(images.filter(img => img.id !== imageId));
      toast.success('Image supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'image');
    }
  };

  const setMainImage = async (imageId: string) => {
    try {
      // Reset all images to non-main
      await supabase
        .from('project_images')
        .update({ is_main: false })
        .eq('project_id', projectId);

      // Set selected image as main
      const { error } = await supabase
        .from('project_images')
        .update({ is_main: true })
        .eq('id', imageId);

      if (error) throw error;

      setImages(images.map(img => ({
        ...img,
        is_main: img.id === imageId
      })));

      toast.success('Image principale définie avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'image principale');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity"></div>

        <div className="relative bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl">
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Gestion des images
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="flex justify-center w-full h-32 px-4 transition bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </span>
                </span>
                <input
                  type="file"
                  name="file_upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group"
                >
                  <img
                    src={image.url}
                    alt="Project image"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setMainImage(image.id)}
                      className={`p-2 rounded-full ${
                        image.is_main
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      ★
                    </button>
                    <button
                      onClick={() => handleDelete(image.id, image.url)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {image.is_main && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageManager;