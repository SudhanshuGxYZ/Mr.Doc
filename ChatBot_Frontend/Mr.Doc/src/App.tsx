import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bot, MessageSquare } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import AuthModal from './components/AuthModal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleShowAuth = (isLoginMode: boolean) => {
    setIsLogin(isLoginMode);
    setShowAuthModal(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                onAuthClick={handleShowAuth}
                isAuthenticated={isAuthenticated}
              />
            } 
          />
          <Route 
            path="/chat" 
            element={
              isAuthenticated ? 
                <ChatPage /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>

        {showAuthModal && (
          <AuthModal
            isLogin={isLogin}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleLogin}
            onToggleMode={() => setIsLogin(!isLogin)}
          />
        )}
      </div>
    </Router>
  );
}

export default App