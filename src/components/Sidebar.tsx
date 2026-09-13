import React from 'react';
import { User, UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  FileCheck,
  Award,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  X,
  PlusCircle,
  Shield,
  MessageSquare,
  Home,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  currentRole: UserRole;
  currentUser: User | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onNewCourse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  currentRole,
  currentUser,
  onNavigate,
  onLogout,
  onNewCourse
}) => {
  const handleItemClick = (view: string) => {
    onNavigate(view);
    onClose();
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      roles: ['admin', 'lecturer']
    },
    {
      id: 'students',
      label: 'Students',
      icon: GraduationCap,
      roles: ['admin', 'lecturer', 'student']
    },
    {
      id: 'lecturers',
      label: 'Lecturers',
      icon: Briefcase,
      roles: ['admin', 'lecturer', 'student']
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'enrollments',
      label: 'Enrollments',
      icon: FileCheck,
      roles: ['admin', 'lecturer', 'student']
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: Award,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      roles: ['admin', 'lecturer']
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Bell,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      roles: ['admin']
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              🎓
            </div>
            <div>
              <span className="font-heading font-extrabold text-white text-base tracking-tight block leading-none">
                GAS LMS
              </span>
              <span className="text-[10px] text-blue-400 font-mono tracking-wider uppercase font-semibold">
                Cloud Web App
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Main Navigation
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            // Map dashboard to role dashboard if needed
            let targetView = item.id;
            if (item.id === 'dashboard') {
              if (currentRole === 'student') targetView = 'studentDashboard';
              else if (currentRole === 'lecturer') targetView = 'lecturerStudio';
              else if (currentRole === 'admin') targetView = 'adminDashboard';
            }

            const isActive =
              currentView === targetView ||
              (item.id === 'dashboard' &&
                (currentView === 'studentDashboard' ||
                  currentView === 'lecturerStudio' ||
                  currentView === 'adminDashboard'));

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(targetView)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Quick Messages view */}
          <button
            onClick={() => handleItemClick('messages')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              currentView === 'messages'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="truncate">Messages</span>
          </button>

          {/* New Course Action for Lecturers and Admins */}
          {onNewCourse && (currentRole === 'lecturer' || currentRole === 'admin') && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onNewCourse();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition-colors"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">Create Course</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Footer: User Info & Logout Button */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0 space-y-2">
          {currentUser ? (
            <>
              <div className="flex items-center gap-3 px-2 py-1">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <div className="overflow-hidden flex-1">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                    <span>{currentUser.anonymousAlias || currentUser.name}</span>
                    {currentUser.isTemporal && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-amber-900/60 text-amber-300 border border-amber-700/60">
                        Temp
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentUser.name} • <span className="capitalize">{currentRole}</span>
                  </div>
                </div>
              </div>

              {/* Anonymity Status Pill in Sidebar */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Peer Anonymity Active
                </span>
                {currentUser.isTemporal && (
                  <span className="flex items-center gap-1 text-amber-400 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Guest
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 border border-rose-900/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => handleItemClick('login')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
