import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';

const ChatBox = ({ country }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  
  // Determine if this is a country-specific or global chat
  const isGlobal = !country;
  const roomType = isGlobal ? 'global' : 'country';
  const roomId = isGlobal ? 'global' : country;
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io();
    setSocket(newSocket);
    
    // Join the appropriate room
    if (isGlobal) {
      newSocket.emit('joinGlobalRoom');
    } else {
      newSocket.emit('joinCountryRoom', country);
    }
    
    // Load existing messages
    const fetchMessages = async () => {
      try {
        const endpoint = isGlobal ? '/api/chats/global' : `/api/chats/country/${country}`;
        const res = await axios.get(endpoint);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    
    fetchMessages();
    
    // Listen for new messages
    newSocket.on(roomType + 'Message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    // Clean up on unmount
    return () => {
      if (isGlobal) {
        newSocket.emit('leaveGlobalRoom');
      } else {
        newSocket.emit('leaveCountryRoom', country);
      }
      newSocket.disconnect();
    };
  }, [country, isGlobal, roomType]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const messageData = {
        message: newMessage,
        country: isGlobal ? null : country
      };
      
      // Send to server via API
      const res = await axios.post('/api/chats', messageData);
      
      // Emit to socket
      if (isGlobal) {
        socket.emit('globalMessage', res.data);
      } else {
        socket.emit('countryMessage', res.data);
      }
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };
  
  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="card-title m-0">
          {isGlobal ? 'Global Chat' : `${country} Chat`}
        </h5>
      </div>
      <div className="card-body">
        <div 
          className="chat-messages p-3 mb-3" 
          style={{ 
            height: '400px', 
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`message mb-2 p-2 rounded ${
                msg.user_email === user?.email ? 'bg-light text-end' : 'bg-primary-subtle'
              }`}
            >
              <div className="message-header mb-1">
                <strong>{msg.user_email}</strong> <small>{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
              <div className="message-body">{msg.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={sendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;