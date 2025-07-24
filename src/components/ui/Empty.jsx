import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  description = "Get started by performing your first search",
  actionLabel = "Start Searching",
  onAction,
  icon = "Search"
}) => {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
          <ApperIcon name="Search" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;