import React from 'react';
import { personalData } from '../../data/portfolioData';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Github: <Github className="w-5 h-5" />,
  Linkedin: <Linkedin className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-xl font-bold text-blue-500 dark:text-blue-400">
              {personalData.name.split(' ')[0]}<span className="text-gray-800 dark:text-white">.dev</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {personalData.title} | {personalData.location}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            {personalData.socials.map(social => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                aria-label={social.name}
              >
                {iconMap[social.icon]}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {currentYear} {personalData.name}. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
            Built with React and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;