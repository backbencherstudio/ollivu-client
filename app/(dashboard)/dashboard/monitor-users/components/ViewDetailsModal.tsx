import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: any;
  isReportedView: boolean;
}

export function ViewDetailsModal({ isOpen, onClose, conversation, isReportedView }: ViewDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-[500px] p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Report Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isReportedView ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Report Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Reporter:</span>
                  <div className="text-right">
                    <p className="font-medium">{conversation.reporterId.first_name}</p>
                    <p className="text-sm text-gray-500">{conversation.reporterId.email}</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Reported User:</span>
                  <div className="text-right">
                    <p className="font-medium">{conversation.reportedId.first_name}</p>
                    <p className="text-sm text-gray-500">{conversation.reportedId.email}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Report Type:</span>
                  <span className="text-red-500 font-medium">{conversation.reportType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Report Date:</span>
                  <span>{new Date(conversation.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
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
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = `
                        <div class="flex h-full items-center justify-center">
                          <span class="text-4xl font-medium text-gray-400">
                            ${conversation?.reportedId?.first_name?.charAt(0)?.toUpperCase() || 'E'}
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
                    {conversation?.reportedId?.first_name?.charAt(0)?.toUpperCase() || 'E'}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-medium">Actions</h3>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="w-1/2 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Ban User
                </Button>
                <Button 
                  className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Dismiss Report
                </Button>
              </div>
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