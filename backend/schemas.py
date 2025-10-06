from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class AggressionLevel(str, Enum):
    CALM = "CALM"
    ALERT = "ALERT"
    AGITATED = "AGITATED"
    AGGRESSIVE = "AGGRESSIVE"
    DANGEROUS = "DANGEROUS"

class InterventionType(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Sex(str, Enum):
    FEMALE = "FEMALE"
    MALE = "MALE"

class SterilizationStatus(str, Enum):
    NOT_STERILIZED = "NOT_STERILIZED"
    STERILIZED = "STERILIZED"

class BodyPosture(str, Enum):
    RELAXED = "RELAXED"
    ALERT = "ALERT"
    TENSE = "TENSE"
    AGGRESSIVE = "AGGRESSIVE"

class TailPosition(str, Enum):
    DOWN = "DOWN"
    NEUTRAL = "NEUTRAL"
    UP = "UP"
    STIFF = "STIFF"

class EarPosition(str, Enum):
    RELAXED = "RELAXED"
    ALERT = "ALERT"
    FLATTENED = "FLATTENED"
    BACK = "BACK"

class VocalizationType(str, Enum):
    NONE = "NONE"
    WHINING = "WHINING"
    BARKING = "BARKING"
    GROWLING = "GROWLING"
    SNARLING = "SNARLING"

class TimeOfDay(str, Enum):
    MORNING = "MORNING"
    AFTERNOON = "AFTERNOON"
    EVENING = "EVENING"
    NIGHT = "NIGHT"

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dog schemas
class DogBase(BaseModel):
    name: str
    breed: Optional[str] = None
    age_years: Optional[int] = None
    sex: Optional[Sex] = None
    sterilization_status: Optional[SterilizationStatus] = None
    weight_kg: Optional[float] = None
    color: Optional[str] = None
    medical_history: Optional[str] = None
    vaccination_records: Optional[str] = None
    photo_url: Optional[str] = None
    microchip_id: Optional[str] = None

class DogCreate(DogBase):
    pass

class DogResponse(DogBase):
    id: str
    owner_id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Collar schemas
class CollarBase(BaseModel):
    device_id: str
    dog_id: Optional[str] = None
    battery_level: Optional[float] = 100.0
    firmware_version: Optional[str] = None

class CollarCreate(CollarBase):
    pass

class CollarResponse(CollarBase):
    id: str
    is_online: bool
    last_seen: Optional[datetime] = None
    gps_latitude: Optional[float] = None
    gps_longitude: Optional[float] = None
    gps_accuracy: Optional[float] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Sensor data schemas
class SensorDataBase(BaseModel):
    dog_id: str
    collar_id: str
    heart_rate_bpm: float = Field(..., ge=30, le=200)
    hrv_rmssd: Optional[float] = None
    body_temperature: float = Field(..., ge=35.0, le=42.0)
    stress_cortisol: Optional[float] = None
    body_posture: Optional[BodyPosture] = None
    tail_position: Optional[TailPosition] = None
    ear_position: Optional[EarPosition] = None
    vocalization_type: Optional[VocalizationType] = None
    time_of_day: Optional[TimeOfDay] = None
    human_proximity_meters: Optional[float] = None
    other_dogs_nearby: Optional[int] = None
    gps_latitude: Optional[float] = None
    gps_longitude: Optional[float] = None
    gps_accuracy: Optional[float] = None

class SensorDataCreate(SensorDataBase):
    pass

class SensorDataResponse(SensorDataBase):
    id: str
    aggression_level: Optional[AggressionLevel] = None
    aggression_probability: Optional[float] = None
    intervention_required: bool = False
    recorded_at: datetime
    processed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Intervention schemas
class InterventionBase(BaseModel):
    dog_id: str
    collar_id: str
    intervention_type: InterventionType
    ultrasonic_frequency: Optional[int] = None
    duration_seconds: Optional[int] = None
    aggression_level: Optional[AggressionLevel] = None
    confidence: Optional[float] = None
    trigger_data: Optional[str] = None

class InterventionCreate(InterventionBase):
    pass

class InterventionResponse(InterventionBase):
    id: str
    is_acknowledged: bool
    is_successful: Optional[bool] = None
    notes: Optional[str] = None
    triggered_at: datetime
    acknowledged_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Authentication schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Analytics schemas
class AggressionTrendData(BaseModel):
    date: str
    aggression_level: int
    count: int
    avg_probability: float

class HealthMetricsData(BaseModel):
    date: str
    avg_heart_rate: float
    avg_temperature: float
    avg_stress_level: float

class DashboardAnalytics(BaseModel):
    total_dogs: int
    active_collars: int
    interventions_today: int
    avg_aggression_level: float
    recent_interventions: List[InterventionResponse]
    health_alerts: List[str]

# ML Prediction schemas
class MLPrediction(BaseModel):
    dog_id: str
    aggression_level: int
    aggression_label: str
    probability: float
    intervention: str
    ultrasonic_frequency: int
    duration_seconds: int
