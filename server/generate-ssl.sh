#!/bin/bash

# Script to generate self-signed SSL certificates for development
# This creates certificates for localhost development

echo "🔐 Generating self-signed SSL certificates for development..."

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate private key
echo "Generating private key..."
openssl genrsa -out ssl/key.pem 2048

# Generate certificate signing request
echo "Generating certificate signing request..."
openssl req -new -key ssl/key.pem -out ssl/cert.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate
echo "Generating self-signed certificate..."
openssl x509 -req -in ssl/cert.csr -signkey ssl/key.pem -out ssl/cert.pem -days 365

# Clean up CSR file
rm ssl/cert.csr

echo "✅ SSL certificates generated successfully!"
echo "   Private Key: ssl/key.pem"
echo "   Certificate: ssl/cert.pem"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use certificates from a trusted CA."
echo ""
echo "🚀 You can now start the server with HTTPS support!"
echo "   HTTP:  http://localhost:4000"
echo "   HTTPS: https://localhost:4001" 