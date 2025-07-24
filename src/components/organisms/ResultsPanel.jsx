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
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              </div>
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="AlertTriangle" className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Search Results for "{query}"
        </h2>
        <span className="text-sm text-gray-500">
          {results.length} entities found
        </span>
      </div>
      
      <div className="space-y-3">
        {results.map((entity) => (
          <EntityCard
            key={entity.entityId}
            entity={entity}
            onClick={onEntityClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsPanel;