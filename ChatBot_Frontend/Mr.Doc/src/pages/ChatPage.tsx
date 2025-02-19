import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, LogOut } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatPageProps {
  onLogout: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChatHistory = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        const response = await fetch('https://aidocbackend.pythonanywhere.com/api/chat/prompts/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chat history');
        }

        const data = await response.json();
        const history: Message[] = [];

        data.forEach((item: any, index: number) => {
          history.push({
            id: index * 2 + 1,
            text: item.input_text,
            isUser: true,
            timestamp: new Date(item.timestamp) // Assuming the timestamp is returned by the API
          });
          history.push({
            id: index * 2 + 2,
            text: item.response_text,
            isUser: false,
            timestamp: new Date(item.timestamp) // Assuming the timestamp is returned by the API
          });
        });

        setMessages(history);
        scrollToBottom();
      } catch (error) {
        console.error('Error:', error);
      }
      setIsLoading(false);
    };

    fetchChatHistory();
  }, [token]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('https://aidocbackend.pythonanywhere.com/api/chat/prompts/get_gemini_response/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input_text: input })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response_text,
        isUser: false,
        timestamp: new Date()
      };

      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'An error occurred. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Add a state variable to keep track of selected messages
const [selectedMessages, setSelectedMessages] = useState<number[]>([]);

// Function to handle message selection
const handleSelectMessage = (id: number) => {
  setSelectedMessages(prevSelected =>
    prevSelected.includes(id)
      ? prevSelected.filter(messageId => messageId !== id)
      : [...prevSelected, id]
  );
};

// Function to handle message deletion
const handleDeleteMessages = () => {
  setMessages(prevMessages =>
    prevMessages.filter(message => !selectedMessages.includes(message.id))
  );
  setSelectedMessages([]);
};

// Add checkboxes to messages and a delete button
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
      {messages.map((message, index) => (
        <div key={message.id}>
          {index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp) ? (
            <div className="text-gray-500 text-center mb-4">
              {formatDate(message.timestamp)}
            </div>
          ) : null}
          <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <input
              type="checkbox"
              checked={selectedMessages.includes(message.id)}
              onChange={() => handleSelectMessage(message.id)}
            />
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.isUser ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm text-gray-900'
              }`}
            >
              {message.text}
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(message.timestamp)}
              </div>
            </div>
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
        <button
          type="button"
          onClick={handleDeleteMessages}
          className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
          disabled={selectedMessages.length === 0}
        >
          Delete
        </button>
      </div>
    </form>
  </div>
);
};

export default ChatPage;
