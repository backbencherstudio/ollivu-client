"use client";

import CustomImage from "@/components/reusable/CustomImage";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function UserManagement() {
  const { data: users, isLoading, error } = useGetAllUsersQuery({});
  // console.log("users: ", users?.data);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users?.data?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil(users?.data?.length / usersPerPage);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-5 bg-white">
        <div className="overflow-x-auto rounded-xl inter  bg-white">
          <table className="w-full text-left">
            <thead className="bg-[#FAFAFA] Inter text-sm text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden">
                        {user?.profileImage ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user?.profileImage}`}
                            alt={user?.first_name || "User"}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-lg font-medium">
                            {user.first_name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="">{user.first_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td
                    onClick={() => openModal(user)}
                    className="px-6 py-4 text-green-600 inter hover:underline cursor-pointer"
                  >
                    View details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-green-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[420px] relative shadow-xl">
              <button
                onClick={closeModal}
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center gap-4 mb-8">
                {selectedUser?.profileImage ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-emerald-50">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedUser?.profileImage}`}
                      alt={selectedUser?.first_name || "User"}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-semibold ring-4 ring-emerald-50">
                    {selectedUser.first_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedUser.first_name}
                  </h2>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">User Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">User ID</span>
                      <span className="font-medium text-gray-900">
                        #{selectedUser._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Role</span>
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {selectedUser.role || "User"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Services</span>
                      <div className="flex flex-wrap justify-end gap-1 max-w-[200px]">
                        {selectedUser.my_service?.map((service, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
