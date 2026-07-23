import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { AuthLayout, FormField, ErrorBanner } from './LoginPage';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start customizing your PDFs in seconds">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          icon={<User className="w-4 h-4" />}
          label="Full name"
          type="text"
          value={fullName}
          onChange={setFullName}
          placeholder="Jane Doe"
          required
        />
        <FormField
          icon={<Mail className="w-4 h-4" />}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
        />
        <FormField
          icon={<Lock className="w-4 h-4" />}
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 6 characters"
          required
        />

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Sign up'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
