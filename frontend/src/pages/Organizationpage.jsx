import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationService } from '../services/organizationService';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/Auth/LoginModal';
import SignupModal from '../components/Auth/SignupModal';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaImage, FaArrowLeft, FaHandshake, FaSpinner } from 'react-icons/fa';

const OrganizationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, setShowLoginModal, setShowSignupModal } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLoginModal, setShowLoginModalLocal] = useState(false);
  const [showSignupModal, setShowSignupModalLocal] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchOrganizationDetails();
  }, [slug]);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationService.getOrganizationBySlug(slug);
      const orgData = response.data || response;
      setOrganization(orgData);
    } catch (err) {
      console.error('Error fetching organization details:', err);
      setError(err.message || 'Failed to fetch organization details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (user) {
      // User is already logged in, proceed with registration
      registerForOrganization();
    } else {
      // Show login modal first
      setShowLoginModalLocal(true);
    }
  };

  const registerForOrganization = async () => {
    setRegistering(true);
    try {
      // API call to register user for this organization
      await organizationService.registerForOrganization(slug, user.id);
      alert(`Successfully registered for ${organization.organizationName}!`);
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModalLocal(false);
    // After login, proceed with registration
    setTimeout(() => {
      registerForOrganization();
    }, 500);
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
    address,
    city,
    state,
    pincode
  } = organization;

  const imagesArray = Array.isArray(pics) ? pics : [];
  const contactsArray = Array.isArray(contactNumber) ? contactNumber : [];

  return (
    <>
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
            <p className="text-xl text-gray-600 mb-4">Founded by {founderName}</p>
            
            {/* Location */}
            {(city || state) && (
              <p className="text-gray-500 mb-4">
                📍 {city && state ? `${city}, ${state}` : city || state}
                {pincode && ` - ${pincode}`}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              </div>
            </div>

            {/* Registration Section */}
            <div className="border-t pt-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Join {organizationName}
                </h3>
                <p className="text-gray-600 mb-4">
                  Register to become a member of this organization and get access to:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                  <li>Member-only events and updates</li>
                  <li>Direct communication with the team</li>
                  <li>Volunteer opportunities</li>
                  <li>Community discussions</li>
                </ul>
                
                <button
                  onClick={handleRegisterClick}
                  disabled={registering}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {registering ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <FaHandshake />
                      <span>{user ? 'Register Now' : 'Login / Signup to Register'}</span>
                    </>
                  )}
                </button>
                
                {!user && (
                  <p className="text-sm text-gray-500 mt-3">
                    You'll need to login or create an account to register for this organization.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModalLocal(false)}
        onSuccess={handleLoginSuccess}
        organizationName={organization?.organizationName}
      />

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModalLocal(false)}
        onSuccess={() => {
          setShowSignupModalLocal(false);
          // After signup, proceed with registration
          setTimeout(() => {
            registerForOrganization();
          }, 500);
        }}
        organizationName={organization?.organizationName}
      />
    </>
  );
};

export default OrganizationPage;