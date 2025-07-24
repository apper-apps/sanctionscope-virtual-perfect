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
      className="p-4 cursor-pointer hover:border-primary-300 transition-all duration-200 hover:-translate-y-1"
      onClick={() => onClick(entity)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {entity.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {entity.type || "Unknown Type"}
          </p>
        </div>
        <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400 ml-2" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={getRiskBadgeVariant(entity.matchScore)}>
            {entity.matchScore}% Match
          </Badge>
          <span className="text-xs text-gray-500">
            {getRiskLevel(entity.matchScore)}
          </span>
        </div>
        
        {entity.country && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <ApperIcon name="MapPin" className="w-3 h-3" />
            {entity.country}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EntityCard;