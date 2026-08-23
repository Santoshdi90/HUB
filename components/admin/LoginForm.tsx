'use client';

import { useState } from 'react';
import { User, KeyRound, AlertCircle, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import Image from 'next/image';

interface LoginFormProps {
  logoUrl: string;
  nurseryName: string;
  onSuccess: () => void;
}

export default function LoginForm({ logoUrl, nurseryName, onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#081c15] via-[#1B4332] to-[#2D6A4F] p-4 text-white">
      <div className="w-full max-w-md bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl p-8 border border-emerald-800/40">
        
        {/* Header Branding */}
        <div className="text-center space-y-3 mb-8">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-emerald-500 bg-white p-1 shadow-lg">
            <Image
              src={logoUrl}
              alt={nurseryName}
              fill
              className="object-cover rounded-full p-1"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-serif text-forest-900">
              Admin Portal
            </h1>
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">
              {nurseryName}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
              <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Rate-Limited & Encrypted Authentication
          </div>
        </div>

      </div>
    </div>
  );
}
