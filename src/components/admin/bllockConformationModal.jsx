import React from "react";
import { X } from "lucide-react";

const ConfirmBlockModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  actionType,
}) => {
  if (!isOpen) return null;

  const isClient = user?.companyName !== undefined;
  const userType = isClient ? "Client" : "Freelancer";

  const title =
    actionType === "block" ? `Block ${userType}` : `Unblock ${userType}`;
  const message =
    actionType === "block"
      ? `Are you sure you want to block ${user?.userName}? They will no longer be able to access the platform.`
      : `Are you sure you want to unblock ${user?.userName}? They will regain access to the platform.`;
  const confirmButtonText = actionType === "block" ? "Block" : "Unblock";
  const confirmButtonClass =
    actionType === "block"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-green-600 hover:bg-green-700 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.userName}
                className="w-12 h-12 rounded-lg mr-3 object-cover"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 text-white ${
                  isClient
                    ? "bg-gradient-to-br from-blue-400 to-indigo-500"
                    : "bg-gradient-to-br from-purple-400 to-indigo-500"
                }`}
              >
                <span className="font-medium text-lg">
                  {user?.userName?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">{user?.userName}</p>
              <p className="text-sm text-gray-500">
                {isClient ? user?.companyName || "Individual" : user?.position}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(user?._id);
                onClose();
              }}
              className={`px-4 py-2 rounded-lg ${confirmButtonClass}`}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBlockModal;
