// src/components/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loggedInUser = await login(username, password);

    if (loggedInUser) {
      console.log("🔓 Redirecting to chat...");
      if (onLoginSuccess) onLoginSuccess();
    } else {
      alert(error || "Login failed, please check credentials.");
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
