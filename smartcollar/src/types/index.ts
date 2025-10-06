// Enums
export enum AggressionLevel {
  CALM = 'CALM',
  ALERT = 'ALERT',
  AGITATED = 'AGITATED',
  AGGRESSIVE = 'AGGRESSIVE',
  DANGEROUS = 'DANGEROUS'
}

export enum InterventionType {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum Sex {
  FEMALE = 'FEMALE',
  MALE = 'MALE'
}

export enum SterilizationStatus {
  NOT_STERILIZED = 'NOT_STERILIZED',
  STERILIZED = 'STERILIZED'
}

export enum BodyPosture {
  RELAXED = 'RELAXED',
  ALERT = 'ALERT',
  TENSE = 'TENSE',
  AGGRESSIVE = 'AGGRESSIVE'
}

export enum TailPosition {
  DOWN = 'DOWN',
  NEUTRAL = 'NEUTRAL',
  UP = 'UP',
  STIFF = 'STIFF'
}

export enum EarPosition {
  RELAXED = 'RELAXED',
  ALERT = 'ALERT',
  FLATTENED = 'FLATTENED',
  BACK = 'BACK'
}

export enum VocalizationType {
  NONE = 'NONE',
  WHINING = 'WHINING',
  BARKING = 'BARKING',
  GROWLING = 'GROWLING',
  SNARLING = 'SNARLING'
}

export enum TimeOfDay {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT'
}

// Core interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  age_years?: number;
  sex?: Sex;
  sterilization_status?: SterilizationStatus;
  weight_kg?: number;
  color?: string;
  medical_history?: string;
  vaccination_records?: string;
  photo_url?: string;
  microchip_id?: string;
  owner_id: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Collar {
  id: string;
  device_id: string;
  dog_id?: string;
  battery_level: number;
  is_online: boolean;
  last_seen?: string;
  firmware_version?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  gps_accuracy?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SensorData {
  id: string;
  dog_id: string;
  collar_id: string;
  heart_rate_bpm: number;
  hrv_rmssd?: number;
  body_temperature: number;
  stress_cortisol?: number;
  body_posture?: BodyPosture;
  tail_position?: TailPosition;
  ear_position?: EarPosition;
  vocalization_type?: VocalizationType;
  time_of_day?: TimeOfDay;
  human_proximity_meters?: number;
  other_dogs_nearby?: number;
  gps_latitude?: number;
  gps_longitude?: number;
  gps_accuracy?: number;
  aggression_level?: AggressionLevel;
  aggression_probability?: number;
  intervention_required: boolean;
  recorded_at: string;
  processed_at?: string;
}

export interface Intervention {
  id: string;
  dog_id: string;
  collar_id: string;
  intervention_type: InterventionType;
  ultrasonic_frequency?: number;
  duration_seconds?: number;
  aggression_level?: AggressionLevel;
  confidence?: number;
  trigger_data?: string;
  is_acknowledged: boolean;
  is_successful?: boolean;
  notes?: string;
  triggered_at: string;
  acknowledged_at?: string;
  completed_at?: string;
}

// Form interfaces
export interface DogFormData {
  name: string;
  breed?: string;
  age_years?: number;
  sex?: Sex;
  sterilization_status?: SterilizationStatus;
  weight_kg?: number;
  color?: string;
  medical_history?: string;
  vaccination_records?: string;
  photo_url?: string;
  microchip_id?: string;
}

export interface CollarFormData {
  device_id: string;
  dog_id?: string;
  battery_level?: number;
  firmware_version?: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

// Analytics interfaces
export interface AggressionTrendData {
  date: string;
  aggression_level: number;
  count: number;
  avg_probability: number;
}

export interface HealthMetricsData {
  date: string;
  avg_heart_rate: number;
  avg_temperature: number;
  avg_stress_level: number;
}

export interface DashboardAnalytics {
  total_dogs: number;
  active_collars: number;
  interventions_today: number;
  avg_aggression_level: number;
  recent_interventions: Intervention[];
  health_alerts: string[];
}

// WebSocket message interfaces
export interface WebSocketMessage {
  type: 'sensor_update' | 'intervention_alert' | 'health_alert' | 'ping';
  dog_id?: string;
  data?: any;
  timestamp?: string;
}

export interface SensorUpdateMessage extends WebSocketMessage {
  type: 'sensor_update';
  dog_id: string;
  data: SensorData;
}

export interface InterventionAlertMessage extends WebSocketMessage {
  type: 'intervention_alert';
  dog_id: string;
  data: Intervention;
}

export interface HealthAlertMessage extends WebSocketMessage {
  type: 'health_alert';
  dog_id: string;
  data: {
    alert_type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

// Chart data interfaces
export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: string;
}

export interface TimeSeriesData {
  time: string;
  value: number;
  label?: string;
}

// Filter interfaces
export interface DogFilters {
  search?: string;
  breed?: string;
  sex?: Sex;
  sterilization_status?: SterilizationStatus;
  is_active?: boolean;
}

export interface SensorDataFilters {
  dog_id?: string;
  start_date?: string;
  end_date?: string;
  aggression_level?: AggressionLevel;
  intervention_required?: boolean;
}

export interface InterventionFilters {
  dog_id?: string;
  intervention_type?: InterventionType;
  is_acknowledged?: boolean;
  start_date?: string;
  end_date?: string;
}

// Export types
export type DogStatus = 'healthy' | 'warning' | 'critical' | 'offline';
export type CollarStatus = 'online' | 'offline' | 'low_battery' | 'error';
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
