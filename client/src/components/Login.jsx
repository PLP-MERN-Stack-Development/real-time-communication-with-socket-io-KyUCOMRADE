import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      // ✅ Pass correct values to AuthContext
      login(res.data.username, res.data.token);

      // ✅ Optional: callback after success
      if (onLoginSuccess) onLoginSuccess();

      alert("Login successful!");
    } catch (err) {
      console.error("Login failed:", err);
      const message =
        err.response?.data?.message || "An unexpected error occurred.";
      alert("Login failed: " + message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
