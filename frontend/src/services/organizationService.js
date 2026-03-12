import api from './api';
import { mockOrganizations, mockUsers, delay, mockResponse, calculateDistance } from './mockData';

// Flag to use mock data (set to false when real API is ready)
const USE_MOCK_DATA = true;

export const organizationService = {
  // Get all organizations with location
  getAllOrganizations: async (latitude, longitude, radius = 50) => {
    if (USE_MOCK_DATA) {
      await delay(800); // Simulate network delay
      console.log('Using mock data for organizations');
      
      let filteredOrgs = [...mockOrganizations];
      
      // If user location is available, calculate distances
      if (latitude && longitude) {
        filteredOrgs = filteredOrgs.map(org => {
          // Calculate distance from user to organization
          const distance = parseFloat(calculateDistance(
            latitude, 
            longitude, 
            org.latitude, 
            org.longitude
          ));
          
          return {
            ...org,
            distance: distance,
            distanceText: `${distance} km away`
          };
        })
        .filter(org => org.distance <= radius) // Filter by radius
        .sort((a, b) => a.distance - b.distance); // Sort by nearest first
      } else {
        // If no location, return all orgs with random distances for demo
        filteredOrgs = filteredOrgs.map(org => ({
          ...org,
          distance: (Math.random() * 30 + 5).toFixed(1),
          distanceText: 'distance unknown'
        }));
      }
      
      return mockResponse(filteredOrgs);
    }

    try {
      const response = await api.get('/organizations', {
        params: { 
          ...(latitude && { latitude }),
          ...(longitude && { longitude }),
          radius 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // Search organizations
  searchOrganizations: async (searchTerm, latitude, longitude) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      console.log('Using mock data for search');
      
      const term = searchTerm.toLowerCase();
      let filtered = mockOrganizations.filter(org => 
        org.organizationName.toLowerCase().includes(term) ||
        org.founderName.toLowerCase().includes(term) ||
        org.address.toLowerCase().includes(term) ||
        org.city.toLowerCase().includes(term) ||
        org.state.toLowerCase().includes(term)
      );
      
      // Add distances if location available
      if (latitude && longitude) {
        filtered = filtered.map(org => ({
          ...org,
          distance: parseFloat(calculateDistance(latitude, longitude, org.latitude, org.longitude)),
          distanceText: `${calculateDistance(latitude, longitude, org.latitude, org.longitude)} km away`
        })).sort((a, b) => a.distance - b.distance);
      }
      
      return mockResponse(filtered);
    }

    try {
      const response = await api.get('/organizations/search', {
        params: { 
          q: searchTerm,
          ...(latitude && { latitude }),
          ...(longitude && { longitude })
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching organizations:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // Get single organization by slug
  getOrganizationBySlug: async (slug) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      console.log('Using mock data for single organization');
      
      const organization = mockOrganizations.find(org => org.slug === slug);
      
      if (!organization) {
        throw mockError('Organization not found', 404);
      }
      
      return mockResponse(organization);
    }

    try {
      const response = await api.get(`/organizations/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // User login
  login: async (email, password) => {
    if (USE_MOCK_DATA) {
      await delay(800);
      console.log('Using mock data for login');
      
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw mockError('Invalid email or password', 401);
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      return mockResponse({
        user: userWithoutPassword,
        token: 'mock-jwt-token-' + Date.now()
      });
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // User signup
  signup: async (userData) => {
    if (USE_MOCK_DATA) {
      await delay(1000);
      console.log('Using mock data for signup');
      
      const existingUser = mockUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        throw mockError('User with this email already exists', 409);
      }
      
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        isEmailVerified: false,
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.fullName}&background=random`
      };
      
      mockUsers.push(newUser);
      
      const { password, ...userWithoutPassword } = newUser;
      
      return mockResponse({
        user: userWithoutPassword,
        message: 'User created successfully. Please verify your email.'
      });
    }

    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Toggle mock data
  toggleMockData: (useMock) => {
    USE_MOCK_DATA = useMock;
  }
};