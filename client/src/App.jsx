import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatRoom from "./components/ChatRoom";
import { motion, AnimatePresence } from "framer-motion";

const AppContent = () => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="auth-container">
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div
            key="chatroom"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ChatRoom />
          </motion.div>
        ) : showRegister ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Register onRegisterSuccess={() => setShowRegister(false)} />
            <p>
              Already have an account?{" "}
              <button onClick={() => setShowRegister(false)}>Login</button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Login />
            <p>
              Don't have an account?{" "}
              <button onClick={() => setShowRegister(true)}>Register</button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
