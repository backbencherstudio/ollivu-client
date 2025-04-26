'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { socket } from '@/src/utils/socket';
import { verifiedUser } from '@/src/utils/token-varify';

interface Message {
  _id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface MessageAreaProps {
  selectedUser: any;
}

export default function MessageArea({ selectedUser }: MessageAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = verifiedUser();

  useEffect(() => {
    if (selectedUser && currentUser) {
      // Fetch existing messages
      socket.emit('getMessages', {
        senderId: currentUser.userId,
        receiverId: selectedUser._id
      });

      // Listen for messages
      socket.on('messages', (messageHistory) => {
        setMessages(messageHistory);
      });

      // Listen for new messages
      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }

    return () => {
      socket.off('messages');
      socket.off('receiveMessage');
    };
  }, [selectedUser, currentUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser && currentUser) {
      const messageData = {
        senderId: currentUser.userId,
        receiverId: selectedUser._id,
        content: newMessage
      };
      console.log(messageData);
      

      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[80vh]">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full relative overflow-hidden">
          {selectedUser.profileImage ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedUser.profileImage}`}
              alt="Profile"
              height={40}
              width={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white">
              {selectedUser.first_name?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium">{selectedUser.first_name}</h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === currentUser?.userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === currentUser?.userId
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}