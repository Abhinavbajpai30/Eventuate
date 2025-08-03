import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/mockData';

const CategoryCard = ({ category }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full rounded-2xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="p-6 text-center">
          {/* Category Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/80 to-white/60 shadow-lg border-2 border-white/80 flex items-center justify-center text-4xl mx-auto mb-4">
            {category.icon}
          </div>

          {/* Category Name */}
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {category.name}
          </h3>

          {/* Event Count */}
          <p className="text-gray-600 font-medium">
            {category.eventCount} events
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Categories = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore events by your interests. From music and food to technology and sports, 
              find events that match your passions.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories; 