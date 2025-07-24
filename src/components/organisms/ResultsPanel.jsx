import React from "react";
import EntityCard from "@/components/molecules/EntityCard";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const ResultsPanel = ({ 
  results, 
  loading, 
  query, 
  onEntityClick,
  error 
}) => {
if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <div className="animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3 w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3 w-1/2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
                </div>
                <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
            </div>
          </Card>
        ))}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-primary-600 font-medium">
            <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
            Searching global databases...
          </div>
        </div>
      </div>
    );
  }

if (error) {
    return (
      <Card className="p-10 text-center bg-gradient-to-br from-danger-50 to-red-50 border-danger-200/50 shadow-lg">
        <div className="w-16 h-16 bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Search Error</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">{error}</p>
        <div className="inline-flex items-center gap-2 text-sm text-danger-700 bg-danger-100 px-4 py-2 rounded-full">
          <ApperIcon name="Info" className="w-4 h-4" />
          Please try again or contact support
        </div>
      </Card>
    );
  }

  if (!query) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Search</h3>
        <p className="text-gray-600">
          Enter an entity name to search against global sanctions and watchlists
        </p>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="FileSearch" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600 mb-4">
          No entities found matching "{query}"
        </p>
        <p className="text-sm text-gray-500">
          Try searching with different keywords or check your spelling
        </p>
      </Card>
    );
  }

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Search Results
          </h2>
          <p className="text-gray-600">
            Found <span className="font-semibold text-primary-600">{results.length}</span> entities matching 
            <span className="font-medium"> "{query}"</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-200">
          <ApperIcon name="Database" className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">
            {results.length} results
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {results.map((entity, index) => (
          <div 
            key={entity.entityId}
            className="transform transition-all duration-200 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <EntityCard
              entity={entity}
              onClick={onEntityClick}
            />
          </div>
        ))}
      </div>

      {results.length > 10 && (
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing all {results.length} results
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;