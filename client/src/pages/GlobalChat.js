import React from 'react';
import ChatBox from '../components/chat/ChatBox';

const GlobalChat = () => {
  return (
    <div className="container">
      <h2 className="mb-4">Global Chat</h2>
      <div className="row">
        <div className="col-12">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;