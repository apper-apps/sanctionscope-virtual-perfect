import React from "react";
import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusIndicator = ({ status }) => {
  const getStatusColor = () => {
    if (status?.isConnected) return "success";
    return "danger";
  };

  const getStatusIcon = () => {
    if (status?.isConnected) return "CheckCircle";
    return "XCircle";
  };

  const getStatusText = () => {
    if (status?.isConnected) return "API Connected";
    return "API Disconnected";
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2">
        <ApperIcon 
          name={getStatusIcon()} 
          className={`w-4 h-4 ${status?.isConnected ? 'text-success-600' : 'text-danger-600'}`}
        />
        <Badge variant={getStatusColor()}>
          {getStatusText()}
        </Badge>
      </div>
      
      {status?.lastChecked && (
        <div className="text-sm text-gray-500">
          Last checked: {format(new Date(status.lastChecked), "HH:mm:ss")}
        </div>
      )}
      
      {status?.responseTime && (
        <div className="text-sm text-gray-500">
          {status.responseTime}ms
        </div>
      )}
      
      {status?.errorMessage && (
        <div className="text-sm text-danger-600 flex items-center gap-1">
          <ApperIcon name="AlertTriangle" className="w-3 h-3" />
          {status.errorMessage}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;