import React from "react";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const RecentSearchItem = ({ search, onClick }) => {
  return (
    <div 
      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-200"
      onClick={() => onClick(search.query)}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {search.query}
        </p>
        <p className="text-xs text-gray-500">
          {search.resultCount} results • {formatDistanceToNow(new Date(search.timestamp), { addSuffix: true })}
        </p>
      </div>
      <ApperIcon name="Clock" className="w-4 h-4 text-gray-400 ml-2" />
    </div>
  );
};

export default RecentSearchItem;