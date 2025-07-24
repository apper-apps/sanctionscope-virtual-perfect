import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import SearchPage from "@/components/pages/SearchPage";
import { useApiStatus } from "@/hooks/useApiStatus";
import ApperIcon from "@/components/ApperIcon";

const AppLoader = ({ status, onContinue }) => {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (!status.isConnected && status.lastChecked) {
      // Show continue button after 5 seconds if API is not connected
      const timer = setTimeout(() => setShowContinue(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [status.isConnected, status.lastChecked]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">SanctionScope</h1>
          <p className="text-gray-600 mb-8">AML Compliance Screening</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-xl">
              {status.isConnected ? (
                <>
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-success-600" />
                  <span className="font-medium text-success-700">API Connected</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Loader2" className="w-5 h-5 text-primary-600 animate-spin" />
                  <span className="font-medium text-gray-700">Testing API Connection...</span>
                </>
              )}
            </div>
            
            {status.errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-danger-50 rounded-lg text-danger-700 text-sm">
                <ApperIcon name="AlertTriangle" className="w-4 h-4" />
                {status.errorMessage}
              </div>
            )}
            
            {status.responseTime && (
              <p className="text-sm text-gray-500">Response time: {status.responseTime}ms</p>
            )}
          </div>
          
          {(status.isConnected || showContinue) && (
            <button
              onClick={onContinue}
              className="mt-6 w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium py-3 px-6 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {status.isConnected ? "Continue to Application" : "Continue Anyway"}
            </button>
          )}
          
          {!status.isConnected && !showContinue && (
            <p className="mt-4 text-xs text-gray-500">
              Verifying API connectivity for optimal experience...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [appReady, setAppReady] = useState(false);
  const { status } = useApiStatus();

  useEffect(() => {
    if (status.isConnected) {
      toast.success("API connection established successfully!");
    } else if (status.lastChecked && status.errorMessage) {
      toast.warning("API connection failed - some features may be limited");
    }
  }, [status.isConnected, status.lastChecked, status.errorMessage]);

  const handleContinue = () => {
    setAppReady(true);
  };

  if (!appReady) {
    return <AppLoader status={status} onContinue={handleContinue} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SearchPage />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;