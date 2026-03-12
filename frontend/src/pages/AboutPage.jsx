import React from 'react';

const AboutPage = () => {
  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
      <div className="prose max-w-3xl">
        <p className="text-lg text-gray-600 mb-4">
          Welcome to OrgFinder, your premier destination for discovering local organizations in your area.
        </p>
        <p className="text-gray-600 mb-4">
          Our mission is to connect people with organizations that matter to them, whether it's for business, 
          community service, or personal interests. We believe in the power of local communities and strive 
          to make it easier for you to find and connect with organizations near you.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Features</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Location-based organization discovery</li>
          <li>Comprehensive organization profiles with images and contact information</li>
          <li>Powerful search functionality</li>
          <li>User accounts for personalized experience</li>
          <li>Mobile-responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;