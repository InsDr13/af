import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Upload, Save } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
}

const ProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !profile) return;

    try {
      setLoading(true);

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${profile.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast.success('Photo de profil mise à jour');
      fetchProfile();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Photo de profil
      </h2>

      <div className="space-y-6">
        {profile?.avatar_url && (
          <div className="flex justify-center">
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="avatar-upload"
                className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="avatar-upload"
                  name="avatar-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setAvatarFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>

        <button
          onClick={handleAvatarUpload}
          disabled={!avatarFile || loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Uploading...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default ProfileManager;