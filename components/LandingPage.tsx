import React from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  console.log("LandingPage rendered");
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-pulse">
              ZenithRent
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              AI-Powered Rent Management Made Simple. Streamline your property
              management with intelligent automation and insights.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400 rounded-full opacity-70 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-400 rounded-full opacity-70 animate-bounce delay-500"></div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose ZenithRent?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
              <p>
                Get intelligent recommendations for rent pricing, tenant
                screening, and maintenance scheduling.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Automated Workflows</h3>
              <p>
                Automate rent collection, lease renewals, and maintenance
                requests with smart notifications.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
              <p>
                Track your portfolio performance with detailed analytics and
                customizable dashboards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Rent Management?
          </h2>
          <p className="text-xl text-white mb-8">
            Join thousands of property managers who trust ZenithRent for their
            rental business.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Your Free Trial
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 ZenithRent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
