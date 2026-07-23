import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import { FileText } from 'lucide-react';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();
  const [view, setView] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FileText className="w-10 h-10 text-blue-600 animate-pulse" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return view === 'login' ? (
      <LoginPage onSwitchToSignup={() => setView('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setView('login')} />
    );
  }

  return <>{children}</>;
};

export default AuthGate;
