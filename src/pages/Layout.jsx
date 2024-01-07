import React, { useState, useEffect } from "react";
import Sidebar from "./Teacher/Sidebar";
const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="bg-gray-200 flex-1 max-h-[800px]">
        <div className="p-4 bg-blue-600 fixed w-full">Header</div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
