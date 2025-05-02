"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import moment from "moment";
import { MessageList } from "./_components/MessageList";
import { MessageInput } from "./_components/MessageInput";
import { verifiedUser } from "@/src/utils/token-varify";
import { authApi } from "@/src/redux/features/auth/authApi";
import { MessageContent } from "./_components/MessageContent";
import ConfirmServiceModal from "./_components/confirm-service-modal";
import { toast } from "sonner";
import { useAcceptExchangeMutation } from "@/src/redux/features/shared/exchangeApi";
const socket = io("http://localhost:5000");

const Messages = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [user, setUser] = useState(null); // Updated to null initially
  const currentUser = verifiedUser();
  const [recipient, setRecipient] = useState(currentUser?.email);
  const [finalQuery, setFinalQuery] = useState({
    userId: currentUser?.userId,
    isAccepted: true,
  });

  const getOtherUserEmail = (chat) => {
    return chat?.email === currentUser?.email
      ? chat?.reciverUserId?.email
      : chat?.senderUserId?.email;
  };

  const getOtherUserName = (chat) => {
    return chat?.email === currentUser?.email
      ? chat?.reciverUserId?.first_name
      : chat?.senderUserId?.first_name;
  };

  const { data: userList } = authApi.useGetAllExchangeDataQuery(finalQuery);
  const [acceptExchange] = useAcceptExchangeMutation();
  const users = userList?.data;

  // console.log("currentChat", currentChat);

  const [unreadMessages, setUnreadMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("unreadMessages");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [lastMessages, setLastMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lastMessages");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [onlineUsers, setOnlineUsers] = useState({});

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    // Fetch user data on the client side
    const userData = verifiedUser();
    setUser(userData);
  }, []);

  // Fetch message history when component mounts or recipient changes
  useEffect(() => {
    if (recipient && currentUser?.email) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chats?email=${currentUser?.email}&recipient=${recipient}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
          const lastMessagesMap = {};
          data.forEach((msg) => {
            const otherUser =
              msg.sender === currentUser?.email ? msg.recipient : msg.sender;
            if (
              !lastMessagesMap[otherUser] ||
              new Date(msg.timestamp) >
                new Date(lastMessagesMap[otherUser].timestamp)
            ) {
              lastMessagesMap[otherUser] = {
                content: msg.content,
                timestamp: msg.timestamp,
              };
            }
          });
          setLastMessages(lastMessagesMap);
        })
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, []);

  useEffect(() => {
    socket.emit("join", currentUser?.email);

    socket.on("connect", () => {
      socket.emit("user_online", currentUser?.email);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user_connected", (email) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [email]: true,
      }));
    });

    socket.on("user_disconnected", (email) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [email]: false,
      }));
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      // Only update unread count for incoming messages not from current chat
      if (
        message.recipient === currentUser?.email &&
        message.sender !== currentUser?.email &&
        (!currentChat || message.sender !== currentChat.email)
      ) {
        setUnreadMessages((prev) => {
          const newUnreadMessages = {
            ...prev,
            [message.sender]: (prev[message.sender] || 0) + 1,
          };
          localStorage.setItem(
            "unreadMessages",
            JSON.stringify(newUnreadMessages)
          );
          return newUnreadMessages;
        });
      }

      // Update last messages
      const otherUser =
        message.sender === currentUser?.email
          ? message.recipient
          : message.sender;
      setLastMessages((prev) => {
        const newLastMessages = {
          ...prev,
          [otherUser]: {
            content: message.content,
            timestamp: message.timestamp,
          },
        };
        localStorage.setItem("lastMessages", JSON.stringify(newLastMessages));
        return newLastMessages;
      });
    });

    socket.on("message history", (history) => {
      setMessages(history);
    });

    socket.on("user list", (userList) => {
      // console.log("User list updated:", userList);
    });

    // Fetch initial unread messages when component mounts
    const fetchInitialUnreadMessages = async () => {
      try {
        // Get unread messages count directly from the server
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/unread/${currentUser?.email}`
        );
        const unreadCounts = await response.json();
        // console.log("Initial unread counts:", unreadCounts); // Debug log
        // Update unread messages state and localStorage
        setUnreadMessages(unreadCounts);
        localStorage.setItem("unreadMessages", JSON.stringify(unreadCounts));
      } catch (error) {
        console.error("Error fetching initial unread messages:", error);
      }
    };

    if (currentUser?.email) {
      fetchInitialUnreadMessages();
    }

    return () => {
      socket.emit("user_offline", currentUser?.email);
      socket.off("online_users");
      socket.off("user_connected");
      socket.off("user_disconnected");
      socket.off("message");
      socket.off("message history");
      socket.off("user list");
    };
  }, [currentUser?.email]);
  const sendMessage = (e) => {
    e.preventDefault();
    if (message && currentChat) {
      const messageData = {
        content: message,
        recipient: getOtherUserEmail(currentChat),
        sender: currentUser?.email,
        timestamp: new Date().toISOString(),
        read: false,
      };
      socket.emit("message", messageData);
      setMessage("");
    }
  };
  const handleChatSelect = async (user) => {
    setCurrentChat(user);
    try {
      // Fetch messages for the selected chat
      const messagesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chats?email=${
          currentUser?.email
        }&recipient=${getOtherUserEmail(user)}`
      );
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);

      // Mark messages as read in the backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/mark-read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: user.email,
            recipient: currentUser?.email,
          }),
        }
      );

      if (response.ok) {
        // Update local messages state
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.sender === user.email && msg.recipient === currentUser?.email
              ? { ...msg, read: true }
              : msg
          )
        );

        // Clear unread count for this user
        setUnreadMessages((prev) => {
          const newUnreadMessages = { ...prev };
          delete newUnreadMessages[user.email];
          localStorage.setItem(
            "unreadMessages",
            JSON.stringify(newUnreadMessages)
          );
          return newUnreadMessages;
        });
      }
    } catch (error) {
      console.error("Error handling chat selection:", error);
    }
  };

  const deleteMessage = (messageId) => {
    socket.emit("delete_message", messageId);
  };

  useEffect(() => {
    socket.on("message_deleted", (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    });

    return () => {
      socket.off("message_deleted");
    };
  }, []);

  const modalHandler = async (currentChat) => {
    if (currentChat?.senderUserId?.email === currentUser?.email) {
      const result = await acceptExchange({
        userId: currentUser?.userId,
        exchangeId: currentChat?._id,
      });
      return console.log(result); // show confirmation alart
    }
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content */}
      <div className="bg-white rounded-lg h-full hidden md:grid md:grid-cols-4 shadow-sm">
        {/* Left Sidebar */}
        <div className="col-span-1 border-r border-gray-100">
          <div className="h-full flex flex-col">
            <MessageList
              onChatSelect={handleChatSelect}
              userData={userList?.data?.map((user) => ({
                ...user,
                hasUnread: Boolean(unreadMessages[user.email]),
                lastMessage: lastMessages[user.email],
                isOnline: onlineUsers[user.email] || false,
                unreadCount: unreadMessages[user.email] || 0,
              }))}
              currentUser={currentUser?.email}
              userId={currentUser?.userId}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-2 flex flex-col bg-white relative">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              {currentChat?.profileImage ? (
                <img
                  src={`${currentChat?.profileImage}`}
                  alt={currentChat?.name?.slice(0, 2).toUpperCase()}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">
                    {currentChat?.name?.slice(0, 2).toUpperCase()}
                    {currentChat?.email === currentUser.email
                      ? currentChat?.reciverUserId?.first_name
                          .slice(0, 2)
                          .toUpperCase()
                      : currentChat?.senderUserId?.first_name
                          .slice(0, 2)
                          .toUpperCase() || "UN"}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold">
                  {getOtherUserName(currentChat) || "Select a chat"}
                </h3>
                <span
                  className={`text-sm ${
                    onlineUsers[getOtherUserEmail(currentChat)]
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {onlineUsers[getOtherUserEmail(currentChat)]
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>
          </div>
          {currentChat ? (
            <>
              <MessageContent
                messages={messages}
                currentUser={currentUser}
                currentChat={currentChat}
                deleteMessage={deleteMessage}
              />
              <MessageInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 p-5 border-l border-gray-100">
          <div className="h-full flex flex-col">
            <h3 className="text-gray-500">Details</h3>
            <div className="bg-gray-100 p-6 rounded-lg mt-5 text-center flex items-center gap-3 justify-center flex-col">
              <div className="w-20 h-20 rounded-full bg-[#20b894] flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {currentChat?.email === currentUser.email
                    ? currentChat?.reciverUserId?.first_name
                        .slice(0, 2)
                        .toUpperCase()
                    : currentChat?.senderUserId?.first_name
                        .slice(0, 2)
                        .toUpperCase() || "UN"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-[18px]">
                  {getOtherUserName(currentChat)}
                </h3>
                <p className="text-gray-500">
                  {getOtherUserEmail(currentChat)}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-6 w-full">
                <button
                  className="bg-[#20b894] text-white px-3 py-2 rounded-full flex-1 cursor-pointer text-sm whitespace-nowrap hover:bg-[#1a9677] transition-colors"
                  onClick={() => modalHandler(currentChat)}
                >
                  Confirm Exchange Service
                </button>
                <button className="border border-[#b19c87] text-[#b19c87] px-3 py-2 rounded-full flex-1 text-sm whitespace-nowrap hover:bg-[#b19c87] hover:text-white transition-colors">
                  Give Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden h-full flex flex-col">
        {/* Mobile Header */}
        <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100">
          <h3 className="font-bold">Messages</h3>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {currentChat ? (
            <>
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3"
                  >
                    {currentChat?.profileImage ? (
                      <img
                        src={`${currentChat?.profileImage}`}
                        alt="UN"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">
                          {currentChat?.name?.slice(0, 2).toUpperCase()}
                          {currentChat?.email === currentUser.email
                            ? currentChat?.reciverUserId?.first_name
                                .slice(0, 2)
                                .toUpperCase()
                            : currentChat?.senderUserId?.first_name
                                .slice(0, 2)
                                .toUpperCase() || "UN"}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {getOtherUserName(currentChat)}
                      </h3>
                      <span
                        className={`text-sm ${
                          onlineUsers[getOtherUserEmail(currentChat)]
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        {onlineUsers[getOtherUserEmail(currentChat)]
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mobile Profile Details */}
              {isProfileOpen && (
                <div className="bg-white border-b border-gray-100 p-4">
                  <div className="bg-gray-100 p-4 rounded-lg text-center flex items-center gap-3 justify-center flex-col">
                    <div className="w-16 h-16 rounded-full bg-[#20b894] flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        {currentChat?.email === currentUser.email
                          ? currentChat?.reciverUserId?.first_name
                              .slice(0, 2)
                              .toUpperCase()
                          : currentChat?.senderUserId?.first_name
                              .slice(0, 2)
                              .toUpperCase() || "UN"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[16px]">
                        {getOtherUserName(currentChat)}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {getOtherUserEmail(currentChat)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 mt-4 w-full">
                      <button
                        className="bg-[#20b894] text-white px-3 py-2 rounded-full flex-1 cursor-pointer text-sm whitespace-nowrap hover:bg-[#1a9677] transition-colors"
                        onClick={() => {
                          modalHandler(currentChat);
                          setIsProfileOpen(false);
                        }}
                      >
                        Confirm Exchange Service
                      </button>
                      <button className="border border-[#b19c87] text-[#b19c87] px-3 py-2 rounded-full flex-1 text-sm whitespace-nowrap hover:bg-[#b19c87] hover:text-white transition-colors">
                        Give Review
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <MessageContent
                messages={messages}
                currentUser={currentUser}
                currentChat={currentChat}
                deleteMessage={deleteMessage}
              />
              <MessageInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-3/4 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold">Messages</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="h-[calc(100%-64px)]">
          <MessageList
            onChatSelect={(user) => {
              handleChatSelect(user);
              setIsSidebarOpen(false);
            }}
            userData={userList?.data?.map((user) => ({
              ...user,
              hasUnread: Boolean(unreadMessages[user.email]),
              lastMessage: lastMessages[user.email],
              isOnline: onlineUsers[user.email] || false,
              unreadCount: unreadMessages[user.email] || 0,
            }))}
            currentUser={currentUser?.email}
            userId={currentUser?.userId}
          />
        </div>
      </div>

      {currentChat && (
        <ConfirmServiceModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          id={currentChat?._id}
          myServices={currentChat?.my_service || []}
          senderService={currentChat?.senderService || "No service selected"}
          acceptedService={currentChat?.service || "No service selected"}
        />
      )}
    </div>
  );
};

export default Messages;
