"use client";
import moment from "moment";
import { useEffect, useRef } from "react";

export const MessageContent = ({
  messages,
  currentUser,
  currentChat,
  deleteMessage,
}) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filterMessagesForChat = (messages, currentUser, currentChat) => {
    if (!currentChat || !currentUser) return [];
    return messages.filter((msg) => {
      const isCurrentUserSender = msg.sender === currentUser.email;
      const isCurrentUserRecipient = msg.recipient === currentUser.email;
      const otherUserEmail =
        currentChat.email === currentUser.email
          ? currentChat.reciverUserId?.email
          : currentChat.senderUserId?.email;

      return (
        (isCurrentUserSender && msg.recipient === otherUserEmail) ||
        (isCurrentUserRecipient && msg.sender === otherUserEmail)
      );
    });
  };
  return (
    <div
      className="flex-grow h-[540px] overflow-y-auto p-4 mb-10"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      <div ref={messagesEndRef} />
      {filterMessagesForChat(messages, currentUser, currentChat)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .map((msg, index) => (
          <div key={index}>
            {((msg.sender === currentUser?.email &&
              msg.recipient ===
                (currentChat?.email === currentUser.email
                  ? currentChat?.reciverUserId?.email
                  : currentChat?.senderUserId?.email)) ||
              (msg.recipient === currentUser?.email &&
                msg.sender ===
                  (currentChat?.email === currentUser.email
                    ? currentChat?.senderUserId?.email
                    : currentChat?.reciverUserId?.email))) && (
              <div
                key={msg._id || index}
                className={`mb-4 ${
                  msg.sender === currentUser?.email ? "text-right" : "text-left"
                }`}
              >
                <div className="relative group inline-block">
                  {msg.sender === currentUser?.email && (
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
                      title="Delete message"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 hover:text-red-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === currentUser?.email
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {console.log(msg)}
                    {msg.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {/* {new Date(msg.timestamp).toLocaleTimeString()} */}
                    {moment(msg?.timestamp).format("DD MMMM YYYY, h:mm A")}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
