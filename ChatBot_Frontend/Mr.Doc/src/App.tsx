import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; 
import ChatPage from './pages/ChatPage';
import AuthModal from './components/AuthModal';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (token: string) => {
    setToken(token);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const handleAuthClick = (isLoginMode: boolean) => {
    setIsLogin(isLoginMode);
    setShowAuthModal(true);
  };

  const handlePageTransition = () => {
    // You can add additional actions here if needed
    console.log("Page transition to chat initiated.");
  };

  return (
    <Router>
      <div>
        {showAuthModal && (
          <AuthModal
            isLogin={isLogin}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setIsLogin(!isLogin)}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={<LandingPage onAuthClick={handleAuthClick} isAuthenticated={!!token} onPageTransition={handlePageTransition} />}
          />
          <Route
            path="/chat"
            element={token ? <ChatPage token={token} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
