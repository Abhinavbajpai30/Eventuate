/**
 * HTTPS Configuration for Production
 * 
 * This file contains HTTPS server configuration for production deployments.
 * In production, you should use certificates from a trusted Certificate Authority (CA).
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Create HTTPS server with SSL certificates
 * @param {Object} app - Express app instance
 * @param {number} port - HTTPS port
 * @returns {Object} HTTPS server instance or null if certificates not found
 */
const createProductionHTTPSServer = (app, port = 443) => {
  try {
    // Production SSL certificate paths
    const sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH || '/etc/ssl/private/server.key'),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/etc/ssl/certs/server.crt'),
      ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : undefined
    };

    const httpsServer = https.createServer(sslOptions, app);
    
    httpsServer.listen(port, () => {
      console.log(`🔒 Production HTTPS Server running on port ${port}`);
      console.log(`   SSL Key: ${process.env.SSL_KEY_PATH || '/etc/ssl/private/server.key'}`);
      console.log(`   SSL Cert: ${process.env.SSL_CERT_PATH || '/etc/ssl/certs/server.crt'}`);
    });

    return httpsServer;
  } catch (error) {
    console.error('❌ Error creating production HTTPS server:', error.message);
    console.log('💡 Make sure SSL certificates are properly configured for production');
    return null;
  }
};

/**
 * Create development HTTPS server with self-signed certificates
 * @param {Object} app - Express app instance
 * @param {number} port - HTTPS port
 * @returns {Object} HTTPS server instance or null if certificates not found
 */
const createDevelopmentHTTPSServer = (app, port = 4001) => {
  try {
    const sslKeyPath = path.join(__dirname, 'ssl', 'key.pem');
    const sslCertPath = path.join(__dirname, 'ssl', 'cert.pem');

    if (!fs.existsSync(sslKeyPath) || !fs.existsSync(sslCertPath)) {
      console.log('⚠️  Self-signed SSL certificates not found for development');
      console.log('   Run: ./generate-ssl.sh to create development certificates');
      return null;
    }

    const sslOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath)
    };

    const httpsServer = https.createServer(sslOptions, app);
    
    httpsServer.listen(port, () => {
      console.log(`🔒 Development HTTPS Server running on port ${port}`);
      console.log(`   SSL Key: ${sslKeyPath}`);
      console.log(`   SSL Cert: ${sslCertPath}`);
    });

    return httpsServer;
  } catch (error) {
    console.error('❌ Error creating development HTTPS server:', error.message);
    return null;
  }
};

module.exports = {
  createProductionHTTPSServer,
  createDevelopmentHTTPSServer
}; 