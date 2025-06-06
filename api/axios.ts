import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Base configuration for the API
const API_BASE_URL = "https://starwars-databank-server.vercel.app/api/v1";

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Log the request in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      );
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for handling common responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log the response in development
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      console.error(
        `❌ API Error: ${error.response.status} ${error.response.config.url}`,
      );

      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error("Unauthorized access");
          break;
        case 403:
          // Handle forbidden
          console.error("Forbidden access");
          break;
        case 404:
          // Handle not found
          console.error("Resource not found");
          break;
        case 500:
          // Handle server error
          console.error("Internal server error");
          break;
        default:
          console.error("API request failed");
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - no response received");
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  },
);

// Generic HTTP methods
export const httpClient = {
  // GET request
  get: async <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: async <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: async <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: async <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

// Export the configured axios instance for direct use if needed
export { apiClient };
export default httpClient;
