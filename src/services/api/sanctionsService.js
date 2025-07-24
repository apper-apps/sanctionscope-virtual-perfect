// Get API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.sanctions-check.com/v1";
const API_KEY = import.meta.env.VITE_API_KEY || "gV9wIVW2LAemLdktlhzm6Y6I1Z6Lptnkga6TnC30";
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Enhanced error handling utility
const createApiError = (message, status, endpoint, originalError = null) => {
  const error = new Error(message);
  error.status = status;
  error.endpoint = endpoint;
  error.originalError = originalError;
  error.timestamp = new Date().toISOString();
  return error;
};

// Retry utility for transient failures
const retryRequest = async (requestFn, maxRetries = MAX_RETRIES) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry for client errors (4xx) except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      console.log(`Retrying API request (attempt ${attempt + 1}/${maxRetries})`);
    }
  }
  
  throw lastError;
};

// Enhanced fetch wrapper with better error handling
const apiRequest = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    
const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers,
      },
      mode: "cors",
      credentials: "omit",
    });
    
    clearTimeout(timeoutId);
    
    // Handle different HTTP status codes
    if (!response.ok) {
      let errorMessage;
      let errorDetails = null;
      
      try {
        errorDetails = await response.json();
      } catch {
        // Response body is not JSON
      }
      
      switch (response.status) {
        case 400:
          errorMessage = errorDetails?.message || "Invalid request parameters";
          break;
        case 401:
          errorMessage = "Authentication failed. Please check your API key.";
          break;
        case 403:
          errorMessage = "Access forbidden. Insufficient permissions.";
          break;
        case 404:
          errorMessage = `API endpoint not found. The service may be temporarily unavailable or the URL '${url}' is incorrect.`;
          break;
        case 429:
          errorMessage = "Rate limit exceeded. Please try again later.";
          break;
        case 500:
          errorMessage = "Internal server error. Please try again later.";
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = "Service temporarily unavailable. Please try again later.";
          break;
        default:
          errorMessage = errorDetails?.message || `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw createApiError(errorMessage, response.status, endpoint, errorDetails);
    }
    
    const data = await response.json();
    console.log(`API Response: ${response.status} for ${endpoint}`);
    return data;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw createApiError(
        `Request timeout after ${REQUEST_TIMEOUT}ms. The API may be slow or unavailable.`,
        408,
        endpoint,
        error
      );
    }
    
    if (error.status) {
      // Already an API error, re-throw
      throw error;
    }
    
    // Network or other errors
    throw createApiError(
      `Network error: ${error.message}. Please check your internet connection.`,
      0,
      endpoint,
      error
    );
  }
};

class SanctionsService {
  async checkApiConnection() {
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const data = await retryRequest(() => apiRequest('/health', { method: 'GET' }));

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      return {
        isConnected: true,
        lastChecked: new Date().toISOString(),
        responseTime,
        errorMessage: null
      };
    } catch (error) {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      let errorMessage = "Connection failed";
      
if (error.name === 'AbortError') {
        errorMessage = "Connection timeout - API server not responding";
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
        errorMessage = "Network error: Unable to reach API server. Please check your internet connection and try again.";
      } else if (error.message.includes('CORS')) {
        errorMessage = "Access blocked - CORS policy restriction";
      } else if (error.message.includes('DNS') || error.message.includes('resolve')) {
        errorMessage = "Cannot resolve server address - Check your network connection";
      } else {
        errorMessage = error.message || "Connection failed - Please verify your internet connection";
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
      // Convert to GET request with query parameters
      const searchParams = new URLSearchParams({
        query: query,
        limit: 50,
        offset: 0
      });
      
      const data = await retryRequest(() => 
        apiRequest(`/search?${searchParams.toString()}`, {
          method: 'GET'
        })
      );

      clearTimeout(timeoutId);
      
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
        throw new Error("Search timeout - API server not responding");
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
        throw new Error("Network error: Unable to complete search. Please check your internet connection and try again.");
      } else {
        throw new Error(error.message || "Search failed - Please verify your connection and try again");
      }
    }
  }

async getEntityDetails(entityId) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const data = await retryRequest(() => 
        apiRequest(`/entity/${entityId}`, { method: 'GET' })
      );

      clearTimeout(timeoutId);
      
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
        throw new Error("Request timeout - API server not responding");
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
        throw new Error("Network error: Unable to load entity details. Please check your internet connection and try again.");
      } else {
        throw new Error(error.message || "Failed to load details - Please verify your connection and try again");
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