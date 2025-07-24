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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SanctionScope</h1>
              <p className="text-sm text-gray-600">AML Compliance Screening</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <SearchPanel
              onSearch={handleSearch}
              loading={loading}
              apiStatus={apiStatus}
              recentSearches={recentSearches}
              onRecentSearchClick={handleRecentSearchClick}
            />
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
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

      {/* Entity Detail Modal */}
      <EntityDetailModal
        entity={selectedEntity}
        isOpen={showEntityModal}
        onClose={() => {
          setShowEntityModal(false);
          setSelectedEntity(null);
        }}
        loading={entityDetailLoading}
      />
    </div>
  );
};

export default SearchPage;