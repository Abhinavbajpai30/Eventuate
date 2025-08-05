const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const connectDB = require('./src/config/db');

dotenv.config({ path: '.env' });

console.log('Environment check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('PORT:', process.env.PORT || 'Using default (4000)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'Using defaults');

connectDB();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/events', require('./src/routes/events'));
app.use('/api/bookings', require('./src/routes/bookings'));


app.get('/', (req, res) => {
  res.json({ message: 'Eventuate API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 4000;
const HTTPS_PORT = process.env.HTTPS_PORT || 4001;

// SSL Certificate paths
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || path.join(__dirname, 'ssl', 'key.pem');
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || path.join(__dirname, 'ssl', 'cert.pem');

// Function to create HTTPS server
const createHTTPSServer = () => {
  try {
    // Check if SSL certificates exist
    if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
      const privateKey = fs.readFileSync(SSL_KEY_PATH, 'utf8');
      const certificate = fs.readFileSync(SSL_CERT_PATH, 'utf8');
      const credentials = { key: privateKey, cert: certificate };

      const httpsServer = https.createServer(credentials, app);
      
      httpsServer.listen(HTTPS_PORT, () => {
        console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
        console.log(`   SSL Key: ${SSL_KEY_PATH}`);
        console.log(`   SSL Cert: ${SSL_CERT_PATH}`);
      });

      return httpsServer;
    } else {
      console.log('⚠️  SSL certificates not found. HTTPS server not started.');
      console.log(`   Expected SSL Key: ${SSL_KEY_PATH}`);
      console.log(`   Expected SSL Cert: ${SSL_CERT_PATH}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating HTTPS server:', error.message);
    return null;
  }
};

// Function to create HTTP server
const createHTTPServer = () => {
  const httpServer = http.createServer(app);
  
  httpServer.listen(PORT, () => {
    console.log(`🌐 HTTP Server running on port ${PORT}`);
  });

  return httpServer;
};

// Start servers based on environment
if (process.env.NODE_ENV === 'production') {
  // In production, try HTTPS first, fallback to HTTP
  const httpsServer = createHTTPSServer();
  if (!httpsServer) {
    console.log('⚠️  Falling back to HTTP server in production');
    createHTTPServer();
  }
} else {
  // In development, start both HTTP and HTTPS if certificates exist
  createHTTPServer();
  createHTTPSServer();
}

console.log(`🚀 Server startup complete!`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   HTTP Port: ${PORT}`);
console.log(`   HTTPS Port: ${HTTPS_PORT}`); 