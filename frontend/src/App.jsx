import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
// import HomePage from './pages/HomePage';
// import OrganizationPage from './pages/OrganizationPage';
import AboutPage from './pages/AboutPage';
import LoginModal from './components/Auth/LoginModal';
import SignupModal from './components/Auth/SignupModal';
import OrganizationPage from './pages/Organizationpage';
import HomePage from './pages/HomePages';
function AppContent() {
  const { 
    showLoginModal, 
    setShowLoginModal, 
    showSignupModal, 
    setShowSignupModal 
  } = useAuth();

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/organization/:slug" element={<OrganizationPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;