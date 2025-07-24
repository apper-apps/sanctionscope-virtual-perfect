import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, loading, placeholder = "Enter entity name to search..." }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="pr-10"
        />
        <ApperIcon 
          name="Search" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading || !query.trim()}
        className="px-6"
      >
        {loading ? (
          <>
            <ApperIcon name="Loader2" className="mr-2 w-4 h-4 animate-spin" />
            Searching
          </>
        ) : (
          "Search"
        )}
      </Button>
    </form>
  );
};

export default SearchBar;