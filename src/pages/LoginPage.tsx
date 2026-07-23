import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to customize your PDFs">
      <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="••••••••"
          required
        />

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

export const AuthLayout: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
    <div className="flex items-center gap-3 mb-8">
      <FileText className="w-9 h-9 text-blue-600" />
      <h1 className="text-2xl font-bold text-gray-900">PDF Customizer</h1>
    </div>
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
      {children}
    </div>
  </div>
);

export const FormField: React.FC<{
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ icon, label, type, value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
    </div>
  </div>
);

export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
    {message}
  </div>
);
