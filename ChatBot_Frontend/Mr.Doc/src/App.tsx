import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bot, MessageSquare, Users, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import AuthModal from './components/AuthModal';
import LoadingSpinner from './components/LoadingSpinner';
import SuccessPopup from './components/SuccessPopup';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  useEffect(() => {
    // Initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = (token: string) => {
    setToken(token);
    setShowAuthModal(false);
    setIsAuthenticated(true);
  };
  
  const handleSignupSuccess = () => {
    setShowAuthModal(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3200);
  };
  

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  const handleAuthClick = (isLoginMode: boolean) => {
    setIsLogin(isLoginMode);
    setShowAuthModal(true);
  };

  const handlePageTransition = () => {
    setIsPageTransition(true);
    setTimeout(() => {
      setIsPageTransition(false);
    }, 2000);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative">
        {isPageTransition && <LoadingSpinner />}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <AuthModal
              isLogin={isLogin}
              onClose={() => setShowAuthModal(false)}
               onSuccess={isLogin ? handleLogin : handleSignupSuccess}
              onToggleMode={() => setIsLogin(!isLogin)}
            />
          </div>
        )}
        {showSuccessPopup && (
          <SuccessPopup
            message="Sign up successful! Please login to continue."
            onClose={() => setShowSuccessPopup(false)}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={<LandingPage onAuthClick={handleAuthClick} isAuthenticated={isAuthenticated} onPageTransition={handlePageTransition} />}
          />
          <Route
            path="/chat"
            element={isAuthenticated && token ? <ChatPage token={token} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
