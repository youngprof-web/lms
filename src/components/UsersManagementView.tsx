import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  KeyRound,
  Shield,
  GraduationCap,
  Briefcase,
  UserCheck,
  UserX,
  Download,
  Filter,
  ShieldCheck,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { getPeerDisplayName, getPeerAvatar, maskEmail } from '../utils/anonymity';

interface UsersManagementViewProps {
  users: User[];
  currentUser?: User | null;
  isAuditUnmaskMode?: boolean;
  defaultRoleFilter?: 'all' | 'student' | 'lecturer' | 'admin';
  title?: string;
  subtitle?: string;
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onToggleStatus: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onManageRole: (userId: string, newRole: UserRole) => void;
}

export const UsersManagementView: React.FC<UsersManagementViewProps> = ({
  users,
  currentUser,
  isAuditUnmaskMode = false,
  defaultRoleFilter = 'all',
  title = 'User Accounts & Roles Management',
  subtitle = 'Directory of institutional accounts synchronized with the Google Sheets Users table with peer anonymity enforcement.',
  onAddUser,
  onEditUser,
  onToggleStatus,
  onResetPassword,
  onManageRole
}) => {
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'lecturer' | 'admin'>(defaultRoleFilter);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [temporalFilter, setTemporalFilter] = useState<'all' | 'temporal' | 'permanent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    if (temporalFilter === 'temporal' && !user.isTemporal) return false;
    if (temporalFilter === 'permanent' && user.isTemporal) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const aliasMatch = user.anonymousAlias?.toLowerCase().includes(q) || false;
      const nameMatch = user.name.toLowerCase().includes(q);
      const emailMatch = user.email.toLowerCase().includes(q);
      const idMatch = user.id.toLowerCase().includes(q);
      return aliasMatch || nameMatch || emailMatch || idMatch;
    }
    return true;
  });

  const handleExportCSV = () => {
    const csvContent =
      'ID,AnonymousAlias,Name,Email,Role,Status,IsTemporal,Joined\n' +
      filteredUsers
        .map(
          u =>
            `"${u.id}","${u.anonymousAlias || ''}","${isAuditUnmaskMode ? u.name : '[ANONYMIZED]'}","${
              isAuditUnmaskMode ? u.email : maskEmail(u.email)
            }","${u.role}","${u.status}","${u.isTemporal ? 'YES' : 'NO'}","${u.joined}"`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lms_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>{title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onAddUser}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Peer Anonymity & Compliance Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>Peer-to-Peer Anonymity Active</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                {isAuditUnmaskMode ? 'Audit Mode: Unmasked for Administrator' : 'Peers Masked'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Every student and instructor interacts under a secure alias to prevent evaluation bias and preserve individual student privacy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Temporal Logins:</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {users.filter(u => u.isTemporal).length} Active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by alias, real name, email, or user ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                roleFilter === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                roleFilter === 'student' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Students ({users.filter(u => u.role === 'student').length})
            </button>
            <button
              onClick={() => setRoleFilter('lecturer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                roleFilter === 'lecturer' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lecturers ({users.filter(u => u.role === 'lecturer').length})
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                roleFilter === 'admin' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admins ({users.filter(u => u.role === 'admin').length})
            </button>
          </div>

          {/* Temporal filter */}
          <select
            value={temporalFilter}
            onChange={e => setTemporalFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Accounts</option>
            <option value="permanent">Permanent Only</option>
            <option value="temporal">Temporal Pass Only</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User & Anonymous Alias</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Session Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No user accounts match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const isSelf = currentUser?.id === u.id;
                  const canSeeReal = isSelf || isAuditUnmaskMode;
                  const avatarSrc = getPeerAvatar(u, currentUser || null, isAuditUnmaskMode);
                  const displayPeerName = getPeerDisplayName(u, currentUser || null, isAuditUnmaskMode);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarSrc}
                            alt={u.anonymousAlias || u.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.anonymousAlias || displayPeerName}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              {canSeeReal ? (
                                <>
                                  <span className="font-medium text-slate-700">{u.name}</span>
                                  <span>•</span>
                                  <span className="font-mono">{u.email}</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-slate-400">Peer Masked:</span>
                                  <span className="font-mono text-slate-400">{maskEmail(u.email)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : u.role === 'lecturer'
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {u.role}
                          </span>
                          {/* Manage Roles Quick Selector */}
                          <select
                            value={u.role}
                            onChange={e => onManageRole(u.id, e.target.value as UserRole)}
                            className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-600 focus:outline-none"
                            title="Change user role"
                          >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {u.isTemporal ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Temporal Pass</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Permanent</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{u.joined}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Edit User Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onResetPassword(u.id)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reset Pass</span>
                          </button>
                          <button
                            onClick={() => onToggleStatus(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              u.status === 'active'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
