import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaSignOutAlt,
  FaSave
} from "react-icons/fa";

import {
  getCurrentUser,
  updateProfile
} from "../../services/api";

import "./Settings.css";

function Settings() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();

        setUser(data);
        setName(data.name);

        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );
      } catch (error) {
        console.error("Profile error:", error);

        setError(
          "Unable to load account information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    if (name.trim().length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedUser =
        await updateProfile({
          name: name.trim()
        });

      setUser(updatedUser);
      setName(updatedUser.name);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-message">
          Loading account...
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <Link
          to="/"
          className="settings-back"
        >
          <FaArrowLeft />
          Dashboard
        </Link>

        <div className="settings-heading">
          <div>
            <h1>
              Account Settings
            </h1>

            <p>
              Manage your CodeAI account
            </p>
          </div>

          <div className="profile-avatar">
            <FaUser />
          </div>
        </div>

        {
          error && (
            <div className="settings-error">
              {error}
            </div>
          )
        }

        {
          success && (
            <div className="settings-success">
              {success}
            </div>
          )
        }

        {
          user && (
            <div className="settings-card">
              <h2>
                Profile
              </h2>

              <div className="profile-field editable">
                <div className="profile-field-icon">
                  <FaUser />
                </div>

                <div className="profile-field-content">
                  <span>
                    Name
                  </span>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="profile-field">
                <div className="profile-field-icon">
                  <FaEnvelope />
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {user.email}
                  </strong>
                </div>
              </div>

              <div className="profile-field">
                <div className="profile-field-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <span>
                    Account Security
                  </span>

                  <strong>
                    JWT Protected
                  </strong>
                </div>
              </div>

              <button
                className="settings-save"
                onClick={handleSave}
                disabled={saving}
              >
                <FaSave />
                {
                  saving
                    ? "Saving..."
                    : "Save Changes"
                }
              </button>
            </div>
          )
        }

        <div className="settings-card">
          <h2>
            Session
          </h2>

          <p className="settings-description">
            Signing out will remove your current authentication session from this device.
          </p>

          <button
            className="settings-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;