import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Users, Shield, ArrowRight, AlertTriangle } from 'lucide-react';

interface LandingPageProps {
  onAuthClick: (isLogin: boolean) => void;
  isAuthenticated: boolean;
  onPageTransition: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onAuthClick, 
  isAuthenticated,
  onPageTransition 
}) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (isAuthenticated) {
      onPageTransition();
      navigate('/chat');
    }
  }, [isAuthenticated, navigate, onPageTransition]);

  const handleStartChat = () => {
    onAuthClick(true);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <nav className="shadow-sm animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center animate-fade-in-left" onClick={toggleTheme}>
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">Mr.Doc</span>
            </div>
            <div className="flex space-x-4 animate-fade-in-right">
{/*               <button
                onClick={() => onAuthClick(true)}
                className="px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Login
              </button> */}
              <button
                onClick={() => onAuthClick(false)}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                 Register 
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold sm:text-6xl">
            Meet Mr.Doc, Your Personal Medical Assistant !
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Experience the power of AI-driven conversations with Mr.Doc. Get instant responses, 
            smart suggestions, and helpful insights tailored just for you.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="animate-fade-in-up animate-delay-100">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-indigo-600" />}
              title="Natural Conversations"
              description="Chat naturally with Mr.Doc who understands context and provides relevant responses."
            />
          </div>
          <div className="animate-fade-in-up animate-delay-200">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-indigo-600" />}
              title="Secure & Private"
              description="Your conversations are encrypted and private, ensuring your data stays safe."
            />
          </div>
          <div className="animate-fade-in-up animate-delay-300">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-indigo-600" />}
              title="24/7 Availability"
              description="Get assistance anytime, anywhere. Mr.Doc is always ready to help."
            />
          </div>
        </div>

        <div className="mt-20 bg-yellow-50 border border-yellow-200 rounded-lg p-6 animate-fade-in-up animate-delay-400">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Important Notice</h3>
              <div className="mt-2 text-yellow-700 space-y-2">
                <p>Mr.Doc is not a replacement for professional medical consultation it is just to help out from certain situations. Please note:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Mr.Doc is designed to assist and provide general information with approximately 90% accuracy</li>
                  <li>Always consult with healthcare professionals for medical advice</li>
                  <li>Verify critical information with qualified medical practitioners</li>
                  <li>In case of emergency, contact emergency services immediately</li>
                </ul>
              </div>
            </div>
          </
