
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface LoginProps {
    onToggleView: () => void;
    onForgotPassword: () => void;
}

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542-7 .847 0 1.668.118 2.457.339M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l20 20" /></svg>;

const Login: React.FC<LoginProps> = ({ onToggleView, onForgotPassword }) => {
    const { login, resendVerificationEmail } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResendMessage('');
        setShowResendVerification(false);
        setLoading(true);
        try {
            await login({ email, password });
        } catch (err: any) {
             if (err.message.includes('Email not confirmed')) {
                setError('Please verify your email address before logging in.');
                setShowResendVerification(true);
            } else {
                setError(err.message || 'Failed to log in.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleResendVerification = async () => {
        setError('');
        setResendMessage('');
        try {
            await resendVerificationEmail(email);
            setResendMessage('A new verification email has been sent. Please check your inbox.');
            setShowResendVerification(false);
        } catch (err: any) {
            setError(err.message || 'Failed to resend verification email.');
        }
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
            <p className="text-gray-600 mb-8">Please sign in to continue.</p>
            
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                    <p>{error}</p>
                    {showResendVerification && (
                        <button
                            onClick={handleResendVerification}
                            className="font-semibold text-red-800 hover:underline mt-2 text-left w-full"
                        >
                            Resend verification email
                        </button>
                    )}
                </div>
            )}
            {resendMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{resendMessage}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            aria-label="Toggle password visibility"
                        >
                            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>
                 <div className="text-sm">
                    <button type="button" onClick={onForgotPassword} className="font-medium text-primary hover:text-primary-dark">
                        Forgot your password?
                    </button>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button onClick={onToggleView} className="font-medium text-primary hover:text-primary-dark">
                    Sign up
                </button>
            </p>
        </div>
    );
};

export default Login;