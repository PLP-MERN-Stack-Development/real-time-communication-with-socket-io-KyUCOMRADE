import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatRoom from "./components/ChatRoom";

const AppContent = () => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (user) return <ChatRoom />;

  return (
    <div className="auth-container">
      {showRegister ? (
        <>
          <Register onRegisterSuccess={() => setShowRegister(false)} />
          <p>
            Already have an account?{" "}
            <button onClick={() => setShowRegister(false)}>Login</button>
          </p>
        </>
      ) : (
        <>
          <Login />
          <p>
            Don't have an account?{" "}
            <button onClick={() => setShowRegister(true)}>Register</button>
          </p>
        </>
      )}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
