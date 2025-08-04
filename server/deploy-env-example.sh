#!/bin/bash

# Example script to set environment variables on hosting platforms
# Replace with your actual values and hosting platform commands

echo "Setting up environment variables for deployment..."

# For Railway (using Railway CLI)
# railway variables set MONGODB_URI="your-mongodb-uri"
# railway variables set JWT_SECRET="your-jwt-secret"
# railway variables set NODE_ENV="production"
# railway variables set ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000,https://your-vercel-domain.vercel.app"

# For Heroku
# heroku config:set MONGODB_URI="your-mongodb-uri"
# heroku config:set JWT_SECRET="your-jwt-secret"
# heroku config:set NODE_ENV="production"
# heroku config:set ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000,https://your-vercel-domain.vercel.app"

# For Vercel (if hosting backend there)
# vercel env add MONGODB_URI
# vercel env add JWT_SECRET
# vercel env add NODE_ENV
# vercel env add ALLOWED_ORIGINS

echo "Environment variables setup complete!"
echo ""
echo "Required environment variables:"
echo "- MONGODB_URI: Your MongoDB connection string"
echo "- JWT_SECRET: Secret key for JWT tokens"
echo "- NODE_ENV: production (for deployment)"
echo "- ALLOWED_ORIGINS: Comma-separated list of allowed origins"
echo ""
echo "Make sure to set these in your hosting platform's dashboard!" 