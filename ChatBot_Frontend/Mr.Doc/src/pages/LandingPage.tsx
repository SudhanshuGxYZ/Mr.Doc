import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Users, Shield } from 'lucide-react';

interface LandingPageProps {
  onAuthClick: (isLogin: boolean) => void;
  isAuthenticated: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthClick, isAuthenticated }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI Chat Assistant</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => onAuthClick(true)}
                className="px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onAuthClick(false)}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Your Personal AI Chat Assistant
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-driven conversations. Get instant responses, 
            smart suggestions, and helpful insights tailored just for you.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-indigo-600" />}
            title="Natural Conversations"
            description="Chat naturally with our AI that understands context and provides relevant responses."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-indigo-600" />}
            title="Secure & Private"
            description="Your conversations are encrypted and private, ensuring your data stays safe."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-indigo-600" />}
            title="24/7 Availability"
            description="Get assistance anytime, anywhere. Our AI is always ready to help."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);

export default LandingPage;