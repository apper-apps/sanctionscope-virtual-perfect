import React, { useState } from "react";
import { toast } from "react-toastify";
import SearchPanel from "@/components/organisms/SearchPanel";
import ResultsPanel from "@/components/organisms/ResultsPanel";
import EntityDetailModal from "@/components/organisms/EntityDetailModal";
import { useApiStatus } from "@/hooks/useApiStatus";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import sanctionsService from "@/services/api/sanctionsService";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityDetailLoading, setEntityDetailLoading] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false);

  const { status: apiStatus } = useApiStatus();
  const { recentSearches, addSearch } = useSearchHistory();

  const handleSearch = async (query) => {
    if (!apiStatus.isConnected) {
      toast.error("API is not connected. Please check your connection.");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentQuery(query);

    try {
      const results = await sanctionsService.searchEntities(query);
      setSearchResults(results);
      addSearch(query, results.length);
      
      if (results.length === 0) {
        toast.info(`No entities found for "${query}"`);
      } else {
        toast.success(`Found ${results.length} entities for "${query}"`);
      }
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
      toast.error(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEntityClick = async (entity) => {
    setSelectedEntity(entity);
    setShowEntityModal(true);
    setEntityDetailLoading(true);

    try {
      const details = await sanctionsService.getEntityDetails(entity.entityId);
      setSelectedEntity(details);
    } catch (err) {
      toast.error(`Failed to load entity details: ${err.message}`);
      setSelectedEntity(entity); // Fall back to basic entity data
    } finally {
      setEntityDetailLoading(false);
    }
  };

  const handleRecentSearchClick = (query) => {
    handleSearch(query);
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Modern Header with Glass Effect */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  SanctionScope
                </h1>
                <p className="text-sm text-gray-600 font-medium">Advanced AML Compliance Screening</p>
              </div>
            </div>
            
            {/* Status Badge in Header */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-gray-200/50">
              <div className={`w-2 h-2 rounded-full ${apiStatus.isConnected ? 'bg-success-500 animate-pulse' : 'bg-danger-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {apiStatus.isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-indigo-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Global Sanctions
              <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent"> Screening</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive AML compliance screening against global sanctions lists, 
              watchlists, and politically exposed persons databases.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Enhanced Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Enhanced Search Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <SearchPanel
                onSearch={handleSearch}
                loading={loading}
                apiStatus={apiStatus}
                recentSearches={recentSearches}
                onRecentSearchClick={handleRecentSearchClick}
              />
            </div>
          </div>

          {/* Enhanced Results Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
              <div className="p-6">
                <ResultsPanel
                  results={searchResults}
                  loading={loading}
                  query={currentQuery}
                  error={error}
                  onEntityClick={handleEntityClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Entity Detail Modal */}
      <EntityDetailModal
        entity={selectedEntity}
        isOpen={showEntityModal}
        onClose={() => {
          setShowEntityModal(false);
          setSelectedEntity(null);
        }}
        loading={entityDetailLoading}
      />

      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <button className="w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
          <span className="sr-only">Quick Actions</span>
          <div className="w-6 h-6 mx-auto">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SearchPage;