// Sidebar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaChartBar,
  FaQuestionCircle,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { IoLogOut } from "react-icons/io5";

const Sidebar = () => {
  const navigate = useNavigate();

  const links = [
    { label: "Dashboard", icon: <FaHome />, to: "/dashboard" },
    { label: "My Courses", icon: <FaBook />, to: "/my-courses" },
    { label: "My Lectures", icon: <FaChalkboardTeacher />, to: "/my-lectures" },
    { label: "My Profile", icon: <FaUserGraduate />, to: "/my-profile" },
    { label: "Statistics", icon: <FaChartBar />, to: "/statistics" },
    { label: "Help", icon: <FaQuestionCircle />, to: "/help" },
    { label: "Logout", icon: <IoLogOut />, to: "/logout" },
  ];

  const handleLogout = () => {
    // Remove the token
    Cookies.remove("tokenTeacher");

    // Redirect to the login page
    window.location.href = "/";
  };

  const token = Cookies.get("tokenTeacher");
  const user = jwtDecode(token);

  return (
    <div className="bg-gray-800 text-white p-4 flex-shrink-0 w-64">
      <ul className="ml-4">
        <li className="text-xl font-bold mb-4">Teacher E-LEARNING</li>
        <li className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full overflow-hidden mr-2">
            <img
              className="w-full h-full object-cover"
              src={user.avatar}
              alt="User"
            />
          </div>
          <p className="text-sm">{user.username}</p>
        </li>

        {links.map((link) => (
          <li className="mb-8" key={link.label}>
            {link.label === "Logout" ? (
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-300 hover:text-white"
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.label}
              </button>
            ) : (
              <Link
                to={link.to}
                className="flex items-center text-gray-300 hover:text-white"
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
