import React from "react";

type ModalProps = {
  isOpen: boolean;
  handleClose: () => void; // takes no arguments and returns nothing, allows parent component to control the closing of the sign-in modal
  children: React.ReactNode;
};
const Modal: React.FC<ModalProps> = ({ isOpen, handleClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="shawdow-lg relative w-full max-w-md rounded-lg bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={handleClose}
        >
          &times;
        </button>

        {/* Render children */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
