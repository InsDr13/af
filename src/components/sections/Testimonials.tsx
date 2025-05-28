import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../../data/portfolioData';

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handlePrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Testimonials
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-8"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what clients and colleagues have to say about working with me.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Desktop and Tablet view */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id}
                    className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg ${
                      index === activeIndex ? 'ring-2 ring-blue-500 transform scale-105' : ''
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <img 
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1">
                          <Quote className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-center italic">
                      "{testimonial.text}"
                    </p>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile carousel view */}
            <div className="block sm:hidden">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img 
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1">
                      <Quote className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-center italic">
                  "{testimonials[activeIndex].text}"
                </p>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonials[activeIndex].position}, {testimonials[activeIndex].company}
                  </p>
                </div>
                
                <div className="flex justify-center mt-4 space-x-2">
                  <button 
                    onClick={handlePrevious}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Navigation indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === activeIndex 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;