import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar, FaRegStar, FaShare } from 'react-icons/fa';

const OrganizationCard = ({ organization }) => {
  const {
    organizationName,
    founderName,
    slug,
    email,
    pics,
    city,        // Add this
    state, 
    logo,
    contactNumber,
    address,
    distance,
    rating = 4.5 // Mock rating for demo
  } = organization;

  // Generate random rating stars for demo
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <FaRegStar className="text-yellow-400 w-4 h-4" />
            <FaStar className="absolute top-0 left-0 text-yellow-400 w-4 h-4" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 w-4 h-4" />);
      }
    }
    return stars;
  };

  return (
    <Link to={`/organization/${slug}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {pics && pics.length > 0 ? (
            <img 
              src={pics[0]} 
              alt={organizationName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 font-medium">No image available</span>
            </div>
          )}
          
          {/* Logo Overlay */}
          {logo && (
            <div className="absolute -bottom-6 left-4 w-16 h-16 rounded-xl border-4 border-white overflow-hidden bg-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <img 
                src={logo} 
                alt={`${organizationName} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Distance Badge */}
{distance && (
  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
    <span className="flex items-center space-x-1">
      <span>📍</span>
      <span>{distance} km</span>
    </span>
  </div>
)}
<div className="mt-2 text-sm text-gray-500">
  {city}, {state}
</div>
          {/* Share Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              // Share functionality
            }}
            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-blue-600 transition-colors shadow-md"
          >
            <FaShare className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5 pt-10">
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            {renderStars()}
            <span className="text-sm text-gray-600 ml-2">({rating})</span>
          </div>

          {/* Title and Founder */}
          <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {organizationName}
          </h3>
          <p className="text-gray-600 text-sm mb-3">Founded by {founderName}</p>
          
          {/* Details */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="text-red-500 flex-shrink-0 mt-1 w-4 h-4" />
              <span className="text-gray-600 line-clamp-2">{address}</span>
            </div>
            
            {contactNumber && contactNumber.length > 0 && (
              <div className="flex items-center space-x-2">
                <FaPhone className="text-green-500 flex-shrink-0 w-4 h-4" />
                <span className="text-gray-600">{contactNumber[0]}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-blue-500 flex-shrink-0 w-4 h-4" />
              <span className="text-gray-600 truncate">{email}</span>
            </div>
          </div>
          
          {/* View Details Button */}
          <div className="mt-4">
            <span className="inline-block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrganizationCard;