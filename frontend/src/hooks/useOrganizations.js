import { useState, useEffect } from 'react';
import { organizationService } from '../services/organizationService';

export const useOrganizations = (latitude, longitude) => {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (latitude !== null || longitude !== null) {
      fetchOrganizations();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrganizations(organizations);
    } else {
      const filtered = organizations.filter(org =>
        org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.founderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    }
  }, [searchTerm, organizations]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationService.getAllOrganizations(latitude, longitude);
      
      // Handle both mock and real API response structures
      const orgsData = response.data || response;
      setOrganizations(Array.isArray(orgsData) ? orgsData : []);
      setFilteredOrganizations(Array.isArray(orgsData) ? orgsData : []);
    } catch (err) {
      console.error('Error in fetchOrganizations:', err);
      setError(err.message || 'Failed to fetch organizations');
      // Set empty array on error to prevent map errors
      setOrganizations([]);
      setFilteredOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const searchOrganizations = async (term) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredOrganizations(organizations);
    } else {
      try {
        setLoading(true);
        const response = await organizationService.searchOrganizations(term, latitude, longitude);
        const searchResults = response.data || response;
        setFilteredOrganizations(Array.isArray(searchResults) ? searchResults : []);
      } catch (err) {
        console.error('Search error:', err);
        // Fallback to client-side filtering if search API fails
        const filtered = organizations.filter(org =>
          org.organizationName.toLowerCase().includes(term.toLowerCase()) ||
          org.founderName.toLowerCase().includes(term.toLowerCase()) ||
          org.address.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredOrganizations(filtered);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    organizations: filteredOrganizations,
    allOrganizations: organizations,
    loading,
    error,
    searchTerm,
    searchOrganizations,
    refreshOrganizations: fetchOrganizations
  };
};