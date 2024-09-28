import React, { useState, useEffect } from "react";
import SignupForm from "./SignupForm";

const PopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000); // Show popup 1 second after page load
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the modal
          >
            {/* Close button in PopupModal */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={handleClose}
            >
              &times;
            </button>

            {/* Embed SignupForm */}
            <SignupForm />
          </div>
        </div>
      )}
    </>
  );
};

export default PopupModal;
