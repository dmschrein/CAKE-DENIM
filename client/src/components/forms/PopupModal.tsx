import React, { useState, useEffect } from "react";
import SignupForm from "./SignupForm";
import Modal from "../common/Modal";

const PopupModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // function to show pop up 1 second after the user visits the page
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
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <SignupForm handleClose={handleClose} />
    </Modal>
  );
};

export default PopupModal;
