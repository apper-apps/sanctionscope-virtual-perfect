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
      {/* Enhanced API Status */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <StatusIndicator status={apiStatus} />
      </div>
      
      {/* Enhanced Search Bar */}
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Search" className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Entity Search
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Search for entities against global sanctions lists, watchlists, and PEP databases
          </p>
        </div>
        <SearchBar 
          onSearch={onSearch} 
          loading={loading}
          placeholder="Enter entity name, company, or individual..."
        />
      </Card>

      {/* Enhanced Recent Searches */}
      {recentSearches.length > 0 && (
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="History" className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Recent Searches</h3>
            <div className="ml-auto">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {recentSearches.length}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {recentSearches.slice(0, 10).map((search) => (
              <div key={search.id} className="group">
                <RecentSearchItem
                  search={search}
                  onClick={onRecentSearchClick}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Stats Card */}
      <Card className="p-6 bg-gradient-to-br from-primary-50 to-indigo-50 border-primary-200/50 shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Shield" className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Global Coverage</h4>
          <p className="text-sm text-gray-600">
            Access to 200+ sanctions lists worldwide
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SearchPanel;