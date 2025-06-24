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
import { useGetReadExchangeNotificaionQuery } from "@/src/redux/features/notification/notificationApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";

// Static notification data
const staticNotifications = [
  {
    id: 1,
    type: "message",
    title: "New message from John Doe",
    message:
      "Hi! I'm interested in your web development services. Can we discuss the project?",
    time: "2 minutes ago",
    isRead: false,
    sender: "John Doe",
    avatar: "/avatars/john.png",
  },
  {
    id: 2,
    type: "request",
    title: "Service request received",
    message:
      "Sarah Smith has requested your graphic design services for a logo project.",
    time: "15 minutes ago",
    isRead: false,
    sender: "Sarah Smith",
    avatar: "/avatars/sophia.png",
  },
  {
    id: 3,
    type: "review",
    title: "New review received",
    message: "Michael Johnson left a 5-star review for your completed project.",
    time: "1 hour ago",
    isRead: true,
    sender: "Michael Johnson",
    avatar: "/avatars/michael.png",
  },
  {
    id: 4,
    type: "system",
    title: "Profile verification completed",
    message: "Congratulations! Your profile has been verified successfully.",
    time: "2 hours ago",
    isRead: true,
    sender: "System",
    avatar: null,
  },
  {
    id: 5,
    type: "message",
    title: "Project update from Emily",
    message:
      "The design files have been uploaded. Please review and let me know your thoughts.",
    time: "3 hours ago",
    isRead: true,
    sender: "Emily Wilson",
    avatar: "/avatars/emily.png",
  },
];

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notificationCount: number;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  notificationCount,
}) => {
  const [notifications, setNotifications] = useState(staticNotifications);
  const popupRef = useRef<HTMLDivElement>(null);
  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  // console.log("sin", singleUserData?._id);

  const { data: getReadExchangeNotificaion } =
    useGetReadExchangeNotificaionQuery(singleUserData?._id);
  console.log("getRead", getReadExchangeNotificaion);
// 
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

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
      <div className="fixed inset-0  bg-opacity-25" onClick={onClose} />
      <div
        ref={popupRef}
        className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-[650px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
              <p className="text-sm">
                You'll see notifications here when you receive them.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <img
                          src={notification.avatar}
                          alt={notification.sender}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getNotificationBadgeColor(
                                  notification.type
                                )}`}
                              >
                                {notification.type}
                              </span>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {notification.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm text-gray-600 hover:text-gray-800"
              onClick={() => {
                // Navigate to notifications page or dashboard
                window.location.href = "/dashboard/notifications";
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
