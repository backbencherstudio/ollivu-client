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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
const socket = io("https://backend.ollivu.com");

const Messages = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [user, setUser] = useState(null); // Updated to null initially
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const currentUser = verifiedUser();
  const router = useRouter();
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

  // Remove the nested useEffect and combine socket logic
  //  useEffect(() => {
  //   if (!currentUser?.email) return;

  //   socket.emit("join", currentUser?.email);

  //   socket.on("connect", () => {
  //     socket.emit("user_online", currentUser?.email);
  //   });

  //   socket.on("online_users", (users) => {
  //     setOnlineUsers(users);
  //   });

  //   socket.on("user_connected", (email) => {
  //     setOnlineUsers((prev) => ({
  //       ...prev,
  //       [email]: true,
  //     }));
  //   });

  //   socket.on("user_disconnected", (email) => {
  //     setOnlineUsers((prev) => ({
  //       ...prev,
  //       [email]: false,
  //     }));
  //   });

  //   socket.on("message", (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);

  //     // Update unread count for both sender and recipient
  //     if (
  //       (!currentChat || 
  //       (message.sender !== getOtherUserEmail(currentChat) && 
  //        message.recipient !== getOtherUserEmail(currentChat)))
  //     ) {
  //       const otherUser = message.sender === currentUser?.email 
  //         ? message.recipient 
  //         : message.sender;

  //       setUnreadMessages((prev) => {
  //         const newUnreadMessages = {
  //           ...prev,
  //           [otherUser]: (prev[otherUser] || 0) + 1,
  //         };
  //         localStorage.setItem("unreadMessages", JSON.stringify(newUnreadMessages));
  //         return newUnreadMessages;
  //       });
  //     }



  //     // Update last messages
  //     const otherUser = message.sender === currentUser?.email 
  //       ? message.recipient 
  //       : message.sender;

  //     setLastMessages((prev) => {
  //       const newLastMessages = {
  //         ...prev,
  //         [otherUser]: {
  //           content: message.content,
  //           timestamp: message.timestamp,
  //         },
  //       };
  //       localStorage.setItem("lastMessages", JSON.stringify(newLastMessages));
  //       return newLastMessages;
  //     });
  //   });

  //   socket.on("message history", (history) => {
  //     setMessages(history);
  //   });

  //   socket.on("user list", (userList) => {
  //     // console.log("User list updated:", userList);
  //   });

  //   // Fetch initial unread messages when component mounts
  //   const fetchInitialUnreadMessages = async () => {
  //     try {
  //       // Get unread messages count directly from the server
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/messages/unread/${currentUser?.email}`
  //       );
  //       const unreadCounts = await response.json();
  //       // console.log("Initial unread counts:", unreadCounts); // Debug log
  //       // Update unread messages state and localStorage
  //       setUnreadMessages(unreadCounts);
  //       localStorage.setItem("unreadMessages", JSON.stringify(unreadCounts));
  //     } catch (error) {
  //       console.error("Error fetching initial unread messages:", error);
  //     }
  //   };

  //   fetchInitialUnreadMessages();

  //   return () => {
  //     socket.emit("user_offline", currentUser?.email);
  //     socket.off("online_users");
  //     socket.off("user_connected");
  //     socket.off("user_disconnected");
  //     socket.off("message");
  //     socket.off("message history");
  //     socket.off("user list");
  //   };
  // }, [currentUser?.email, currentChat, getOtherUserEmail]);


  // Remove duplicate useEffect and combine socket logic
  // Remove all other useEffects related to socket and keep only this one
  useEffect(() => {
    if (!currentUser?.email) return;

    // Initialize socket connection once
    socket.emit("join", currentUser?.email);
    socket.emit("user_online", currentUser?.email);

    // Setup event listeners
    const socketHandlers = {
      online_users: (users) => setOnlineUsers(users),
      user_connected: (email) => setOnlineUsers(prev => ({ ...prev, [email]: true })),
      user_disconnected: (email) => setOnlineUsers(prev => ({ ...prev, [email]: false })),
      message: (message) => {
        setMessages(prev => [...prev, message]);

        if (!currentChat ||
          (message.sender !== getOtherUserEmail(currentChat) &&
            message.recipient !== getOtherUserEmail(currentChat))
        ) {
          const otherUser = message.sender === currentUser?.email
            ? message.recipient
            : message.sender;

          setUnreadMessages(prev => {
            const newUnreadMessages = {
              ...prev,
              [otherUser]: (prev[otherUser] || 0) + 1,
            };
            localStorage.setItem("unreadMessages", JSON.stringify(newUnreadMessages));
            return newUnreadMessages;
          });
        }

        const otherUser = message.sender === currentUser?.email
          ? message.recipient
          : message.sender;

        setLastMessages(prev => {
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
      },
      message_history: (history) => setMessages(history),
      message_deleted: (messageId) => {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      }
    };

    // Register all event listeners
    Object.entries(socketHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Fetch initial unread messages only once when component mounts
    const fetchInitialUnreadMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/unread/${currentUser?.email}`
        );
        const unreadCounts = await response.json();
        setUnreadMessages(unreadCounts);
        localStorage.setItem("unreadMessages", JSON.stringify(unreadCounts));
      } catch (error) {
        console.error("Error fetching initial unread messages:", error);
      }
    };

    fetchInitialUnreadMessages();

    // Cleanup function
    return () => {
      socket.emit("user_offline", currentUser?.email);
      Object.keys(socketHandlers).forEach(event => {
        socket.off(event);
      });
    };
  }, [currentUser?.email]); // Remove currentChat and getOtherUserEmail from dependencies
  // Remove other duplicate useEffects related to socket events


  useEffect(() => {
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
  // const handleChatSelect = async (user) => {
  //   console.log("selected user", user);
  //   setCurrentChat(user);
  //   try {
  //     // Fetch messages for the selected chat
  //     const messagesResponse = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/chats?email=${
  //         currentUser?.email
  //       }&recipient=${getOtherUserEmail(user)}`
  //     );
  //     const messagesData = await messagesResponse.json();
  //     setMessages(messagesData);

  //     // Mark messages as read in the backend
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/messages/mark-read`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           sender: user.email,
  //           recipient: currentUser?.email,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       // Update local messages state
  //       setMessages((prevMessages) =>
  //         prevMessages.map((msg) =>
  //           msg.sender === user.email && msg.recipient === currentUser?.email
  //             ? { ...msg, read: true }
  //             : msg
  //         )
  //       );

  //       // Clear unread count for this user
  //       setUnreadMessages((prev) => {
  //         const newUnreadMessages = { ...prev };
  //         delete newUnreadMessages[user.email];
  //         localStorage.setItem(
  //           "unreadMessages",
  //           JSON.stringify(newUnreadMessages)
  //         );
  //         return newUnreadMessages;
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error handling chat selection:", error);
  //   }
  // };

  const handleChatSelect = async (user) => {
    console.log("selected user", user);
    setCurrentChat(user);
    try {
      const messagesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chats?email=${currentUser?.email
        }&recipient=${getOtherUserEmail(user)}`
      );
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);

      // Mark messages as read for both users
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/mark-read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: getOtherUserEmail(user),
            recipient: currentUser?.email,
          }),
        }
      );

      if (response.ok) {
        // Update local messages state
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, read: true }))
        );

        // Clear unread count for this conversation
        setUnreadMessages((prev) => {
          const newUnreadMessages = { ...prev };
          delete newUnreadMessages[getOtherUserEmail(user)];
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

  const handleReviewClick = (chat) => {
    if (!chat) return;

    const userId =
      chat?.email === currentUser?.email
        ? chat?.reciverUserId?._id
        : chat?.senderUserId?._id;

    if (userId) {
      router.push(`/service-result/${userId}`);
    }
  };

  const modalHandler = async (currentChat) => {
    if (currentChat?.senderUserId?.email === currentUser?.email) {
      const result = await acceptExchange({
        userId: currentUser?.userId,
        exchangeId: currentChat?._id,
      });
      console.log("result", result?.data?.message);

      toast.success(result?.data?.message);
      return console.log("result", result); // show confirmation alart
    }
    setIsConfirmModalOpen(true);
  };
  // console.log("currentChat", currentChat);

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content */}
      <div className="bg-white rounded-lg h-full hidden md:grid md:grid-cols-4 shadow-sm">
        {/* Left Sidebar - Always visible */}
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
              userImage={undefined}
            />
          </div>
        </div>

        {/* Chat Area and Right Sidebar - Only visible when chat is selected */}
        {currentChat ? (
          <>
            {/* Chat Area */}
            <div className="col-span-2 flex flex-col bg-white relative">
              {/* Chat Area Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {currentUser?.userId === currentChat?.senderUserId?._id ? (
                    // Show receiver's image if current user is sender
                    currentChat?.reciverUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.reciverUserId?.profileImage}`}
                        alt={currentChat?.reciverUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={30}
                        height={30}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#20b894] flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {currentChat?.reciverUserId?.first_name
                            ?.slice(0, 2)
                            .toUpperCase() || "UN"}
                        </span>
                      </div>
                    )
                  ) : // Show sender's image if current user is receiver
                    currentChat?.senderUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.senderUserId?.profileImage}`}
                        alt={currentChat?.senderUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={30}
                        height={30}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#20b894] flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {currentChat?.senderUserId?.first_name
                            ?.slice(0, 2)
                            .toUpperCase() || "UN"}
                        </span>
                      </div>
                    )}
                  <div>
                    <h3 className="font-semibold">
                      {getOtherUserName(currentChat)}
                    </h3>
                    <span
                      className={`text-sm ${onlineUsers[getOtherUserEmail(currentChat)]
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
            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 p-5 border-l border-gray-100">
              <div className="h-full flex flex-col">
                <h3 className="text-gray-500">Details</h3>
                <div className="bg-gray-100 p-6 rounded-lg mt-5 text-center flex items-center gap-3 justify-center flex-col">
                  {currentUser?.userId === currentChat?.senderUserId?._id ? (
                    // Show receiver's image if current user is sender
                    currentChat?.reciverUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.reciverUserId?.profileImage}`}
                        alt={currentChat?.reciverUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={30}
                        height={30}
                        className="w-20 h-20 rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#20b894] flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">
                          {currentChat?.reciverUserId?.first_name
                            ?.slice(0, 2)
                            .toUpperCase() || "UN"}
                        </span>
                      </div>
                    )
                  ) : // Show sender's image if current user is receiver
                    currentChat?.senderUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.senderUserId?.profileImage}`}
                        alt={currentChat?.senderUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={30}
                        height={30}
                        className="w-20 h-20 rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#20b894] flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">
                          {currentChat?.senderUserId?.first_name
                            ?.slice(0, 2)
                            .toUpperCase() || "UN"}
                        </span>
                      </div>
                    )}
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
                      className={`px-3 py-2 rounded-full flex-1 text-sm whitespace-nowrap transition-colors ${currentChat?.senderUserAccepted &&
                        currentChat?.reciverUserAccepted
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#20b894] text-white hover:bg-[#1a9677]"
                        }`}
                      onClick={() => {
                        modalHandler(currentChat);
                        setIsProfileOpen(false);
                      }}
                      disabled={
                        currentChat?.senderUserAccepted &&
                        currentChat?.reciverUserAccepted
                      }
                    >
                      {currentChat?.senderUserAccepted &&
                        currentChat?.reciverUserAccepted
                        ? "Exchange Confirmed"
                        : "Confirm Exchange Service"}
                    </button>
                    <button
                      className="border border-[#b19c87] text-[#b19c87] px-3 py-2 rounded-full flex-1 text-sm whitespace-nowrap hover:bg-[#b19c87] hover:text-white transition-colors cursor-pointer"
                      onClick={() => handleReviewClick(currentChat)}
                    >
                      Give Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Placeholder when no chat is selected
          <div className="col-span-3 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {/* Mobile View - Similar conditional rendering */}
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
              <div className="fixed top-[60px] left-0 right-0 z-50 bg-white">
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                  {/* <div className="flex items-center gap-3"> */}
                  <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="flex items-center gap-3 w-full"
                  >
                    {currentChat?.senderUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.senderUserId?.profileImage}`}
                        alt={currentChat?.senderUserId?.name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={30}
                        height={30}
                        className="w-14 h-14 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#20b894] flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
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
                        className={`text-sm ${onlineUsers[getOtherUserEmail(currentChat)]
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
                  {/* </div> */}
                </div>
              </div>

              {/* Mobile Profile Details */}
              {isProfileOpen && (
                <div className="bg-white border-b border-gray-100 p-4">
                  <div className="bg-gray-100 p-4 rounded-lg text-center flex items-center gap-3 justify-center flex-col">
                    <div className="flex items-center gap-3">
                      {currentChat?.senderUserId?.profileImage ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.senderUserId?.profileImage}`}
                          alt={currentChat?.senderUserId?.name
                            ?.slice(0, 2)
                            .toUpperCase()}
                          width={30}
                          height={30}
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
                          className={`text-sm ${onlineUsers[getOtherUserEmail(currentChat)]
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
                        className={`px-3 py-2 rounded-full flex-1 text-sm whitespace-nowrap transition-colors ${currentChat?.senderUserAccepted &&
                          currentChat?.reciverUserAccepted
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#20b894] text-white hover:bg-[#1a9677]"
                          }`}
                        onClick={() => {
                          modalHandler(currentChat);
                          setIsProfileOpen(false);
                        }}
                        disabled={
                          currentChat?.senderUserAccepted &&
                          currentChat?.reciverUserAccepted
                        }
                      >
                        {currentChat?.senderUserAccepted &&
                          currentChat?.reciverUserAccepted
                          ? "Exchange Confirmed"
                          : "Confirm Exchange Service"}
                      </button>
                      <button
                        className="border border-[#b19c87] text-[#b19c87] px-3 py-2 rounded-full flex-1 text-sm whitespace-nowrap hover:bg-[#b19c87] hover:text-white transition-colors cursor-pointer"
                        onClick={() => {
                          handleReviewClick(currentChat);
                          setIsProfileOpen(false);
                        }}
                      >
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
        className={`md:hidden fixed inset-y-0 left-0 w-3/4 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
              userImage: user?.senderUserId?.profileImage,
            }))}
            currentUser={currentUser?.email}
            userId={currentUser?.userId}
            userImage={undefined}
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

      <div>
        {/* Info Modal */}
        {isInfoModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold">Profile Details</h3>
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 p-6 rounded-xl text-center flex flex-col items-center gap-4">
                  {/* Reuse your existing profile content */}
                  <div className="w-20 h-20 rounded-full relative">
                    {currentChat?.senderUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat?.senderUserId?.profileImage}`}
                        alt={currentChat?.senderUserId?.name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#20b894] flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">
                          {currentChat?.email === currentUser.email
                            ? currentChat?.reciverUserId?.first_name
                              ?.slice(0, 2)
                              .toUpperCase()
                            : currentChat?.senderUserId?.first_name
                              ?.slice(0, 2)
                              .toUpperCase() || "UN"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {getOtherUserName(currentChat)}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {getOtherUserEmail(currentChat)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 w-full mt-4">
                    <button
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentChat?.senderUserAccepted &&
                        currentChat?.reciverUserAccepted
                        ? "bg-gray-200 text-gray-600"
                        : "bg-[#20b894] text-white active:bg-[#1a9677]"
                        }`}
                      onClick={() => {
                        modalHandler(currentChat);
                        setIsInfoModalOpen(false);
                      }}
                      disabled={
                        currentChat?.senderUserAccepted &&
                        currentChat?.reciverUserAccepted
                      }
                    >
                      {currentChat?.senderUserAccepted &&
                        currentChat?.reciverUserAccepted
                        ? "Exchange Confirmed"
                        : "Confirm Exchange Service"}
                    </button>

                    <button
                      className="px-4 py-2.5 rounded-xl text-sm font-medium border border-[#b19c87] text-[#b19c87] 
                      hover:bg-[#b19c87] hover:text-white transition-colors"
                      onClick={() => {
                        handleReviewClick(currentChat);
                        setIsInfoModalOpen(false);
                      }}
                    >
                      Give Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
