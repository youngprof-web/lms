import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { X, UserPlus, Shield, Mail, User as UserIcon, Lock } from 'lucide-react';

interface AddUserModalProps {
  onClose: () => void;
  onAddUser: (userData: Omit<User, 'id' | 'joined'>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [password, setPassword] = useState('Welcome@2025');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      status: 'active',
      password,
      avatar:
        role === 'student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : role === 'lecturer'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <UserPlus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">Add New User</h3>
              <p className="text-xs text-slate-500">Create account in Google Sheets Users database</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Dr. Eleanor Vance"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="eleanor.vance@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="student">Student (Course access, quiz/assignment submissions)</option>
              <option value="lecturer">Lecturer (Course creation, grading, announcements)</option>
              <option value="admin">Administrator (System config, users, approval, backup)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-700"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">User can change their password upon first sign in.</p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
