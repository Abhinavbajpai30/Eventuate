const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  UPLOAD_URL: import.meta.env.VITE_UPLOAD_URL || 'http://localhost:4000/uploads'
};

export default config; 