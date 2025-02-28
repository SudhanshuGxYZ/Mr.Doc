import React from 'react';
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

  React.useEffect(() => {
    if (isAuthenticated) {
      onPageTransition();
      navigate('/chat');
    }
  }, [isAuthenticated, navigate, onPageTransition]);
  const handleStartChat = () => {
    onAuthClick(true);
  };

  return (
    // <div className="min-h-screen flex flex-col">
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-gray-500">
      <nav className="bg-white shadow-sm animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center animate-fade-in-left">
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Mr.Doc</span>
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
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Meet Mr.Doc, Your Personal Medical Assistant !
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
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
          </div>
        </div>
        <div className="mt-12 text-center animate-fade-in-up animate-delay-500">
          <button
            onClick={handleStartChat}
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 transform"
          >
            Let's Start Chatting
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </main>

      <footer className="bg-white mt-auto animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in-left">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Mr.Doc</span>
              </div>
              <p className="mt-4 text-gray-600">
                Your trusted AI health assistant, available 24/7 to provide guidance and information.
              </p>
            </div>
            <div className="animate-fade-in-up animate-delay-100">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Important Links</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900 transition-colors">
                    Medical Disclaimer
                  </a>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-right">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900 transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900 transition-colors">
                    Emergency Contacts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900 transition-colors">
                    Find a Doctor
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center animate-fade-in-up animate-delay-200">
            <p className="text-base text-gray-400">
              &copy; 2025 Mr.Doc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 transform">
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);

export default LandingPage;
