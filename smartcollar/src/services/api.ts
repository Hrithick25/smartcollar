import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Dog, 
  Collar, 
  SensorData, 
  Intervention, 
  User, 
  DogFormData, 
  CollarFormData,
  LoginFormData,
  RegisterFormData,
  DashboardAnalytics,
  AggressionTrendData,
  HealthMetricsData,
  DogFilters,
  SensorDataFilters,
  InterventionFilters
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: LoginFormData): Promise<{ access_token: string; token_type: string }> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterFormData): Promise<User> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // Dog management endpoints
  async getDogs(filters?: DogFilters): Promise<Dog[]> {
    const response = await this.api.get('/dogs', { params: filters });
    return response.data;
  }

  async getDog(dogId: string): Promise<Dog> {
    const response = await this.api.get(`/dogs/${dogId}`);
    return response.data;
  }

  async createDog(dogData: DogFormData): Promise<Dog> {
    const response = await this.api.post('/dogs', dogData);
    return response.data;
  }

  async updateDog(dogId: string, dogData: DogFormData): Promise<Dog> {
    const response = await this.api.put(`/dogs/${dogId}`, dogData);
    return response.data;
  }

  async deleteDog(dogId: string): Promise<void> {
    await this.api.delete(`/dogs/${dogId}`);
  }

  // Collar management endpoints
  async getCollars(): Promise<Collar[]> {
    const response = await this.api.get('/collars');
    return response.data;
  }

  async getCollar(collarId: string): Promise<Collar> {
    const response = await this.api.get(`/collars/${collarId}`);
    return response.data;
  }

  async createCollar(collarData: CollarFormData): Promise<Collar> {
    const response = await this.api.post('/collars', collarData);
    return response.data;
  }

  async updateCollar(collarId: string, collarData: CollarFormData): Promise<Collar> {
    const response = await this.api.put(`/collars/${collarId}`, collarData);
    return response.data;
  }

  // Sensor data endpoints
  async getSensorData(dogId: string, filters?: SensorDataFilters): Promise<SensorData[]> {
    const response = await this.api.get(`/sensor-data/${dogId}`, { params: filters });
    return response.data;
  }

  async getLatestSensorData(dogId: string): Promise<SensorData> {
    const response = await this.api.get(`/sensor-data/latest/${dogId}`);
    return response.data;
  }

  async createSensorData(sensorData: Partial<SensorData>): Promise<SensorData> {
    const response = await this.api.post('/sensor-data', sensorData);
    return response.data;
  }

  // Intervention endpoints
  async getInterventions(filters?: InterventionFilters): Promise<Intervention[]> {
    const response = await this.api.get('/interventions', { params: filters });
    return response.data;
  }

  async acknowledgeIntervention(interventionId: string): Promise<Intervention> {
    const response = await this.api.post(`/interventions/${interventionId}/acknowledge`);
    return response.data;
  }

  // Analytics endpoints
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const response = await this.api.get('/analytics/dashboard');
    return response.data;
  }

  async getAggressionTrends(dogId: string, days: number = 7): Promise<AggressionTrendData[]> {
    const response = await this.api.get(`/analytics/aggression-trends/${dogId}`, {
      params: { days }
    });
    return response.data;
  }

  async getHealthMetrics(dogId: string, days: number = 7): Promise<HealthMetricsData[]> {
    const response = await this.api.get(`/analytics/health-metrics/${dogId}`, {
      params: { days }
    });
    return response.data;
  }

  // File upload endpoints
  async uploadDogPhoto(dogId: string, file: File): Promise<{ photo_url: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await this.api.post(`/dogs/${dogId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Export endpoints
  async exportDogData(dogId: string, format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await this.api.get(`/export/dog-data/${dogId}`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }

  async exportInterventions(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await this.api.get('/export/interventions', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
