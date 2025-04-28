import Image from "next/image";

interface UserListProps {
    users: any[];
    selectedUsers: string[];
    onUserToggle: (userId: string) => void;
    isLoading?: boolean;
  }

export default function UserList({ users, selectedUsers, onUserToggle, isLoading }: UserListProps) {
    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B894]"></div>
          </div>
        );
      }

      
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found for this category
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[420px] overflow-y-auto mb-6 bg-[#EDE3D9]">
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onUserToggle(user._id)}
          className={`flex justify-between items-center bg-white p-3 border rounded-xl ${
            selectedUsers.includes(user._id) ? "border-[#20B894]" : "border-gray-200"
          } cursor-pointer hover:bg-gray-50`}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              {user?.profileImage ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user.profileImage}`}
                  alt={user.first_name || "User"}
                  fill
                  className="object-cover"
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = `
                      <div class="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-sm font-medium">
                        ${user.first_name?.slice(0, 2)?.toUpperCase() || "UN"}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-sm font-medium">
                  {user.first_name?.slice(0, 2)?.toUpperCase() || "UN"}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-[#070707]">
                {user?.first_name || "Unknown"}{" "}
                <span className="text-yellow-500 ml-1">★ {user?.rating || "0.0"}</span>
              </p>
              <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={selectedUsers.includes(user._id)}
            onChange={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}