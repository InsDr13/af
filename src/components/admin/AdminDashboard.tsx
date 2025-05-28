import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Menu, X, Home, FileText, Image, LogOut, Settings, User } from 'lucide-react';
import { toast } from 'sonner';
import ContentManager from './ContentManager';
import ProjectManager from './ProjectManager';
import SecuritySettings from './SecuritySettings';
import ProfileManager from './ProfileManager';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/admin/login');
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Administration
          </h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <Link
            to="/admin"
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isActive('/admin')
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            Tableau de bord
          </Link>
          
          <Link
            to="/admin/content"
            className={`flex items-center px-4 py-2 mt-2 rounded-lg transition-colors ${
              isActive('/admin/content')
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FileText className="h-5 w-5 mr-3" />
            Contenu
          </Link>
          
          <Link
            to="/admin/projects"
            className={`flex items-center px-4 py-2 mt-2 rounded-lg transition-colors ${
              isActive('/admin/projects')
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Image className="h-5 w-5 mr-3" />
            Projets
          </Link>

          <Link
            to="/admin/profile"
            className={`flex items-center px-4 py-2 mt-2 rounded-lg transition-colors ${
              isActive('/admin/profile')
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <User className="h-5 w-5 mr-3" />
            Profile
          </Link>

          <Link
            to="/admin/security"
            className={`flex items-center px-4 py-2 mt-2 rounded-lg transition-colors ${
              isActive('/admin/security')
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Sécurité
          </Link>
          
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 mt-2 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-900 border-b dark:border-gray-700 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route
                index
                element={
                  <div className="text-gray-800 dark:text-white">
                    <h2 className="text-2xl font-semibold mb-6">
                      Bienvenue dans l'interface d'administration
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Sélectionnez une section dans le menu pour gérer votre contenu.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                        <FileText className="h-8 w-8 text-blue-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Gestion du contenu</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Modifiez les textes et informations de votre site.
                        </p>
                        <Link
                          to="/admin/content"
                          className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Gérer le contenu →
                        </Link>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                        <Image className="h-8 w-8 text-blue-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Gestion des projets</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Ajoutez, modifiez ou supprimez vos projets.
                        </p>
                        <Link
                          to="/admin/projects"
                          className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Gérer les projets →
                        </Link>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                        <User className="h-8 w-8 text-blue-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Gestion du profil</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Gérez votre profil et votre photo.
                        </p>
                        <Link
                          to="/admin/profile"
                          className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Gérer le profil →
                        </Link>
                      </div>
                    </div>
                  </div>
                }
              />
              <Route path="content" element={<ContentManager />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="profile" element={<ProfileManager />} />
              <Route path="security" element={<SecuritySettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;