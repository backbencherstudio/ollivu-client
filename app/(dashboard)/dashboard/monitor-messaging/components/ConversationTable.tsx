import { Button } from "@/components/ui/button";
import { StatusDropdown } from "./StatusDropdown";
import { ViewDetailsModal } from "./ViewDetailsModal";
import { useState } from "react";
import { TakeActionModal } from "./TakeActionModal";

interface Conversation {
  id: string;
  user1: string;
  user2: string;
  status: string;
  joinDate: string;
}

interface ConversationTableProps {
  conversations: any[];
  open: { [key: string]: boolean };
  setOpen: (open: { [key: string]: boolean }) => void;
  onStatusChange: (id: string, status: string) => void;
  onTakeAction: (conversation: any) => void;  // Add this prop
}

export function ConversationTable({ 
  conversations, 
  open, 
  setOpen, 
  onStatusChange,
  onTakeAction 
}: ConversationTableProps) {
  const [viewDetailsModal, setViewDetailsModal] = useState<{isOpen: boolean; conversation: any}>({
    isOpen: false,
    conversation: null
  });
  const [takeActionModal, setTakeActionModal] = useState<{isOpen: boolean; conversation: any}>({
    isOpen: false,
    conversation: null
  });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-4 text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">User Id</th>
              <th>User 1</th>
              <th>User 2</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conv) => (
              <tr key={conv.id} className="border-b">
                <td className="py-3">{conv.id}</td>
                <td>{conv.user1}</td>
                <td>{conv.user2}</td>
                <td>
                  <StatusDropdown
                    status={conv.status}
                    convId={conv.id}
                    open={open[conv.id]}
                    onOpenChange={(isOpen) => setOpen({ ...open, [conv.id]: isOpen })}
                    onStatusChange={(status) => onStatusChange(conv.id, status)}
                  />
                </td>
                <td>
                  <p className="text-[#4A4C56] text-xs">{conv.joinDate}</p>
                </td>
                <td>
                  <Button 
                    variant="link" 
                    className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer"
                    onClick={() => {
                      if (conv.status === "Reported: pending") {
                        setTakeActionModal({ isOpen: true, conversation: conv });
                      } else {
                        setViewDetailsModal({ isOpen: true, conversation: conv });
                      }
                    }}
                  >
                    {conv.status === "Reported: pending" 
                      ? "Take Action" 
                      : "View details"
                    }
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ViewDetailsModal 
        isOpen={viewDetailsModal.isOpen}
        onClose={() => setViewDetailsModal({ isOpen: false, conversation: null })}
        conversation={viewDetailsModal.conversation}
      />

      <TakeActionModal 
        isOpen={takeActionModal.isOpen}
        onClose={() => setTakeActionModal({ isOpen: false, conversation: null })}
        conversation={takeActionModal.conversation}
      />
    </>
  );
}