import { Button } from "@/components/ui/button";
import { StatusDropdown } from "./StatusDropdown";
import { ViewDetailsModal } from "./ViewDetailsModal";
import { useState } from "react";

// interface Conversation {
//   id: string;
//   senderService: string;
//   receverServer: string;
//   status: string;
//   joinDate: string;
// }

// interface ReportedProfile {
//   id: string;
//   user: string;
//   email: string;
//   reason: string;
//   description: string;
//   createdAt: string;
// }

interface ConversationTableProps {
  conversations: any[];
  isReportedView?: boolean;
  open: { [key: string]: boolean };
  setOpen: (open: { [key: string]: boolean }) => void;
  onStatusChange: (id: string, status: string) => void;
  onTakeAction: (conversation: any) => void;
}

export function ConversationTable({ 
  conversations, 
  isReportedView = false,
  open, 
  setOpen, 
  onStatusChange,
}: ConversationTableProps) {
  const [viewDetailsModal, setViewDetailsModal] = useState<{isOpen: boolean; conversation: any}>({
    isOpen: false,
    conversation: null
  });
  // const [takeActionModal, setTakeActionModal] = useState<{isOpen: boolean; conversation: any}>({
  //   isOpen: false,
  //   conversation: null
  // });

  return (
    <>
      <div className="relative w-full">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                {isReportedView ? (
                  <>
                    <th className="py-3 px-4 font-medium">#</th>
                    <th className="px-4 font-medium">Send Report User</th>
                    <th className="px-4 font-medium">Receive Report User</th>
                    <th className="px-4 font-medium">Email</th>
                    <th className="px-4 font-medium">Reason</th>
                    <th className="px-4 font-medium">Report Date</th>
                    <th className="px-4 font-medium">Action</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 font-medium">#</th>
                    <th className="px-4 font-medium">Sender Service</th>
                    <th className="px-4 font-medium">Receiver Service</th>
                    <th className="px-4 font-medium">Status</th>
                    <th className="px-4 font-medium">Join Date</th>
                    <th className="px-4 font-medium">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {conversations.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">{index + 1}</td>
                  {isReportedView ? (
                    <>
                      <td className="px-4">{item.reporterId.first_name}</td>
                      <td className="px-4">{item.reportedId.first_name}</td>
                      <td className="px-4">{item.email}</td>
                      <td className="px-4">{item.reason}</td>
                      <td className="px-4">
                        <p className="text-[#4A4C56] text-xs">{item.createdAt}</p>
                      </td>
                      <td className="px-4">
                        <Button 
                          variant="link" 
                          className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer"
                          onClick={() => setViewDetailsModal({ isOpen: true, conversation: item })}
                        >
                          View details
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4">{item.user1}</td>
                      <td className="px-4">{item.user2}</td>
                      <td className="px-4">
                        <StatusDropdown
                          status={item.status}
                          convId={item.id}
                          open={open[item.id]}
                          onOpenChange={(isOpen) => setOpen({ ...open, [item.id]: isOpen })}
                          onStatusChange={(status) => onStatusChange(item.id, status)}
                        />
                      </td>
                      <td className="px-4">
                        <p className="text-[#4A4C56] text-xs">{item.joinDate}</p>
                      </td>
                      <td className="px-4">
                        <Button 
                          variant="link" 
                          className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer"
                          onClick={() => setViewDetailsModal({ isOpen: true, conversation: item })}
                        >
                          View details
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ViewDetailsModal 
        isOpen={viewDetailsModal.isOpen}
        onClose={() => setViewDetailsModal({ isOpen: false, conversation: null })}
        conversation={viewDetailsModal.conversation}
        isReportedView={isReportedView}
      />
    </>
  );
}