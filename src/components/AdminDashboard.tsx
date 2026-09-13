import React, { useState } from 'react';
import { User, ActivityLog, Course, Enrollment, UserRole } from '../types';
import {
  Shield,
  Users,
  Database,
  FileSpreadsheet,
  Download,
  Plus,
  KeyRound,
  UserCheck,
  UserX,
  Edit2,
  Trash2,
  Check,
  HardDrive,
  BarChart3,
  Bell,
  Settings,
  GraduationCap,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  logs: ActivityLog[];
  onNavigate: (view: string) => void;
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onToggleUserStatus: (userId: string) => void;
  onResetUserPassword: (userId: string) => void;
  onManageRole: (userId: string, newRole: UserRole) => void;
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onApproveCourse: (courseId: string) => void;
  onBackupData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  courses,
  enrollments,
  logs,
  onNavigate,
  onAddUser,
  onEditUser,
  onToggleUserStatus,
  onResetUserPassword,
  onManageRole,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onApproveCourse,
  onBackupData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'courses' | 'logs'>('overview');

  const pendingCourses = courses.filter(c => c.status === 'pending');

  const handleExportCSV = (tableName: string) => {
    let csvContent = '';
    let filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.csv`;

    if (tableName === 'Users') {
      csvContent = 'ID,Name,Email,Role,Status,Joined\n' +
        users.map(u => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${u.joined}"`).join('\n');
    } else if (tableName === 'Enrollments') {
      csvContent = 'ID,StudentId,CourseId,ProgressPercentage,Status\n' +
        enrollments.map(e => `"${e.id}","${e.studentId}","${e.courseId}",${e.progressPercentage},"${e.status}"`).join('\n');
    } else if (tableName === 'Courses') {
      csvContent = 'ID,Code,Title,Category,Level,Lecturer,Status\n' +
        courses.map(c => `"${c.id}","${c.code}","${c.title}","${c.category}","${c.level}","${c.lecturerName}","${c.status}"`).join('\n');
    } else {
      csvContent = 'ID,Timestamp,User,Action,Details\n' +
        logs.map(l => `"${l.id}","${l.timestamp}","${l.userName}","${l.action}","${l.details}"`).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
            System Administrator Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">
            Institutional Oversight & Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage users, approve course offerings, review enrollments, configure settings, and backup data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onBackupData}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            Backup Data
          </button>
          <button
            onClick={onAddUser}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add User
          </button>
          <button
            onClick={onAddCourse}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Course
          </button>
        </div>
      </div>

      {/* Administration Quick Access Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onNavigate('users')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs text-left transition-all group"
        >
          <Users className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-slate-900">Manage Users</div>
          <div className="text-[10px] text-slate-500">Add, Edit, Roles</div>
        </button>

        <button
          onClick={() => onNavigate('courses')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs text-left transition-all group"
        >
          <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-slate-900">Manage Courses</div>
          <div className="text-[10px] text-slate-500">Edit, Approve, Delete</div>
        </button>

        <button
          onClick={() => onNavigate('enrollments')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-xs text-left transition-all group"
        >
          <GraduationCap className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-slate-900">Enrollments</div>
          <div className="text-[10px] text-slate-500">Rosters & Progress</div>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs text-left transition-all group"
        >
          <BarChart3 className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-slate-900">View Reports</div>
          <div className="text-[10px] text-slate-500">Metrics & Export</div>
        </button>

        <button
          onClick={() => onNavigate('announcements')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xs text-left transition-all group"
        >
          <Bell className="w-5 h-5 text-cyan-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-slate-900">Announcements</div>
          <div className="text-[10px] text-slate-500">Publish Notices</div>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs text-left transition-all group"
        >
          <Settings className="w-5 h-5 text-slate-700 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-slate-900">Settings & Backup</div>
          <div className="text-[10px] text-slate-500">Drive & Sheets</div>
        </button>
      </div>

      {/* Pending Courses Approval Alert (if any) */}
      {pendingCourses.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <strong className="text-xs sm:text-sm text-amber-900 font-bold">
                {pendingCourses.length} Course(s) Pending Administrator Approval
              </strong>
              <p className="text-xs text-amber-700">
                Lecturers have submitted new curricula requiring syllabus review before publication.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold self-start sm:self-auto"
          >
            Review Courses
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{users.length}</div>
            <div className="text-xs font-semibold text-slate-500">Registered Accounts</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{courses.length}</div>
            <div className="text-xs font-semibold text-slate-500">Curricula ({pendingCourses.length} pending)</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{enrollments.length}</div>
            <div className="text-xs font-semibold text-slate-500">Active Enrollments</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">15 Tables</div>
            <div className="text-xs font-semibold text-slate-500">Google Sheets DB</div>
          </div>
        </div>
      </div>

      {/* User Accounts Roster */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-slate-900 text-base">User Accounts Management</h2>
            <p className="text-xs text-slate-500">Add, edit, change roles, deactivate, and reset passwords</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExportCSV('Users')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={() => onNavigate('users')}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
            >
              Full Roster →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.slice(0, 6).map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : u.role === 'lecturer'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {u.role}
                      </span>
                      <select
                        value={u.role}
                        onChange={e => onManageRole(u.id, e.target.value as UserRole)}
                        className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-600 focus:outline-none"
                        title="Manage Role"
                      >
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{u.joined}</td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => onEditUser(u)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Edit User"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onResetUserPassword(u.id)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                      title="Reset Password"
                    >
                      Reset Pass
                    </button>
                    <button
                      onClick={() => onToggleUserStatus(u.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        u.status === 'active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs & Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-slate-900 text-base">Activity Logs & Audit Trail</h2>
            <p className="text-xs text-slate-500">Synchronized with the <code className="text-blue-600 font-mono">ActivityLogs</code> Google Sheet.</p>
          </div>
          <button
            onClick={() => handleExportCSV('ActivityLogs')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Logs CSV
          </button>
        </div>

        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.slice(0, 8).map(l => (
                <tr key={l.id} className="hover:bg-slate-50/70">
                  <td className="py-2 px-4 text-slate-500">{l.timestamp}</td>
                  <td className="py-2 px-4 font-bold text-slate-900">{l.userName}</td>
                  <td className="py-2 px-4 text-blue-600">{l.action}</td>
                  <td className="py-2 px-4 text-slate-600 font-sans">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
