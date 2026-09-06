import React from "react";
import {useNavigate} from "react-router-dom";
import {
  FaCode,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";

import "./Navbar.css";

function Navbar({title = "AI Code Review"}) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <div className="navbar-icon">
          <FaCode />
        </div>

        <div>
          <h2>
            {title}
          </h2>

          <p>
            AI-powered code analysis
          </p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <FaUserCircle />

          <div>
            <span>
              Welcome
            </span>

            <strong>
              {user.name || "User"}
            </strong>
          </div>
        </div>

        <button
          className="navbar-logout"
          onClick={handleLogout}
          title="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;