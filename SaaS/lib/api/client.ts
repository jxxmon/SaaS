/**
 * API Client for SaaS Platform
 * Centralized HTTP client with authentication, error handling, and interceptors
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = ;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status,
        };

        if (error.response) {
          // Server responded with error
          const data = error.response.data as any;
          apiError.message = data?.message || error.message;
          apiError.code = data?.code;
          apiError.details = data?.details;
        } else if (error.request) {
          // Request made but no response
          apiError.message = 'Network error. Please check your connection.';
        }

        // Handle specific status codes
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect
          this.clearAuthToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  private clearAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }

  private generateRequestId(): string {
    return ;
  }

  // Public methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return {
        data: response.data,
        status: response.status,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Operation successful',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Update successful',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Partial update successful',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Deletion successful',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  // File upload
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: AxiosResponse<T> = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return {
        data: response.data,
        status: response.status,
        message: 'Upload successful',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Export for direct use
export default apiClient;
EOF'
