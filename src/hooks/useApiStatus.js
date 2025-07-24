import { useState, useEffect } from "react";
import sanctionsService from "@/services/api/sanctionsService";

export const useApiStatus = () => {
  const [status, setStatus] = useState({
    isConnected: false,
    lastChecked: null,
    responseTime: null,
    errorMessage: null
  });

  const checkStatus = async () => {
    try {
      const statusResult = await sanctionsService.checkApiConnection();
      setStatus(statusResult);
    } catch (error) {
      setStatus({
        isConnected: false,
        lastChecked: new Date().toISOString(),
        responseTime: null,
        errorMessage: "Failed to check API status"
      });
    }
  };

  useEffect(() => {
    // Check status immediately
    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { status, checkStatus };
};