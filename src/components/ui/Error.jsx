import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry, title = "Something went wrong" }) => {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-danger-400 to-danger-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;