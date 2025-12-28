import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

type AuthView = "login" | "signup" | "forgotPassword";

const Auth: React.FC = () => {
  const { currentUser } = useAppContext();
  const [view, setView] = useState<AuthView>("login");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("confirmed") === "true") {
      setShowConfirmationPopup(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // If user is already authenticated, they shouldn't be on the auth page
  // This handles the case where user verifies email and gets auto-signed in
  if (currentUser) {
    return null; // App.tsx will handle showing the main app
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ZenithRent</h1>
          <p className="text-blue-100 text-sm">AI-Powered Rent Management</p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {view === "login" && (
            <Login
              onToggleView={() => setView("signup")}
              onForgotPassword={() => setView("forgotPassword")}
            />
          )}
          {view === "signup" && (
            <SignUp onToggleView={() => setView("login")} />
          )}
          {view === "forgotPassword" && (
            <ForgotPassword onBackToLogin={() => setView("login")} />
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Email Confirmed!
              </h3>
              <button
                onClick={() => setShowConfirmationPopup(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-6 text-center">
              Successfully confirmed your email. You are now ready to login with
              your credentials.
            </p>
            <button
              onClick={() => setShowConfirmationPopup(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
