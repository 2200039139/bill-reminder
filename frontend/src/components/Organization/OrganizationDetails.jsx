import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationService } from '../../services/organizationService';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaImage, FaArrowLeft } from 'react-icons/fa';

const OrganizationDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchOrganizationDetails();
  }, [slug]);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationService.getOrganizationBySlug(slug);
      
      // Handle both mock and real API response structures
      const orgData = response.data || response;
      setOrganization(orgData);
    } catch (err) {
      console.error('Error fetching organization details:', err);
      setError(err.message || 'Failed to fetch organization details');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Organization not found'}</p>
          <button 
            onClick={handleGoBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto space-x-2"
          >
            <FaArrowLeft />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  const {
    organizationName,
    founderName,
    email,
    pics,
    logo,
    contactNumber,
    address
  } = organization;

  // Ensure arrays exist
  const imagesArray = Array.isArray(pics) ? pics : [];
  const contactsArray = Array.isArray(contactNumber) ? contactNumber : [];

  return (
    <div className="container-custom py-8">
      <button 
        onClick={handleGoBack}
        className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
      >
        <FaArrowLeft />
        <span>Back to listings</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-96 bg-gray-100">
          {imagesArray.length > 0 ? (
            <img 
              src={imagesArray[selectedImage]} 
              alt={organizationName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaImage className="text-6xl text-gray-400" />
            </div>
          )}
          
          {logo && (
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              <img 
                src={logo} 
                alt={`${organizationName} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {imagesArray.length > 1 && (
          <div className="flex space-x-2 p-4 overflow-x-auto">
            {imagesArray.map((pic, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-blue-600' : 'border-transparent'
                }`}
              >
                <img src={pic} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Organization Details */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{organizationName}</h1>
          <p className="text-xl text-gray-600 mb-6">Founded by {founderName}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <FaEnvelope className="text-blue-500" />
                <a href={`mailto:${email}`} className="hover:text-blue-600">
                  {email}
                </a>
              </div>

              {contactsArray.length > 0 && (
                <div className="space-y-2">
                  {contactsArray.map((number, index) => (
                    <div key={index} className="flex items-center space-x-3 text-gray-600">
                      <FaPhone className="text-green-500" />
                      <a href={`tel:${number}`} className="hover:text-blue-600">
                        {number}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start space-x-3 text-gray-600">
                <FaMapMarkerAlt className="text-red-500 mt-1" />
                <span>{address}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Additional Information</h2>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <FaUser className="text-purple-500" />
                <span>Founder: {founderName}</span>
              </div>

              {organization.distance && (
                <p className="text-gray-600">
                  Distance: {organization.distance} miles away
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;