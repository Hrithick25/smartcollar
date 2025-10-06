@echo off
REM IoT Dog Collar Monitoring System - Windows Startup Script
echo 🐕 Starting IoT Dog Collar Monitoring System...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "data\postgres" mkdir data\postgres
if not exist "data\redis" mkdir data\redis
if not exist "logs" mkdir logs

REM Set up environment files if they don't exist
if not exist "backend\.env" (
    echo ⚙️  Creating backend environment file...
    (
        echo DATABASE_URL=postgresql://iot_user:iot_password@postgres:5432/iot_dog_collar
        echo REDIS_HOST=redis
        echo REDIS_PORT=6379
        echo SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
        echo DEBUG=True
    ) > backend\.env
)

if not exist "smartcollar\.env.local" (
    echo ⚙️  Creating frontend environment file...
    (
        echo VITE_API_URL=http://localhost:8000
        echo VITE_WS_URL=ws://localhost:8000
        echo VITE_FIREBASE_API_KEY=your-firebase-api-key
        echo VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
        echo VITE_FIREBASE_PROJECT_ID=your-project-id
        echo VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
        echo VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
        echo VITE_FIREBASE_APP_ID=your-app-id
    ) > smartcollar\.env.local
)

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

REM Display access information
echo.
echo ✅ IoT Dog Collar Monitoring System is now running!
echo.
echo 🌐 Frontend (Dashboard): http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo 🗄️  Database: localhost:5432
echo 💾 Redis: localhost:6379
echo.
echo 📝 To view logs: docker-compose logs -f
echo 🛑 To stop: docker-compose down
echo.

REM Check if services are healthy
echo 🏥 Health check...
curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is healthy
) else (
    echo ❌ Backend is not responding
)

curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is healthy
) else (
    echo ❌ Frontend is not responding
)

echo.
echo 🎉 Setup complete! Open http://localhost:3000 to start monitoring dogs.
pause
