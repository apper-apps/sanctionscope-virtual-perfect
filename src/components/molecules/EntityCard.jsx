import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const EntityCard = ({ entity, onClick }) => {
  const getRiskBadgeVariant = (matchScore) => {
    if (matchScore >= 90) return "danger";
    if (matchScore >= 70) return "warning";
    return "success";
  };

  const getRiskLevel = (matchScore) => {
    if (matchScore >= 90) return "High Risk";
    if (matchScore >= 70) return "Medium Risk";
    return "Low Risk";
  };

return (
    <Card 
      className="p-6 cursor-pointer bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl hover:border-primary-300/50 transition-all duration-300 hover:-translate-y-1 group"
      onClick={() => onClick(entity)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1 text-lg group-hover:text-primary-700 transition-colors duration-200">
                {entity.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  {entity.type || "Unknown Type"}
                </span>
                {entity.country && (
                  <>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <ApperIcon name="MapPin" className="w-3 h-3" />
                      {entity.country}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-200">
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Badge 
            variant={getRiskBadgeVariant(entity.matchScore)}
            className="font-semibold px-3 py-1.5"
          >
            {entity.matchScore}% Match
          </Badge>
          <div className="text-sm">
            <span className="font-medium text-gray-700">
              {getRiskLevel(entity.matchScore)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
          <ApperIcon name="Eye" className="w-3 h-3" />
          View Details
        </div>
      </div>
    </Card>
  );
};

export default EntityCard;