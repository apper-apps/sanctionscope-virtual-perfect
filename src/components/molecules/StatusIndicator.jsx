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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
            status?.isConnected 
              ? 'bg-gradient-to-br from-success-500 to-success-600' 
              : 'bg-gradient-to-br from-danger-500 to-danger-600'
          }`}>
            <ApperIcon 
              name={getStatusIcon()} 
              className="w-5 h-5 text-white"
            />
          </div>
          <div>
            <Badge 
              variant={getStatusColor()} 
              className="text-sm font-semibold px-3 py-1"
            >
              {getStatusText()}
            </Badge>
            {status?.lastChecked && (
              <p className="text-xs text-gray-500 mt-1">
                Last checked: {format(new Date(status.lastChecked), "HH:mm:ss")}
              </p>
            )}
          </div>
        </div>
        
        {status?.responseTime && (
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              {status.responseTime}ms
            </div>
            <div className="text-xs text-gray-500">Response Time</div>
          </div>
        )}
      </div>
      
      {status?.errorMessage && (
        <div className="bg-danger-50 border border-danger-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="AlertTriangle" className="w-4 h-4 text-danger-600" />
            </div>
            <div>
              <h4 className="font-semibold text-danger-900 mb-1">Connection Error</h4>
              <p className="text-sm text-danger-700 leading-relaxed">
                {status.errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {status?.isConnected && (
        <div className="bg-success-50 border border-success-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Wifi" className="w-4 h-4 text-success-600" />
            </div>
            <div>
              <h4 className="font-semibold text-success-900 mb-1">Connected</h4>
              <p className="text-sm text-success-700">
                All systems operational
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;