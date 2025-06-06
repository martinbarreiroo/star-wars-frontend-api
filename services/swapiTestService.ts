import axios, { AxiosInstance } from "axios";

// SWAPI types based on their API response structure
export interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiPerson[];
}

export interface SwapiServiceResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  corsError?: boolean;
}

/**
 * Service to test SWAPI (Star Wars API) endpoints
 * This is specifically to test CORS issues with direct client-side calls
 */
class SwapiTestService {
  private apiClient: AxiosInstance;
  private baseUrl = "https://swapi.dev/api";

  constructor() {
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.apiClient.interceptors.request.use(
      (config) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 SWAPI Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error("SWAPI Request interceptor error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.apiClient.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ SWAPI Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        console.error("❌ SWAPI Error:", error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Test method to check if SWAPI is accessible
   */
  async testConnection(): Promise<SwapiServiceResponse<{ status: string; message: string }>> {
    try {
      console.log("🔗 Testing SWAPI connection...");
      
      // Try to fetch a simple endpoint
      const response = await this.apiClient.get("/people/1/");

      return {
        data: {
          status: "success",
          message: "SWAPI is accessible from client-side"
        },
        success: true,
        corsError: false,
      };
    } catch (error: any) {
      console.error("❌ SWAPI connection test failed:", error);

      let corsError = false;
      let message = "SWAPI connection failed";

      if (error.code === "ERR_NETWORK" || 
          (error.message && error.message.includes("CORS")) ||
          (error.response === undefined && error.request)) {
        message = "CORS error detected: SWAPI cannot be accessed from client-side";
        corsError = true;
      }

      return {
        data: {
          status: "error",
          message
        },
        success: false,
        error: message,
        corsError,
      };
    }
  }

  /**
   * Search for people (characters) in SWAPI
   * Example: searchPeople("Leia")
   */
  async searchPeople(searchQuery: string): Promise<SwapiServiceResponse<SwapiResponse>> {
    try {
      console.log(`🔍 Searching SWAPI for people: "${searchQuery}"`);
      
      const response = await this.apiClient.get<SwapiResponse>("/people/", {
        params: {
          search: searchQuery,
        },
      });

      console.log("✅ SWAPI search successful:", response.data);

      return {
        data: response.data,
        success: true,
        corsError: false,
      };
    } catch (error: any) {
      console.error("❌ SWAPI search failed:", error);

      let errorMessage = "Failed to search SWAPI";
      let corsError = false;

      // Check if it's a CORS error
      if (error.code === "ERR_NETWORK" || 
          (error.message && error.message.includes("CORS")) ||
          (error.response === undefined && error.request)) {
        errorMessage = "CORS error: Cannot access SWAPI from client-side. This API requires server-side calls or a proxy.";
        corsError = true;
      } else if (error.response?.status === 404) {
        errorMessage = "No people found with that search term";
      } else if (error.response?.status >= 500) {
        errorMessage = "SWAPI server error. Please try again later.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. SWAPI might be slow or unavailable.";
      }

      return {
        data: { count: 0, next: null, previous: null, results: [] },
        success: false,
        error: errorMessage,
        corsError,
      };
    }
  }
}

// Export a singleton instance
export const swapiTestService = new SwapiTestService();

export default swapiTestService;
