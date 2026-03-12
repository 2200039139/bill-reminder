import React from 'react';
import OrganizationCard from './OrganizationCard';

const OrganizationList = ({ organizations, loading, error }) => {
  // Ensure organizations is always an array
  const orgsArray = Array.isArray(organizations) ? organizations : [];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orgsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No organizations found in your area.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orgsArray.map((org) => (
        <OrganizationCard key={org.slug || org.id || Math.random()} organization={org} />
      ))}
    </div>
  );
};

export default OrganizationList;