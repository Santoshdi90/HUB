'use client';

import { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-700' };
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-amber-500 text-amber-700' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500 text-emerald-700' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Admin password updated successfully! Future logins require your new password.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Server error while updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-3xl border border-gray-100 shadow-soft space-y-6">
      
      <div>
        <h3 className="text-xl font-bold font-serif text-forest-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> Admin Profile & Password Security
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Update the administrator authentication password. Passwords are server-side hashed using bcryptjs.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Current Password *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* New Password & Strength Meter */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            New Password *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
            <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          </div>

          {newPassword && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-gray-500">Password Strength:</span>
                <span className={strength.color.split(' ')[1]}>{strength.label}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 ${strength.score >= 1 ? 'bg-red-500' : 'bg-gray-200'}`} />
                <div className={`h-full flex-1 ${strength.score >= 2 ? 'bg-amber-500' : 'bg-gray-200'}`} />
                <div className={`h-full flex-1 ${strength.score >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
            <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Updating Password...' : 'Save New Admin Password'}
          </button>
        </div>

      </form>

    </div>
  );
}
