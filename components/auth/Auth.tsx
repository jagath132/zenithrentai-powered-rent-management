
import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';

type AuthView = 'login' | 'signup' | 'forgotPassword';

const Auth: React.FC = () => {
    const [view, setView] = useState<AuthView>('login');

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden m-4">
                {/* Branding Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-gradient-to-br from-primary to-secondary text-white">
                    <h1 className="text-4xl font-bold mb-4">ZenithRent</h1>
                    <p className="text-lg text-center">Your complete solution for modern rent management.</p>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    {view === 'login' && <Login onToggleView={() => setView('signup')} onForgotPassword={() => setView('forgotPassword')} />}
                    {view === 'signup' && <SignUp onToggleView={() => setView('login')} />}
                    {view === 'forgotPassword' && <ForgotPassword onBackToLogin={() => setView('login')} />}
                </div>
            </div>
        </div>
    );
};

export default Auth;