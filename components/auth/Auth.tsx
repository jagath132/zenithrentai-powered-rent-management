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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden m-4">
        {/* Branding Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-gradient-to-br from-primary to-secondary text-white">
          <h1 className="text-4xl font-bold mb-4">ZenithRent</h1>
          <p className="text-lg text-center">
            Your complete solution for modern rent management.
          </p>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Email Confirmed!
              </h3>
              <button
                onClick={() => setShowConfirmationPopup(false)}
                className="text-gray-400 hover:text-gray-600"
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
            <p className="text-gray-600 mb-4">
              Successfully confirmed your email. You are now ready to login with
              your credentials.
            </p>
            <button
              onClick={() => setShowConfirmationPopup(false)}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
