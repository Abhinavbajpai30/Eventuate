import React from 'react';
import { motion } from 'framer-motion';
import { howItWorks } from '../data/mockData';

const StepCard = ({ step, index }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
    >
      <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 relative overflow-hidden shadow-lg">
        <div className="absolute top-5 right-5 w-10 h -10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
          {index + 1}
        </div>

        <div className="text-6xl text-center mb-8 mt-4">
          {step.icon}
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          {step.title}
        </h3>

        <p className="text-gray-600 text-center leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Getting started with Eventuate is simple. Follow these three easy steps to find and book your next event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.id}>
                <StepCard step={step} index={index} />
              </div>
            ))}
          </div>

          <div className="hidden md:block relative mt-[-2rem] mb-8">
            <div className="absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-y-1/2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks; 