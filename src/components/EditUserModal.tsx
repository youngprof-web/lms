import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, CheckCircle2, User as UserIcon, Mail, Shield } from 'lucide-react';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<'active' | 'inactive'>(user.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      ...user,
      name: name.trim(),
      email: email.trim(),
      role,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <UserIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">Edit User Account</h3>
              <p className="text-xs text-slate-500">Update identity, permissions, and status</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">User Role (Manage Roles)</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  status === 'inactive'
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Deactivated
              </button>
            </div>
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
              <CheckCircle2 className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
