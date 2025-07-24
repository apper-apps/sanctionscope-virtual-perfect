import React from "react";
import SearchBar from "@/components/molecules/SearchBar";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import RecentSearchItem from "@/components/molecules/RecentSearchItem";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const SearchPanel = ({ 
  onSearch, 
  loading, 
  apiStatus, 
  recentSearches, 
  onRecentSearchClick 
}) => {
  return (
    <div className="space-y-6">
      {/* API Status */}
      <StatusIndicator status={apiStatus} />
      
      {/* Search Bar */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Entity Search
          </h2>
          <p className="text-sm text-gray-600">
            Search for entities against global sanctions and watchlists
          </p>
        </div>
        <SearchBar 
          onSearch={onSearch} 
          loading={loading}
          placeholder="Enter entity name, company, or individual..."
        />
      </Card>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="History" className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Recent Searches</h3>
          </div>
          <div className="space-y-1">
            {recentSearches.slice(0, 10).map((search) => (
              <RecentSearchItem
                key={search.id}
                search={search}
                onClick={onRecentSearchClick}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchPanel;