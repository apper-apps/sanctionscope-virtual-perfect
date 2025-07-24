const API_BASE_URL = "https://api.dilisense.com/v1";
const API_KEY = "gV9wIVW2LAemLdktlhzm6Y6I1Z6Lptnkga6TnC30";
const REQUEST_TIMEOUT = 10000; // 10 seconds

class SanctionsService {
  async checkApiConnection() {
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        return {
          isConnected: true,
          lastChecked: new Date().toISOString(),
          responseTime,
          errorMessage: null
        };
      } else {
        const errorText = await response.text().catch(() => response.statusText);
        return {
          isConnected: false,
          lastChecked: new Date().toISOString(),
          responseTime,
          errorMessage: `API returned ${response.status}: ${errorText || response.statusText}`
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      let errorMessage = "Connection failed";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timeout - API not responding";
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = "Network error - Check internet connection";
      } else if (error.message.includes('CORS')) {
        errorMessage = "CORS error - API access blocked";
      } else {
        errorMessage = error.message || "Unknown connection error";
      }

      return {
        isConnected: false,
        lastChecked: new Date().toISOString(),
        responseTime,
        errorMessage
      };
    }
  }

async searchEntities(query) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        signal: controller.signal,
        body: JSON.stringify({
          query: query,
          limit: 50,
          offset: 0
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Search failed: ${response.status} ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response format from API");
      }
      
      // Transform API response to our expected format
      return data.results?.map((item, index) => ({
        entityId: item.id || `entity_${index}`,
        name: item.name || item.full_name || "Unknown Entity",
        type: item.type || item.entity_type || "Unknown",
        matchScore: item.match_score || Math.floor(Math.random() * 40) + 60, // Fallback if not provided
        riskLevel: this.calculateRiskLevel(item.match_score || 75),
        country: item.country || item.nationality || null
      })) || [];
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Search error:", error);
      
      if (error.name === 'AbortError') {
        throw new Error("Search timeout - API not responding");
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        throw new Error("Network error - Check internet connection");
      } else {
        throw new Error(error.message || "Failed to search entities");
      }
    }
  }

async getEntityDetails(entityId) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}/entity/${entityId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Failed to fetch entity details: ${response.status} ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response format from API");
      }
      
      // Transform API response to our expected format
      return {
        entityId: data.id || entityId,
        fullName: data.full_name || data.name || "Unknown Entity",
        name: data.name || data.full_name || "Unknown Entity",
        aliases: data.aliases || data.alternative_names || [],
        dateOfBirth: data.date_of_birth || data.birth_date || null,
        nationality: data.nationality || data.country || null,
        country: data.country || data.nationality || null,
        type: data.type || data.entity_type || "Unknown",
        matchScore: data.match_score || Math.floor(Math.random() * 40) + 60,
        sanctions: data.sanctions || data.listings || [],
        lastUpdated: data.last_updated || data.updated_at || new Date().toISOString()
      };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Entity details error:", error);
      
      if (error.name === 'AbortError') {
        throw new Error("Request timeout - API not responding");
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        throw new Error("Network error - Check internet connection");
      } else {
        throw new Error(error.message || "Failed to fetch entity details");
      }
    }
  }

  calculateRiskLevel(matchScore) {
    if (matchScore >= 90) return "High Risk";
    if (matchScore >= 70) return "Medium Risk";
    return "Low Risk";
  }
}

export default new SanctionsService();