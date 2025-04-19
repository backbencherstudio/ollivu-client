"use client";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import { useState } from "react";

export default function UserManagement() {
  const { data: users, isLoading, error } = useGetAllUsersQuery({});
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

  const usersPerPage = 5;
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
                      <div className="">
                        <img
                          src="/avater.png"
                          className="w-5 h-5 rounded-full"
                          alt="avatar"
                        />
                      </div>
                      <div className="">
                        {user.first_name}
                      </div>
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
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-green-500 text-white" : ""
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[350px] relative shadow-lg">
              <button
                onClick={closeModal}
                className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                ×
              </button>
              <div className="flex flex-col items-center gap-2 mt-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${selectedUser.first_name}`}
                  className="w-20 h-20 rounded-full"
                  alt="avatar"
                />
                <h2 className="font-semibold text-lg">
                  {selectedUser.first_name}
                </h2>
                <p className="text-gray-500 text-sm">{selectedUser.email}</p>
              </div>

              <div className="mt-4 border rounded-lg p-4">
                <p className="text-sm text-gray-500">User Management</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">User Id</span>
                  <span className="font-medium">
                    #{selectedUser._id.slice(-4).toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">Location</span>
                  <span className="font-medium">United States</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">Skill</span>
                  <span className="font-medium">
                    {selectedUser.my_service?.[0]?.name || "Not Provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
