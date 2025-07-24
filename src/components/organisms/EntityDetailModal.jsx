import React from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const EntityDetailModal = ({ entity, isOpen, onClose, loading }) => {
  if (!isOpen) return null;

  const getRiskBadgeVariant = (matchScore) => {
    if (matchScore >= 90) return "danger";
    if (matchScore >= 70) return "warning";
    return "success";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl"
            >
              <Card className="p-6 max-h-[80vh] overflow-y-auto">
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <Button variant="ghost" onClick={onClose}>
                        <ApperIcon name="X" className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {entity?.fullName || entity?.name}
                        </h2>
                        <div className="flex items-center gap-3">
                          <Badge variant={getRiskBadgeVariant(entity?.matchScore || 0)}>
                            {entity?.matchScore || 0}% Match
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {entity?.type || "Unknown Type"}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={onClose}>
                        <ApperIcon name="X" className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ApperIcon name="User" className="w-4 h-4" />
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {entity?.dateOfBirth && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                              <p className="text-sm text-gray-900">{entity.dateOfBirth}</p>
                            </div>
                          )}
                          {entity?.nationality && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Nationality</label>
                              <p className="text-sm text-gray-900">{entity.nationality}</p>
                            </div>
                          )}
                          {entity?.country && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Country</label>
                              <p className="text-sm text-gray-900">{entity.country}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Aliases */}
                      {entity?.aliases && entity.aliases.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <ApperIcon name="Users" className="w-4 h-4" />
                            Known Aliases
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {entity.aliases.map((alias, index) => (
                              <Badge key={index} variant="outline">
                                {alias}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sanctions */}
                      {entity?.sanctions && entity.sanctions.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <ApperIcon name="Shield" className="w-4 h-4" />
                            Sanctions & Listings
                          </h3>
                          <div className="space-y-2">
                            {entity.sanctions.map((sanction, index) => (
                              <Card key={index} className="p-3" variant="outline">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{sanction.list || "Unknown List"}</p>
                                    <p className="text-sm text-gray-600">{sanction.reason || "No reason provided"}</p>
                                  </div>
                                  <Badge variant="danger" size="sm">
                                    Active
                                  </Badge>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Details */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Entity ID: {entity?.entityId}</span>
                          {entity?.lastUpdated && (
                            <span>
                              Updated: {format(new Date(entity.lastUpdated), "MMM dd, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EntityDetailModal;