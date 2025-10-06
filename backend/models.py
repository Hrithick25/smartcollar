from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class AggressionLevel(enum.Enum):
    CALM = 0
    ALERT = 1
    AGITATED = 2
    AGGRESSIVE = 3
    DANGEROUS = 4

class InterventionType(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Sex(enum.Enum):
    FEMALE = 0
    MALE = 1

class SterilizationStatus(enum.Enum):
    NOT_STERILIZED = 0
    STERILIZED = 1

class BodyPosture(enum.Enum):
    RELAXED = 0
    ALERT = 1
    TENSE = 2
    AGGRESSIVE = 3

class TailPosition(enum.Enum):
    DOWN = 0
    NEUTRAL = 1
    UP = 2
    STIFF = 3

class EarPosition(enum.Enum):
    RELAXED = 0
    ALERT = 1
    FLATTENED = 2
    BACK = 3

class VocalizationType(enum.Enum):
    NONE = 0
    WHINING = 1
    BARKING = 2
    GROWLING = 3
    SNARLING = 4

class TimeOfDay(enum.Enum):
    MORNING = 0
    AFTERNOON = 1
    EVENING = 2
    NIGHT = 3

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    dogs = relationship("Dog", back_populates="owner")

class Dog(Base):
    __tablename__ = "dogs"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    breed = Column(String)
    age_years = Column(Integer)
    sex = Column(Enum(Sex))
    sterilization_status = Column(Enum(SterilizationStatus))
    weight_kg = Column(Float)
    color = Column(String)
    medical_history = Column(Text)
    vaccination_records = Column(Text)
    photo_url = Column(String)
    microchip_id = Column(String, unique=True)
    owner_id = Column(String, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="dogs")
    collars = relationship("Collar", back_populates="dog")
    sensor_data = relationship("SensorData", back_populates="dog")
    interventions = relationship("Intervention", back_populates="dog")

class Collar(Base):
    __tablename__ = "collars"
    
    id = Column(String, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True, nullable=False)
    dog_id = Column(String, ForeignKey("dogs.id"))
    battery_level = Column(Float, default=100.0)
    is_online = Column(Boolean, default=False)
    last_seen = Column(DateTime(timezone=True))
    firmware_version = Column(String)
    gps_latitude = Column(Float)
    gps_longitude = Column(Float)
    gps_accuracy = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    dog = relationship("Dog", back_populates="collars")
    sensor_data = relationship("SensorData", back_populates="collar")
    interventions = relationship("Intervention", back_populates="collar")

class SensorData(Base):
    __tablename__ = "sensor_data"
    
    id = Column(String, primary_key=True, index=True)
    dog_id = Column(String, ForeignKey("dogs.id"), nullable=False)
    collar_id = Column(String, ForeignKey("collars.id"), nullable=False)
    
    # Physiological data
    heart_rate_bpm = Column(Float, nullable=False)
    hrv_rmssd = Column(Float)
    body_temperature = Column(Float, nullable=False)
    stress_cortisol = Column(Float)
    
    # Behavioral data
    body_posture = Column(Enum(BodyPosture))
    tail_position = Column(Enum(TailPosition))
    ear_position = Column(Enum(EarPosition))
    vocalization_type = Column(Enum(VocalizationType))
    
    # Environmental data
    time_of_day = Column(Enum(TimeOfDay))
    human_proximity_meters = Column(Float)
    other_dogs_nearby = Column(Integer)
    
    # ML predictions
    aggression_level = Column(Enum(AggressionLevel))
    aggression_probability = Column(Float)
    intervention_required = Column(Boolean, default=False)
    
    # GPS data
    gps_latitude = Column(Float)
    gps_longitude = Column(Float)
    gps_accuracy = Column(Float)
    
    # Timestamps
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    dog = relationship("Dog", back_populates="sensor_data")
    collar = relationship("Collar", back_populates="sensor_data")

class Intervention(Base):
    __tablename__ = "interventions"
    
    id = Column(String, primary_key=True, index=True)
    dog_id = Column(String, ForeignKey("dogs.id"), nullable=False)
    collar_id = Column(String, ForeignKey("collars.id"), nullable=False)
    
    # Intervention details
    intervention_type = Column(Enum(InterventionType), nullable=False)
    ultrasonic_frequency = Column(Integer)
    duration_seconds = Column(Integer)
    
    # Context
    aggression_level = Column(Enum(AggressionLevel))
    confidence = Column(Float)
    trigger_data = Column(Text)  # JSON string of triggering sensor data
    
    # Status
    is_acknowledged = Column(Boolean, default=False)
    is_successful = Column(Boolean)
    notes = Column(Text)
    
    # Timestamps
    triggered_at = Column(DateTime(timezone=True), server_default=func.now())
    acknowledged_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    dog = relationship("Dog", back_populates="interventions")
    collar = relationship("Collar", back_populates="interventions")
