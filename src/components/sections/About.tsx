import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { personalData } from '../../data/portfolioData';

const About: React.FC = () => {
  const personalDetails = [
    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: personalData.location },
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: personalData.email },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: personalData.phone }
  ];
  
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-8"></div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            I'm a passionate developer focused on creating beautiful, functional websites and applications.
            With a strong foundation in both design and development, I strive to build products that not only
            look great but also deliver exceptional user experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Working on code" 
                className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Who am I?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              I'm {personalData.name}, a {personalData.title} with a passion for creating beautiful, 
              functional, and user-friendly websites and applications. I enjoy working on challenging
              projects that push me to learn and grow as a developer.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, contributing to open-source
              projects, or enjoying outdoor activities to recharge my creativity.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {personalDetails.map((detail, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex flex-col items-center transition-transform hover:transform hover:scale-105"
                >
                  <div className="text-blue-500 mb-2">{detail.icon}</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{detail.label}</p>
                  <p className="text-gray-900 dark:text-white font-medium text-center">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;