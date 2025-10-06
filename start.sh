#!/bin/bash

# IoT Dog Collar Monitoring System - Startup Script
echo "🐕 Starting IoT Dog Collar Monitoring System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p logs

# Set up environment files if they don't exist
if [ ! -f backend/.env ]; then
    echo "⚙️  Creating backend environment file..."
    cat > backend/.env << EOF
DATABASE_URL=postgresql://iot_user:iot_password@postgres:5432/iot_dog_collar
REDIS_HOST=redis
REDIS_PORT=6379
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
DEBUG=True
EOF
fi

if [ ! -f smartcollar/.env.local ]; then
    echo "⚙️  Creating frontend environment file..."
    cat > smartcollar/.env.local << EOF
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
EOF
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Display access information
echo ""
echo "✅ IoT Dog Collar Monitoring System is now running!"
echo ""
echo "🌐 Frontend (Dashboard): http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🗄️  Database: localhost:5432"
echo "💾 Redis: localhost:6379"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""

# Check if services are healthy
echo "🏥 Health check..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "🎉 Setup complete! Open http://localhost:3000 to start monitoring dogs."
