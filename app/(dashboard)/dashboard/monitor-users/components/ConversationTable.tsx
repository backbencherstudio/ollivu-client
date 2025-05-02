import { Button } from "@/components/ui/button";
import { StatusDropdown } from "./StatusDropdown";
import { ViewDetailsModal } from "./ViewDetailsModal";
import { useState } from "react";
import Image from "next/image";
import { useTakeActionProfileReportMutation } from "@/src/redux/features/admin/profileReportApi";
import { toast } from "react-toastify";

interface ConversationTableProps {
  conversations: any[];
  isReportedView?: boolean;
  isSuspendedView?: boolean;
  open: { [key: string]: boolean };
  setOpen: (open: { [key: string]: boolean }) => void;
  onStatusChange: (id: string, status: string) => void;
  onTakeAction: (conversation: any) => void;
}

export function ConversationTable({
  conversations,
  isReportedView = false,
  isSuspendedView = false,
  open,
  setOpen,
  onStatusChange,
}: ConversationTableProps) {

  const [viewDetailsModal, setViewDetailsModal] = useState<{
    isOpen: boolean;
    conversation: any;
  }>({
    isOpen: false,
    conversation: null,
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
                {isSuspendedView ? (
                  <>
                    <th className="py-3 px-4 font-medium">#</th>
                    <th className="px-4 font-medium">User</th>
                    <th className="px-4 font-medium">Email</th>
                    <th className="px-4 font-medium">Reason</th>
                    <th className="px-4 font-medium">Suspended Date</th>
                    <th className="px-4 font-medium">Status</th>
                    <th className="px-4 font-medium">Action</th>
                  </>
                ) : isReportedView ? (
                  <>
                    <th className="py-3 px-4 font-medium">#</th>
                    <th className="px-4 font-medium">Send Report User</th>
                    <th className="px-4 font-medium">Receive Report User</th>
                    {/* <th className="px-4 font-medium">Email</th> */}
                    <th className="px-4 font-medium">Reason</th>
                    <th className="px-4 font-medium">Report Date</th>
                    <th className="px-4 font-medium">Status</th>
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
                  {isSuspendedView ? (
                    <>
                      <td className="px-4">{item?.reportedId.first_name}</td>
                      <td className="px-4">{item?.reportedId.email}</td>
                      <td className="px-4">{item?.reportType}</td>
                      <td className="px-4">{item.updatedAt}</td>
                      <td className="px-4">
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-yellow-600">
                          {item?.action}
                        </span>
                      </td>
                      <td className="px-4">
                        <Button
                          variant="link"
                          className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer"
                          onClick={() =>
                            setViewDetailsModal({
                              isOpen: true,
                              conversation: item,
                            })
                          }
                        >
                          View details
                        </Button>
                      </td>
                    </>
                  ) : isReportedView ? (
                    <>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 relative overflow-hidden">
                            {item?.reporterId?.profileImage ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.reporterId?.profileImage}`}
                                alt={item?.reporterId?.first_name || "User"}
                                fill
                                className="object-cover"
                                onError={(e: any) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.parentElement.innerHTML = `<span class="flex h-full items-center justify-center text-lg font-medium text-gray-500">${
                                    item?.reporterId?.first_name?.charAt(0) ||
                                    "U"
                                  }</span>`;
                                }}
                              />
                            ) : (
                              <span className="flex h-full items-center justify-center text-lg font-medium text-gray-500">
                                {item?.reporterId?.first_name?.charAt(0) || "U"}
                              </span>
                            )}
                          </div>
                          {item?.reporterId?.first_name || "Anonymous"}
                        </div>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 relative overflow-hidden">
                            {item?.reportedId?.profileImage ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.reportedId?.profileImage}`}
                                alt={item?.reportedId?.first_name || "User"}
                                fill
                                className="object-cover"
                                onError={(e: any) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.parentElement.innerHTML = `<span class="flex h-full items-center justify-center text-lg font-medium text-gray-500">${
                                    item?.reportedId?.first_name?.charAt(0) ||
                                    "U"
                                  }</span>`;
                                }}
                              />
                            ) : (
                              <span className="flex h-full items-center justify-center text-lg font-medium text-gray-500">
                                {item?.reportedId?.first_name?.charAt(0) || "U"}
                              </span>
                            )}
                          </div>
                          {item?.reportedId?.first_name || "Anonymous"}
                        </div>
                      </td>
                      {/* <td className="px-4">{item.email}</td> */}

                      <td className="px-4">{item.reason}</td>

                      <td className="px-4">
                        <p className="text-[#4A4C56] text-xs">
                          {item.createdAt}
                        </p>
                      </td>
                      <td className="px-4">
                        <p className="text-[#4A4C56] text-xs">{item.status}</p>
                      </td>
                      {/* <td className="px-4">
                        <p className="text-[#4A4C56] text-xs">{item.action}</p>
                      </td> */}
                      <td className="px-4">
                        <Button
                          variant="link"
                          className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer"
                          onClick={() =>
                            setViewDetailsModal({
                              isOpen: true,
                              conversation: item,
                            })
                          }
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
                          onOpenChange={(isOpen) =>
                            setOpen({ ...open, [item.id]: isOpen })
                          }
                          onStatusChange={(status) =>
                            onStatusChange(item.id, status)
                          }
                        />
                      </td>
                      <td className="px-4">
                        <p className="text-[#4A4C56] text-xs">
                          {item.joinDate}
                        </p>
                      </td>
                      <td className="px-4">
                        <Button
                          variant="link"
                          className="p-0 text-[#4A4C56] hover:text-[#20B894] cursor-pointer"
                          onClick={() =>
                            setViewDetailsModal({
                              isOpen: true,
                              conversation: item,
                            })
                          }
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
        setViewDetailsModal={setViewDetailsModal}
        onClose={() =>
          setViewDetailsModal({ isOpen: false, conversation: null })
        }
        conversation={viewDetailsModal?.conversation}
        isReportedView={isReportedView}
        isSuspendedView={isSuspendedView}
      />
    </>
  );
}
