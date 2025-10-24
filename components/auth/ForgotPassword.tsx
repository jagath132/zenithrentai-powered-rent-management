
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface ForgotPasswordProps {
    onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
    const { sendPasswordResetEmail } = useAppContext();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await sendPasswordResetEmail(email);
            setMessage('If an account with this email exists, a password reset link has been sent.');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Reset Password</h2>
            <p className="text-gray-600 mb-8">Enter your email address and we will send you a link to reset your password.</p>
            
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
            {message && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{message}</p>}
            
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
                    <button
                        type="submit"
                        disabled={loading || !!message}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <button onClick={onBackToLogin} className="font-medium text-primary hover:text-primary-dark">
                    Back to Sign In
                </button>
            </p>
        </div>
    );
};

export default ForgotPassword;
