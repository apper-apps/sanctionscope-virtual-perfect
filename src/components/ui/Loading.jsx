import React from "react";
import Card from "@/components/atoms/Card";

const Loading = ({ type = "search" }) => {
  if (type === "search") {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 w-1/2"></div>
              </div>
              <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default Loading;