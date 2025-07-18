"use client";

import { ArrowRightLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTakeActionProfileReportMutation } from "@/src/redux/features/admin/profileReportApi";
import { toast } from "sonner";
import {
  useExchangeUserConversationQuery,
  useShowConversationQuery,
} from "@/src/redux/features/categories/categoriesApi";
import { useState, useRef, useEffect } from "react";
import moment from "moment";

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: any;
  suspendData: any;
  isReportedView: boolean;
  isSuspendedView: boolean;
  setViewDetailsModal: any;
}

export function ViewDetailsModal({
  isOpen,
  suspendData,
  onClose,
  conversation,
  isReportedView,
  isSuspendedView,
  setViewDetailsModal,
}: ViewDetailsModalProps) {
  if (!isOpen) return null;
  // console.log("conversation", conversation);
  const [userIds, setUserIds] = useState<{
    reporterId: string;
    reportedId: string;
  } | null>(null);
  const [showUserConversation, setShowUserConversation] = useState(false);
  const [exchangeUserEmails, setExchangeUserEmails] = useState(null);

  const [takeActionProfileReport, { isLoading }] =
    useTakeActionProfileReportMutation();

  const {
    data: showConversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = useShowConversationQuery(userIds, { skip: !userIds });
  console.log(
    "show conversation",
    showConversation?.data || showConversation?.messages
  );

  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");

  const actionHandler = async (action) => {
    setLoadingAction(action.action);
    const result = await takeActionProfileReport(action);
    if (result?.data?.success) {
      toast.success(result?.data?.message);
      setViewDetailsModal(false);
      setLoadingAction("");
    }
  };

  const handelShowConversation = () => {
    const reporterIdAndReportedId = {
      reporterId: conversation?.reporterId?._id,
      reportedId: conversation?.reportedId?._id,
    };
    setUserIds(reporterIdAndReportedId);
  };

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showConversation]);

  const exchangeEmail = {
    email1: conversation.senderEmail,
    email2: conversation.receiverEmail,
  };
  // console.log("87", exchangeEmail);

  const { data: exchangeConversationData } =
    useExchangeUserConversationQuery(exchangeUserEmails);
  console.log("exchange data", exchangeConversationData);

  const handelExchangeUserConversation = () => {
    setExchangeUserEmails(exchangeEmail);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[500px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">View Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isReportedView ? (
          <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4 custom-scrollbar">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium">Report Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500">Reporter:</span>
                    <div className="text-right">
                      <p className="font-medium">
                        {conversation.reporterId.first_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {conversation.reporterId.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500">Reported User:</span>
                    <div className="text-right">
                      <p className="font-medium">
                        {conversation.reportedId.first_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {conversation.reportedId.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Report Type:</span>
                    <span className="text-red-500 font-medium">
                      {conversation.reportType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Report Date:</span>
                    <span>
                      {new Date(conversation.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {conversation?.supportingFile ? (
                <div className="space-y-3">
                  <h3 className="font-medium">Supporting Evidence</h3>
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${conversation.supportingFile}`}
                      alt="Supporting evidence"
                      fill
                      className="object-contain"
                      onError={(e: any) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement.innerHTML = `
                        <div class="flex h-full items-center justify-center">
                          <span class="text-4xl font-medium text-gray-400">
                            ${
                              conversation?.reportedId?.first_name
                                ?.charAt(0)
                                ?.toUpperCase() || "E"
                            }
                          </span>
                        </div>
                      `;
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-medium">Supporting Evidence</h3>
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <span className="text-4xl font-medium text-gray-400">
                      {conversation?.reportedId?.first_name
                        ?.charAt(0)
                        ?.toUpperCase() || "E"}
                    </span>
                  </div>
                </div>
              )}

              <div>
                {isConversationLoading ? (
                  <p>Loading...</p>
                ) : (
                  <button
                    onClick={() => {
                      handelShowConversation();
                      setIsConversationModalOpen(true);
                    }}
                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-1 rounded-xl cursor-pointer"
                  >
                    Show Conversation
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Take Actions</h3>
                <div className="flex flex-col justify-center items-center gap-3">
                  <Button
                    onClick={() =>
                      actionHandler({ action: "safe", id: conversation.id })
                    }
                    // variant="outline"
                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    disabled={isLoading && loadingAction === "safe"}
                  >
                    {isLoading && loadingAction === "safe"
                      ? "Loading..."
                      : "Mark as safe"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      actionHandler({ action: "suspend", id: conversation.id })
                    }
                    className="w-1/2 text-orange-500 hover:text-orange-600 hover:bg-red-50 cursor-pointer "
                    disabled={isLoading && loadingAction === "suspend"}
                  >
                    {isLoading && loadingAction === "suspend"
                      ? "Loading..."
                      : "Suspend Account"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      actionHandler({ action: "blocked", id: conversation.id })
                    }
                    className="w-1/2 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer "
                    disabled={isLoading && loadingAction === "blocked"}
                  >
                    {isLoading && loadingAction === "blocked"
                      ? "Loading..."
                      : "Block & Remove Profile"}
                  </Button>
                </div>
              </div>

              {userIds && (
                <div className="mt-4">
                  {isConversationLoading && <p>Loading conversation...</p>}
                  {conversationError && (
                    <p className="text-red-500">Failed to load conversation.</p>
                  )}
                  {showConversation && (
                    <div>
                      {showConversation.messages?.length > 0 ? (
                        <ul>
                          {showConversation.messages.map((msg, idx) => (
                            <li key={idx}>
                              <strong>{msg.senderName}:</strong> {msg.text}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No conversation found.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : isSuspendedView ? (
          <div className="space-y-6">
            {suspendData.map((suspend) => (
              <div>
                <h3 className="text-sm text-gray-500 mb-1">
                  Completed Service
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Reported User:</span>
                    <span className="text-sm font-medium">
                      {suspend?.reporterId?.first_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Report reason:</span>
                    <span className="text-sm font-medium text-red-500">
                      {suspend?.reportType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Report against:</span>
                    <span className="text-sm font-medium">
                      {suspend?.reportedId?.first_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Date:</span>
                    <span className="text-sm font-medium">
                      {new Date(suspend?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col justify-center items-center gap-3">
              <Button
                onClick={() =>
                  actionHandler({ action: "safe", id: conversation?._id })
                }
                variant="outline"
                className="w-1/2 text-green-500 hover:text-green-600 hover:bg-red-50 cursor-pointer"
                disabled={isLoading && loadingAction === "safe"}
              >
                {isLoading && loadingAction === "safe"
                  ? "Loading..."
                  : "Mark as safe"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Completed Service</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Sender Name:</span>
                  <div className="text-right">
                    <p className="font-medium">{conversation?.user1}</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Receiver Name:</span>
                  <div className="text-right">
                    <p className="font-medium">{conversation?.user2}</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Status:</span>
                  <div className="text-right">
                    <p className="font-medium">{conversation?.status}</p>
                  </div>
                </div>
                <div className="flex justify-between items-start my-8">
                  {/* Completed Service */}
                  <button
                    onClick={() => {
                      handelExchangeUserConversation();
                      setIsConversationModalOpen(true); // Open the conversation modal
                    }}
                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-1 rounded-xl cursor-pointer"
                  >
                    Show Conversation
                  </button>
                </div>
                <hr />
                <div>
                  <h3 className="text-xl text-gray-900 font-medium mb-2">
                    Service Exchanged
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {conversation.user1}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversation?.senderService}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      ⇄
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {conversation.user2}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversation?.receiverServices}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isConversationModalOpen && (
        <ConversationModal
          showConversation={
            exchangeConversationData?.data &&
            exchangeConversationData?.data.length > 0
              ? { data: exchangeConversationData.data }
              : showConversation
          }
          isLoading={isConversationLoading}
          error={conversationError}
          onClose={() => setIsConversationModalOpen(false)}
          currentUserId={conversation?.reporterId?._id}
        />
      )}
    </div>
  );
}

function ConversationModal({
  showConversation,
  isLoading,
  error,
  onClose,
  currentUserId,
}) {
  const messages = Array.isArray(showConversation?.data)
    ? showConversation.data
    : Array.isArray(showConversation?.messages)
    ? showConversation.messages
    : [];

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Get unique emails for both users
  const uniqueEmails = [...new Set(messages.map((msg) => msg.sender))];
  const firstUserEmail = uniqueEmails[0] || "";

  // Function to get initials from email
  const getInitials = (email) => {
    return email.split("@")[0].charAt(0).toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-xl w-[500px] h-[600px] p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h3 className="text-lg font-semibold">Message History</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4">
          {isLoading && (
            <div className="flex justify-center">
              <p className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Loading messages...
              </p>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <p className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm">
                Failed to load messages
              </p>
            </div>
          )}
          {messages.length > 0 ? (
            [...messages]
              .sort(
                (a, b) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
              )
              .map((msg, idx) => {
                // Decide alignment: right if sender is the first user, left otherwise
                const isSender = msg.sender === messages[0]?.sender;
                // Get initials
                const getInitials = (email) =>
                  email ? email.split("@")[0][0].toUpperCase() : "?";
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex items-end gap-2 ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar/Initial */}
                    {!isSender && (
                      <div
                        className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold"
                        title={msg.sender}
                      >
                        {getInitials(msg.sender)}
                      </div>
                    )}
                    {/* Message Bubble */}
                    <div className={`flex flex-col max-w-[70%]`}>
                      <div
                        className={`rounded-2xl px-4 py-2 mb-1 ${
                          isSender
                            ? "bg-green-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      </div>
                      {/* Service Info */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span>
                          {msg.senderService && msg.senderService !== "N/A"
                            ? msg.senderService
                            : "No service"}
                        </span>
                        <span>⇄</span>
                        <span>
                          {msg.reciverService && msg.reciverService !== "N/A"
                            ? msg.reciverService
                            : "No service"}
                        </span>
                      </div>
                      {/* Timestamp */}
                      <span className="text-[11px] text-gray-400">
                        {moment(msg.timestamp).format("MMM D, h:mm A")}
                      </span>
                    </div>
                    {/* Avatar/Initial for sender (right side) */}
                    {isSender && (
                      <div
                        className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold"
                        title={msg.sender}
                      >
                        {getInitials(msg.sender)}
                      </div>
                    )}
                  </div>
                );
              })
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-400 text-center">No messages found</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
