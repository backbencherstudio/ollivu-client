import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: {
    user1: string;
    user2: string;
    status: string;
    joinDate: string;
  };
}

export function ViewDetailsModal({ isOpen, onClose, conversation }: ViewDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-[400px] p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">View Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {conversation.status === "Reported" ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-medium mb-4">Review Report</h3>
              <div className="flex justify-between">
                <span className="text-gray-500">Report by:</span>
                <span>{conversation.user1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Report reason:</span>
                <span>Spam / Scam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Report against:</span>
                <span>{conversation.user2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{conversation.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-red-500">Reported</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Actions Taken</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account:</span>
                  <span>Suspended</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User name:</span>
                  <div className="text-right">
                    <p>{conversation.user2}</p>
                    <p className="text-sm text-gray-500">{conversation.user2.toLowerCase().replace(' ', '_')}@gmail.com</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span>02-04-25</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Unsuspend
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Completed Service</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Sendedr Service</span>
                  <span className="text-sm font-medium">{conversation.user1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Receiver Service</span>
                  <span className="text-sm font-medium">{conversation.user2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Status</span>
                  <span className="text-sm font-medium text-green-600">{conversation.status}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-2">Service Exchanged</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{conversation.user1}</p>
                  <p className="text-xs text-gray-500">Photography</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  ⇄
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{conversation.user2}</p>
                  <p className="text-xs text-gray-500">Language Exchange</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}