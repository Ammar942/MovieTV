import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-8 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold tracking-wide">Movie & TV Tracker</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="font-medium">{user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
