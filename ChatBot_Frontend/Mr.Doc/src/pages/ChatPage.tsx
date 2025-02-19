import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, LogOut } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface ChatPageProps {
  onLogout: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Retrieve token from local storage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Stored Token:', storedToken); // Log token to verify

    if (storedToken) {
      setToken(storedToken);
      fetchChatHistory(storedToken);
    } else {
      // Handle case where there is no token (e.g., redirect to login)
      onLogout();
    }
  }, [onLogout]);

  const fetchChatHistory = async (storedToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const response = await fetch('https://aidocbackend.pythonanywhere.com/api/chat/prompts/', {
        headers: {
          'Authorization': `Token ${storedToken}`
        }
      });

      console.log('Fetch Chat History Response:', response);

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      console.log('Chat History Data:', data);

      const history: Message[] = [];

      data.forEach((item: any, index: number) => {
        history.push({
          id: index * 2 + 1,
          text: item.input_text,
          isUser: true
        });
        history.push({
          id: index * 2 + 2,
          text: item.response_text,
          isUser: false
        });
      });

      setMessages(history);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Only call onLogout if it's actually a token-related error
      if (error.message.includes('Failed to fetch chat history')) {
        onLogout(); 
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !token) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/prompts/get_gemini_response/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input_text: input })
      });

      console.log('Send Message Response:', response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Bot Response Data:', data);

      // Add bot response
      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response_text,
        isUser: false
      };

      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Only call onLogout if it's actually a token-related error
      if (error.message.includes('Network response was not ok')) {
        onLogout(); 
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-indigo-600" />
            <span className="ml-2 font-semibold text-gray-900">Chat Assistant</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.isUser
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white shadow-sm text-gray-900'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white shadow-sm text-gray-900">
              <Bot className="h-5 w-5 text-indigo-600 animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t">
        <div className="max-w-7xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
