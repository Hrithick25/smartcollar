# IoT Dog Collar Monitoring System

A comprehensive IoT monitoring system for Indian street dogs with ML-powered aggression prediction and real-time intervention capabilities.

## 🚀 Features

### Frontend (React + TypeScript)
- **Real-time Dashboard**: Live monitoring of dog health and behavior
- **Interactive Charts**: Aggression trends and health metrics visualization
- **Dog Management**: Add, edit, and track individual dog profiles
- **Intervention Alerts**: Real-time notifications for aggressive behavior
- **Mobile Responsive**: Works on desktop and mobile devices
- **PWA Support**: Installable as a mobile app

### Backend (FastAPI + Python)
- **ML Model Serving**: Real-time aggression prediction using ONNX
- **RESTful API**: Complete CRUD operations for all entities
- **WebSocket Support**: Real-time data streaming
- **Database Integration**: PostgreSQL with SQLAlchemy ORM
- **Redis Caching**: High-performance data caching
- **Firebase Integration**: Cloud storage and real-time sync

### IoT Integration
- **ESP32 Collar Support**: Hardware integration for sensor data
- **GPS Tracking**: Real-time location monitoring
- **Ultrasonic Intervention**: Automatic behavior correction
- **Battery Monitoring**: Power level tracking and alerts

## 🛠️ Technology Stack

### Frontend
- React 18+ with TypeScript
- Material-UI (MUI) for components
- Recharts for data visualization
- Socket.io-client for real-time updates
- React Query for data fetching
- Firebase SDK for cloud integration

### Backend
- FastAPI with async support
- SQLAlchemy ORM with PostgreSQL
- Redis for caching and real-time data
- ONNX Runtime for ML model serving
- WebSockets for real-time communication
- Firebase Admin SDK

### ML Pipeline
- scikit-learn for model training
- ONNX for model optimization
- Feature engineering for sensor data
- Real-time prediction pipeline

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- PostgreSQL 12+
- Redis 6+
- Firebase project (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd iot-dog-collar
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Redis credentials

# Run database migrations
alembic upgrade head

# Start the backend server
python main.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd smartcollar

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API and Firebase credentials

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Database Setup

```sql
-- Create PostgreSQL database
CREATE DATABASE iot_dog_collar;

-- Create user (optional)
CREATE USER iot_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE iot_dog_collar TO iot_user;
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/iot_dog_collar
REDIS_HOST=localhost
REDIS_PORT=6379
SECRET_KEY=your-secret-key
FIREBASE_PROJECT_ID=your-project-id
```

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 📊 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

- `GET /dogs` - List all dogs
- `POST /dogs` - Create new dog
- `GET /sensor-data/{dog_id}` - Get sensor data for a dog
- `POST /sensor-data` - Submit new sensor data
- `GET /interventions` - List interventions
- `GET /analytics/dashboard` - Get dashboard analytics
- `WS /ws/{client_id}` - WebSocket connection

## 🧠 ML Model Integration

The system uses a pre-trained ONNX model for aggression prediction:

1. **Model Location**: `ml/dog_aggression_model.onnx`
2. **Metadata**: `ml/dog_aggression_model_meta.pkl`
3. **Features**: Heart rate, temperature, posture, proximity, etc.
4. **Output**: Aggression level (0-4) and intervention recommendation

### Training New Models

```bash
cd ml
python train_model.py --data dog_aggression_dataset.csv
python convert_to_onnx.py --model dog_aggression_model.pkl
```

## 📱 Mobile App (PWA)

The frontend is built as a Progressive Web App:

1. Open `http://localhost:3000` in Chrome/Edge
2. Click the "Install" button in the address bar
3. The app will be installed as a native-like mobile app

## 🐳 Docker Deployment

### Backend
```bash
cd backend
docker build -t iot-backend .
docker run -p 8000:8000 iot-backend
```

### Frontend
```bash
cd smartcollar
docker build -t iot-frontend .
docker run -p 3000:3000 iot-frontend
```

### Docker Compose
```bash
docker-compose up -d
```

## 📈 Monitoring and Analytics

### Real-time Metrics
- Dog health status
- Aggression levels
- Intervention frequency
- Battery levels
- GPS tracking

### Historical Analytics
- Aggression trends over time
- Health pattern analysis
- Environmental correlations
- Intervention effectiveness

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Data encryption in transit
- Secure WebSocket connections
- Input validation and sanitization

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd smartcollar
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced ML models
- [ ] Multi-language support
- [ ] Cloud deployment
- [ ] Integration with veterinary systems
- [ ] Community features

## 🙏 Acknowledgments

- Indian street dog welfare organizations
- Open source ML libraries
- IoT hardware manufacturers
- Community contributors
