// Client-side service that calls your Next.js API route (which then calls SWAPI)
import { SwapiPerson, SwapiResponse, SwapiServiceResponse } from './swapiTestService';

class SwapiProxyService {
  private baseUrl = '/api/swapi'; // Your Next.js API route

  /**
   * Search for people using your Next.js API route as proxy
   * This will work without CORS issues because it calls your own API
   */
  async searchPeople(searchQuery: string): Promise<SwapiServiceResponse<SwapiResponse>> {
    try {
      console.log(`🔍 Searching via Next.js API proxy: "${searchQuery}"`);
      
      const response = await fetch(`${this.baseUrl}/people?search=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API route responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'API route returned error');
      }

      console.log("✅ Next.js API proxy search successful:", result.data);

      return {
        data: result.data,
        success: true,
        corsError: false,
      };
    } catch (error: any) {
      console.error("❌ Next.js API proxy search failed:", error);

      return {
        data: { count: 0, next: null, previous: null, results: [] },
        success: false,
        error: error.message || "Failed to search via API proxy",
        corsError: false, // No CORS issues with API routes
      };
    }
  }

  /**
   * Get all people using your Next.js API route as proxy
   */
  async getAllPeople(page: number = 1): Promise<SwapiServiceResponse<SwapiResponse>> {
    try {
      console.log(`🔍 Fetching people via Next.js API proxy (page ${page})`);
      
      const response = await fetch(`${this.baseUrl}/people?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API route responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'API route returned error');
      }

      console.log("✅ Next.js API proxy fetch successful:", result.data);

      return {
        data: result.data,
        success: true,
        corsError: false,
      };
    } catch (error: any) {
      console.error("❌ Next.js API proxy fetch failed:", error);

      return {
        data: { count: 0, next: null, previous: null, results: [] },
        success: false,
        error: error.message || "Failed to fetch via API proxy",
        corsError: false,
      };
    }
  }
}

// Export a singleton instance
export const swapiProxyService = new SwapiProxyService();

export default swapiProxyService;
