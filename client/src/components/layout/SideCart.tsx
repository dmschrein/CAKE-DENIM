"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";

const SideCart = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed top-0 right-0 h-full bg-white shadow-lg transition-transform transform ${
    isSidebarCollapsed ? "translate-x-full" : "translate-x-0"
  } z-50 w-72 md:w-96 duration-300 ease-in-out`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="font-bold text-xl">Shopping Cart</h1>
        <button onClick={toggleSidebar} className="text-xl font-bold">
          &times;
        </button>
      </div>
      <div className="p-4">
        <p>Your cart is empty</p>
        {/* TODO: add checkout button that takes user to checkout page */}
      </div>
    </div>
  );
};

export default SideCart;
