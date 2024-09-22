'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

type Message = {
  text: string;
  fromSelf: boolean;
};

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    socket.on('connect', () => {
      setUserId(socket.id as any);
    });

    socket.on('message', (msg: { text: string; senderId: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg.text, fromSelf: msg.senderId === userId },
      ]);
    });

    return () => {
      socket.off('message');
    };
  }, [userId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { text: message, senderId: socket.id });
      setMessage(''); 
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Chat Room</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'auto',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.fromSelf ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.fromSelf ? '#DCF8C6' : '#E5E5EA',
                marginBottom: '5px',
                color: msg.fromSelf ? '#000' : '#000',
                wordWrap: 'break-word',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '100%', padding: '10px' }}
        />
        <button type="submit" style={{ marginTop: '10px', padding: '10px', width: '100%' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;