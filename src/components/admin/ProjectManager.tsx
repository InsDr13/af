import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import ProjectModal from './ProjectModal';
import ImageManager from './ImageManager';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string[];
  technologies: string[];
  demo_url?: string;
  repo_url?: string;
  main_image_url?: string;
}

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_images(*)');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== id));
      toast.success('Projet supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleImageManager = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsImageManagerOpen(true);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gestion des projets
        </h2>
        <button
          onClick={() => {
            setSelectedProject(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau projet
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden"
          >
            {project.main_image_url && (
              <div className="h-48 overflow-hidden">
                <img
                  src={project.main_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleImageManager(project.id)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchProjects}
        />
      )}

      {isImageManagerOpen && selectedProjectId && (
        <ImageManager
          projectId={selectedProjectId}
          isOpen={isImageManagerOpen}
          onClose={() => {
            setIsImageManagerOpen(false);
            setSelectedProjectId(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectManager;