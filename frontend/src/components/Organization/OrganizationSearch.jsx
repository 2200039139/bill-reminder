import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const OrganizationSearch = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search organizations by name, founder, or location..."
          className="w-full px-6 py-4 pr-24 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 bg-white placeholder-gray-500"
          style={{ color: '#1f2937' }} // Explicit dark gray color
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <FaSearch />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
};

export default OrganizationSearch;