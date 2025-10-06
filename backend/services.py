from sqlalchemy.orm import Session
from sqlalchemy import desc, func, and_
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
import hashlib
import secrets
from passlib.context import CryptContext
from jose import JWTError, jwt
import pandas as pd
import numpy as np
import joblib
import onnxruntime as rt
import os
from dotenv import load_dotenv

from models import Dog, Collar, SensorData, Intervention, User
from schemas import (
    DogCreate, DogResponse, CollarCreate, CollarResponse,
    SensorDataCreate, SensorDataResponse, InterventionCreate,
    InterventionResponse, UserCreate, UserResponse, LoginRequest
)

load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class DogService:
    async def create_dog(self, db: Session, dog_data: DogCreate) -> DogResponse:
        db_dog = Dog(
            id=str(uuid.uuid4()),
            **dog_data.dict()
        )
        db.add(db_dog)
        db.commit()
        db.refresh(db_dog)
        return DogResponse.from_orm(db_dog)
    
    async def get_dogs(self, db: Session, skip: int = 0, limit: int = 100) -> List[DogResponse]:
        dogs = db.query(Dog).offset(skip).limit(limit).all()
        return [DogResponse.from_orm(dog) for dog in dogs]
    
    async def get_dog(self, db: Session, dog_id: str) -> Optional[DogResponse]:
        dog = db.query(Dog).filter(Dog.id == dog_id).first()
        return DogResponse.from_orm(dog) if dog else None
    
    async def update_dog(self, db: Session, dog_id: str, dog_data: DogCreate) -> DogResponse:
        db_dog = db.query(Dog).filter(Dog.id == dog_id).first()
        if not db_dog:
            raise ValueError("Dog not found")
        
        for key, value in dog_data.dict().items():
            setattr(db_dog, key, value)
        
        db.commit()
        db.refresh(db_dog)
        return DogResponse.from_orm(db_dog)
    
    async def delete_dog(self, db: Session, dog_id: str):
        db_dog = db.query(Dog).filter(Dog.id == dog_id).first()
        if db_dog:
            db_dog.is_active = False
            db.commit()

class CollarService:
    async def create_collar(self, db: Session, collar_data: CollarCreate) -> CollarResponse:
        db_collar = Collar(
            id=str(uuid.uuid4()),
            **collar_data.dict()
        )
        db.add(db_collar)
        db.commit()
        db.refresh(db_collar)
        return CollarResponse.from_orm(db_collar)
    
    async def get_collars(self, db: Session, skip: int = 0, limit: int = 100) -> List[CollarResponse]:
        collars = db.query(Collar).offset(skip).limit(limit).all()
        return [CollarResponse.from_orm(collar) for collar in collars]
    
    async def get_collar(self, db: Session, collar_id: str) -> Optional[CollarResponse]:
        collar = db.query(Collar).filter(Collar.id == collar_id).first()
        return CollarResponse.from_orm(collar) if collar else None

class SensorDataService:
    async def create_sensor_data(self, db: Session, sensor_data: SensorDataCreate) -> SensorData:
        db_sensor_data = SensorData(
            id=str(uuid.uuid4()),
            **sensor_data.dict()
        )
        db.add(db_sensor_data)
        db.commit()
        db.refresh(db_sensor_data)
        return db_sensor_data
    
    async def get_sensor_data_by_dog(
        self, 
        db: Session, 
        dog_id: str, 
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 1000
    ) -> List[SensorDataResponse]:
        query = db.query(SensorData).filter(SensorData.dog_id == dog_id)
        
        if start_time:
            query = query.filter(SensorData.recorded_at >= start_time)
        if end_time:
            query = query.filter(SensorData.recorded_at <= end_time)
        
        sensor_data = query.order_by(desc(SensorData.recorded_at)).limit(limit).all()
        return [SensorDataResponse.from_orm(data) for data in sensor_data]
    
    async def get_aggression_trends(self, db: Session, dog_id: str, days: int = 7) -> List[dict]:
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        trends = db.query(
            func.date(SensorData.recorded_at).label('date'),
            SensorData.aggression_level,
            func.count(SensorData.id).label('count'),
            func.avg(SensorData.aggression_probability).label('avg_probability')
        ).filter(
            and_(
                SensorData.dog_id == dog_id,
                SensorData.recorded_at >= start_date,
                SensorData.recorded_at <= end_date
            )
        ).group_by(
            func.date(SensorData.recorded_at),
            SensorData.aggression_level
        ).all()
        
        return [
            {
                "date": trend.date.isoformat(),
                "aggression_level": trend.aggression_level.value if trend.aggression_level else 0,
                "count": trend.count,
                "avg_probability": float(trend.avg_probability or 0)
            }
            for trend in trends
        ]
    
    async def get_health_metrics(self, db: Session, dog_id: str, days: int = 7) -> List[dict]:
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        metrics = db.query(
            func.date(SensorData.recorded_at).label('date'),
            func.avg(SensorData.heart_rate_bpm).label('avg_heart_rate'),
            func.avg(SensorData.body_temperature).label('avg_temperature'),
            func.avg(SensorData.stress_cortisol).label('avg_stress_level')
        ).filter(
            and_(
                SensorData.dog_id == dog_id,
                SensorData.recorded_at >= start_date,
                SensorData.recorded_at <= end_date
            )
        ).group_by(
            func.date(SensorData.recorded_at)
        ).all()
        
        return [
            {
                "date": metric.date.isoformat(),
                "avg_heart_rate": float(metric.avg_heart_rate or 0),
                "avg_temperature": float(metric.avg_temperature or 0),
                "avg_stress_level": float(metric.avg_stress_level or 0)
            }
            for metric in metrics
        ]
    
    async def get_dashboard_analytics(self, db: Session) -> dict:
        total_dogs = db.query(Dog).filter(Dog.is_active == True).count()
        active_collars = db.query(Collar).filter(Collar.is_online == True).count()
        
        today = datetime.utcnow().date()
        interventions_today = db.query(Intervention).filter(
            func.date(Intervention.triggered_at) == today
        ).count()
        
        avg_aggression = db.query(func.avg(SensorData.aggression_level)).filter(
            SensorData.recorded_at >= datetime.utcnow() - timedelta(hours=24)
        ).scalar() or 0
        
        recent_interventions = db.query(Intervention).order_by(
            desc(Intervention.triggered_at)
        ).limit(5).all()
        
        return {
            "total_dogs": total_dogs,
            "active_collars": active_collars,
            "interventions_today": interventions_today,
            "avg_aggression_level": float(avg_aggression),
            "recent_interventions": [InterventionResponse.from_orm(i) for i in recent_interventions],
            "health_alerts": []  # Implement health alert logic
        }

class InterventionService:
    async def create_intervention(self, db: Session, intervention_data: dict) -> InterventionResponse:
        db_intervention = Intervention(
            id=str(uuid.uuid4()),
            **intervention_data
        )
        db.add(db_intervention)
        db.commit()
        db.refresh(db_intervention)
        return InterventionResponse.from_orm(db_intervention)
    
    async def get_interventions(
        self, 
        db: Session, 
        dog_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[InterventionResponse]:
        query = db.query(Intervention)
        if dog_id:
            query = query.filter(Intervention.dog_id == dog_id)
        
        interventions = query.order_by(desc(Intervention.triggered_at)).offset(skip).limit(limit).all()
        return [InterventionResponse.from_orm(intervention) for intervention in interventions]
    
    async def acknowledge_intervention(self, db: Session, intervention_id: str) -> InterventionResponse:
        intervention = db.query(Intervention).filter(Intervention.id == intervention_id).first()
        if not intervention:
            raise ValueError("Intervention not found")
        
        intervention.is_acknowledged = True
        intervention.acknowledged_at = datetime.utcnow()
        db.commit()
        db.refresh(intervention)
        return InterventionResponse.from_orm(intervention)

class AuthService:
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def create_access_token(self, data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    async def create_user(self, db: Session, user_data: UserCreate) -> UserResponse:
        hashed_password = self.get_password_hash(user_data.password)
        db_user = User(
            id=str(uuid.uuid4()),
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password,
            full_name=user_data.full_name
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return UserResponse.from_orm(db_user)
    
    async def authenticate_user(self, db: Session, login_data: LoginRequest) -> dict:
        user = db.query(User).filter(User.username == login_data.username).first()
        if not user or not self.verify_password(login_data.password, user.hashed_password):
            raise ValueError("Invalid credentials")
        
        access_token = self.create_access_token(data={"sub": user.username})
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

class MLService:
    def __init__(self):
        # Load ML model and scaler
        try:
            self.meta = joblib.load("ml/dog_aggression_model_meta.pkl")
            self.scaler = self.meta["scaler"]
            self.feature_names = self.meta["feature_names"]
            self.aggression_levels = self.meta["aggression_levels"]
            
            self.sess = rt.InferenceSession(
                "ml/dog_aggression_model.onnx", 
                providers=["CPUExecutionProvider"]
            )
            self.input_name = self.sess.get_inputs()[0].name
        except Exception as e:
            print(f"Warning: Could not load ML model: {e}")
            self.sess = None
    
    def engineer_features_df(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df['hr_stress_indicator'] = (df['heart_rate_bpm'] - 85) / 85
        df['night_risk'] = (df['time_of_day'] == 3).astype(int) * 3
        df['close_human_stress'] = (df['human_proximity_meters'] < 5).astype(int)
        df['pack_isolation'] = (df['other_dogs_nearby'] == 0).astype(int)
        df['young_male_risk'] = ((df['age_years'] < 3) & (df['sex'] == 1) & (df['sterilization_status'] == 0)).astype(int)
        df['behavioral_composite'] = (df['body_posture'] + df['tail_position'] + df['ear_position'] + df['vocalization_type']) / 4
        df['temp_deviation'] = abs(df['body_temperature'] - 38.8)
        return df
    
    async def predict_aggression(self, sensor_data: SensorDataCreate) -> dict:
        if not self.sess:
            # Return default prediction if model not loaded
            return {
                "aggression_level": 0,
                "aggression_label": "CALM",
                "probability": 0.1,
                "intervention": "LOW",
                "ultrasonic_frequency": 0,
                "duration_seconds": 0
            }
        
        try:
            # Convert sensor data to DataFrame
            df = pd.DataFrame([sensor_data.dict()])
            df = self.engineer_features_df(df)
            
            # Ensure correct column order
            X = df[self.feature_names].astype(np.float32).values
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            out = self.sess.run(None, {self.input_name: X_scaled})
            if len(out) == 1:
                probs = out[0]
            else:
                probs = out[1]
            
            probs = np.asarray(probs)
            pred = int(np.argmax(probs, axis=1)[0])
            max_prob = float(np.max(probs))
            
            # Determine intervention
            intervention = "LOW"
            freq = 0
            dur = 0
            
            if max_prob > 0.8:
                intervention = "CRITICAL"
                freq = 22000
                dur = 5
            elif max_prob > 0.6:
                intervention = "HIGH"
                freq = 20000
                dur = 3
            elif pred >= 2:
                intervention = "MEDIUM"
                freq = 18000
                dur = 2
            
            return {
                "aggression_level": pred,
                "aggression_label": self.aggression_levels.get(pred, str(pred)),
                "probability": max_prob,
                "intervention": intervention,
                "ultrasonic_frequency": freq,
                "duration_seconds": dur
            }
        except Exception as e:
            print(f"Error in ML prediction: {e}")
            return {
                "aggression_level": 0,
                "aggression_label": "CALM",
                "probability": 0.1,
                "intervention": "LOW",
                "ultrasonic_frequency": 0,
                "duration_seconds": 0
            }
