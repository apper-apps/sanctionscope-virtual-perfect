import { useState, useEffect } from "react";

export const useSearchHistory = () => {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load search history from sessionStorage
    const saved = sessionStorage.getItem("sanctionSearchHistory");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load search history:", error);
      }
    }
  }, []);

  const addSearch = (query, resultCount) => {
    const newSearch = {
      id: Date.now().toString(),
      query,
      resultCount,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [
      newSearch,
      ...recentSearches.filter(search => search.query !== query)
    ].slice(0, 10); // Keep only last 10 searches

    setRecentSearches(updatedHistory);
    sessionStorage.setItem("sanctionSearchHistory", JSON.stringify(updatedHistory));
  };

  return { recentSearches, addSearch };
};