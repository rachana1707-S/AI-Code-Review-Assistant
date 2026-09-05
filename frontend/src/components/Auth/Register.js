import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock
} from "react-icons/fa";

import {
  registerUser,
  loginUser
} from "../../services/api";

import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password
      });

      const loginData = await loginUser({
        email: email.trim(),
        password
      });

      localStorage.setItem(
        "token",
        loginData.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(loginData.user)
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          🤖 CodeAI
        </div>

        <h1>
          Create Account
        </h1>

        <p className="auth-subtitle">
          Start analyzing your code with AI
        </p>

        {
          error && (
            <div className="auth-error">
              {error}
            </div>
          )
        }

        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <FaUser />

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </div>

          <div className="auth-input">
            <FaEnvelope />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="auth-input">
            <FaLock />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength="8"
              required
            />
          </div>

          <div className="auth-input">
            <FaLock />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              minLength="8"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {
              loading
                ? "Creating account..."
                : "Create Account"
            }
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;