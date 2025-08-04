import React from 'react';
import {
  TextField
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = {
    'Company': ['About', 'Careers', 'Press', 'Blog'],
    'Support': ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
    'Events': ['Browse Events', 'List Event', 'Event Categories', 'Organizer Tools'],
    'Resources': ['Event Planning Guide', 'Marketing Tips', 'Success Stories', 'API Documentation']
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: LinkedIn, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="md:col-span-2">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Eventuate
              </h1>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Connecting people through amazing events. Discover, book, and create unforgettable experiences.
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Stay Updated
                </h3>
                <div className="flex gap-2">
                  <TextField
                    placeholder="Enter your email"
                    size="small"
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea'
                        },
                        '& input': {
                          color: 'white',
                          '&::placeholder': {
                            color: 'rgba(255,255,255,0.7)',
                            opacity: 1
                          }
                        }
                      }
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center">
                      <Email className="mr-2" />
                      Subscribe
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={category}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {category}
                </h3>
                <div className="space-y-2">
                  {links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-gray-300 hover:text-blue-400 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Eventuate. All rights reserved.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={social.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    <social.icon />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 