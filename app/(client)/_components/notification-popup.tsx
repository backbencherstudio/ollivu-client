"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetAcceptedExchangeNotificationQuery,
  useGetReadExchangeNotificaionQuery,
  usePostMarkAllReadExchangeNotificationMutation,
} from "@/src/redux/features/notification/notificationApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
import { CustomToast } from "@/lib/Toast/CustomToast";
import { useGetAllExchangeDataQuery } from "@/src/redux/features/auth/authApi";
import { useExchangeChatRequestMutation } from "@/src/redux/features/shared/exchangeApi";

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notificationCount: number;
  requestList: any[];
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  notificationCount,
  requestList,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [localNotifications, setLocalNotifications] = useState([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  console.log("requestList popup", requestList);

  const { data: getReadExchangeNotificaion, isLoading: isNotificationLoading } =
    useGetReadExchangeNotificaionQuery(singleUserData?._id, {
      skip: !singleUserData?._id,
      pollingInterval: 5000,
    });
  // console.log("getReadExchangeNotificaion", getReadExchangeNotificaion?.data);

  // Update notifications when API data changes
  useEffect(() => {
    if (getReadExchangeNotificaion?.data && localNotifications.length === 0) {
      setNotifications(getReadExchangeNotificaion.data);
      setLocalNotifications(getReadExchangeNotificaion.data);
    }
  }, [getReadExchangeNotificaion, localNotifications.length]);

  // console.log("localNotification", localNotifications);

  const [postMarkAllReadExchangeNotification, { isLoading: isMarkingAllRead }] =
    usePostMarkAllReadExchangeNotificationMutation();

  const { data: getAcceptedExchangeNotification } =
    useGetAcceptedExchangeNotificationQuery(singleUserData?._id, {
      skip: !singleUserData?._id,
      pollingInterval: 5000,
    });
  console.log(
    "getAcceptedExchangeNotification",
    getAcceptedExchangeNotification?.data
  );

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const markAsRead = (id: string | number) => {
    // console.log("Marking individual notification as read:", id);
    // console.log(
    //   "Before - Unread count:",
    //   localNotifications.filter((n) => !n.isAcceptNotificationRead).length
    // );

    // Update local notifications to preserve them
    setLocalNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification._id === id || notification.id === id
          ? { ...notification, isAcceptNotificationRead: true }
          : notification
      );
      // console.log(
      //   "After - Unread count:",
      //   updated.filter((n) => !n.isAcceptNotificationRead).length
      // );
      return updated;
    });
  };

  const markAllAsRead = async () => {
    try {
      if (singleUserData?._id) {
        // console.log(
        //   "Before API call - Local notifications count:",
        //   localNotifications.length
        // );

        // Call the API to mark all notifications as read
        const result = await postMarkAllReadExchangeNotification(
          singleUserData._id
        ).unwrap();
        // console.log("API response:", result);

        // Update local state to mark all notifications as read (but keep them visible)
        setLocalNotifications((prev) => {
          const updated = prev.map((notification) => ({
            ...notification,
            isAcceptNotificationRead: true,
          }));
          // console.log("After updating local state - count:", updated.length);
          return updated;
        });

        // Show success toast
        CustomToast.show("All notifications marked as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Show error toast
      CustomToast.show(
        "Failed to mark notifications as read. Please try again."
      );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "request":
        return <User className="w-4 h-4 text-green-500" />;
      case "review":
        return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case "system":
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case "exchange":
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-800";
      case "request":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "system":
        return "bg-purple-100 text-purple-800";
      case "exchange":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const unreadCount = localNotifications.filter(
    (n) => !n.isAcceptNotificationRead
  ).length;

  // Debug log
  // console.log(
  //   "Render - Local notifications count:",
  //   localNotifications.length,
  //   "Unread count:",
  //   unreadCount
  // );

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (!isOpen) return null;

  // ================= Show Message Notification =================
  // const [exchangeChatRequest, isLoading] = useExchangeChatRequestMutation();

  const mergedNotifications = [
    ...(localNotifications || []).map(n => ({ ...n, _source: "notification" })),
    ...(Array.isArray(requestList) ? requestList : []).map(n => ({ ...n, _source: "request" })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
      <div className="fixed inset-0  bg-opacity-25" onClick={onClose} />
      <div
        ref={popupRef}
        className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-[650px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          {/* Left: Icon, Title, Unread badge */}
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {/* {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {unreadCount}
              </span>
            )} */}
          </div>
          {/* Right: Mark all as read, Close */}
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={isMarkingAllRead}
                className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50"
                aria-label="Mark all as read"
              >
                {isMarkingAllRead ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                    Marking...
                  </>
                ) : (
                  "Mark all read"
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          {isNotificationLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p>Loading notifications...</p>
            </div>
          ) : getAcceptedExchangeNotification?.data?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
              <p className="text-sm">
                You'll see exchange requests and notifications here when you
                receive them.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {[...(getAcceptedExchangeNotification?.data || [])]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((notification, index) => {
                  const isUnread = !notification.isAcceptNotificationRead;
                  const isWarning = notification.title
                    ?.toLowerCase()
                    .includes("suspend");
                  const isRequest = notification._source === "request";
                  return (
                    <div
                      key={notification._id}
                      className={`flex items-center px-4 py-3 rounded-lg mb-2 shadow-sm bg-white relative ${
                        isUnread
                          ? "border-l-4 border-green-500"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      {/* Avatar or Initial */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold mr-3">
                        {notification.selectedEmail ? (
                          notification.selectedEmail[0].toUpperCase()
                        ) : (
                          <User className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold ${
                              isWarning ? "text-red-600" : "text-gray-900"
                            }`}
                          >
                            {isWarning
                              ? "Account Suspension Notice!"
                              : notification?.selectedEmail}
                            {isWarning && (
                              // <ExclamationTriangleIcon className="inline ml-1 text-red-500" />
                              <p>Email</p>
                            )}
                          </span>
                          {/* Time */}
                          <span className="text-xs text-gray-400 ml-2">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {notification.isAccepted === "true"
                            ? `Your service "${notification.senderService}" was accepted!`
                            : `You have a new service request for "${notification.senderService}".`}
                        </div>
                        {/* Action Buttons */}
                        {isRequest && (
                          <div className="mt-2 flex gap-2">
                            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Accept
                            </button>
                            <button className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Status Dot */}
                      <span
                        className={`ml-3 w-3 h-3 rounded-full ${
                          isUnread ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isNotificationLoading && localNotifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button className="w-full py-3 text-center text-green-600 font-semibold bg-green-50 rounded-b-lg">
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
