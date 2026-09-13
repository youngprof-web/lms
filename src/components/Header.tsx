import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import {
  Menu,
  BookOpen,
  Shield,
  GraduationCap,
  Users,
  Code,
  LogOut,
  UserCircle,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
  Info,
  X,
  Zap
} from 'lucide-react';
import { calculateTemporalRemainingTime } from '../utils/anonymity';

interface HeaderProps {
  currentUser: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  onRoleChange: (role: UserRole) => void;
  activeTab: 'lms' | 'gas';
  onTabChange: (tab: 'lms' | 'gas') => void;
  onToggleSidebar: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isAuditUnmaskMode?: boolean;
  onToggleAuditUnmask?: () => void;
  onExtendTemporalSession?: (extraMinutes: number) => void;
  onLaunchTemporalLogin?: (role: UserRole, durationMinutes: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  isAuthenticated,
  onRoleChange,
  activeTab,
  onTabChange,
  onToggleSidebar,
  onNavigate,
  onLogout,
  isAuditUnmaskMode = false,
  onToggleAuditUnmask,
  onExtendTemporalSession,
  onLaunchTemporalLogin
}) => {
  const [showAnonymityModal, setShowAnonymityModal] = useState(false);
  const [temporalState, setTemporalState] = useState<{
    formatted: string;
    isExpired: boolean;
    secondsRemaining: number;
  }>({ formatted: '', isExpired: false, secondsRemaining: Infinity });

  // Live timer for temporal sessions
  useEffect(() => {
    if (!currentUser?.isTemporal || !currentUser.temporalExpiresAt) return;

    const updateTimer = () => {
      const res = calculateTemporalRemainingTime(currentUser.temporalExpiresAt);
      setTemporalState(res);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentUser?.isTemporal, currentUser?.temporalExpiresAt]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 shadow-xs">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">Cloud LMS</span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Apps Script + Sheets
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Mode Switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onTabChange('lms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'lms'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Interactive LMS
          </button>
          <button
            onClick={() => onTabChange('gas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'gas'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            GAS Scripts & Deploy
          </button>
        </div>

        {/* Right: Anonymity Status, Temporal Timer, Role Switcher, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Anonymity Shield Indicator Button */}
          <button
            onClick={() => setShowAnonymityModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-colors"
            title="Click to view peer anonymity details"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Anonymous Mode: Active</span>
            <span className="sm:hidden">Anon</span>
          </button>

          {/* Temporal Session Countdown Pill (if temporal user) */}
          {currentUser?.isTemporal && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${
                temporalState.isExpired
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
              title={`Temporal Guest Session: ${currentUser.temporalToken}`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-mono text-[11px]">
                {temporalState.isExpired ? 'Expired' : temporalState.formatted}
              </span>
              {onExtendTemporalSession && !temporalState.isExpired && (
                <button
                  onClick={() => onExtendTemporalSession(30)}
                  className="ml-1 px-1.5 py-0.5 rounded bg-amber-200/80 hover:bg-amber-300 text-[10px] font-bold text-amber-900 transition-colors"
                  title="Extend session by 30 minutes"
                >
                  +30m
                </button>
              )}
            </div>
          )}

          {/* Admin Audit Unmask Toggle */}
          {currentUser?.role === 'admin' && onToggleAuditUnmask && (
            <button
              onClick={onToggleAuditUnmask}
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                isAuditUnmaskMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle compliance unmask mode for administrative audits"
            >
              {isAuditUnmaskMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isAuditUnmaskMode ? 'Audit: Unmasked' : 'Audit: Masked'}</span>
            </button>
          )}

          {/* Quick Temporal Pass Button if not temporal */}
          {!currentUser?.isTemporal && onLaunchTemporalLogin && (
            <button
              onClick={() => onLaunchTemporalLogin('student', 60)}
              className="hidden 2xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-colors"
              title="Spawn a temporary 1-hour disposable student session"
            >
              <Zap className="w-3 h-3 text-indigo-600" />
              <span>Temporal Pass</span>
            </button>
          )}

          {isAuthenticated && currentUser ? (
            <>
              {/* Quick Role Switcher Pill */}
              <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() => onRoleChange('student')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                    currentRole === 'student' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Student Role"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Student</span>
                </button>
                <button
                  onClick={() => onRoleChange('lecturer')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                    currentRole === 'lecturer' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Lecturer Role"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Lecturer</span>
                </button>
                <button
                  onClick={() => onRoleChange('admin')}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                    currentRole === 'admin' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Admin Role"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Admin</span>
                </button>
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                    <span>{currentUser.anonymousAlias || currentUser.name}</span>
                    {currentUser.isTemporal && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-amber-100 text-amber-800 border border-amber-300">
                        Temp
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                    {currentUser.name} • {currentRole}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <UserCircle className="w-4 h-4" />
              <span>Sign In / Temporal</span>
            </button>
          )}
        </div>
      </header>

      {/* ANONYMITY INFORMATION MODAL */}
      {showAnonymityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-slate-900">
                    Peer Anonymity & Privacy Protocol
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Active across all courses, submissions, messaging, and rosters.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAnonymityModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              {currentUser && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Your Identity Representation
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {currentUser.anonymousAlias || 'Anon Scholar'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Public alias visible to all other students & peers
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-[10px]">Private (You only):</div>
                      <div className="font-semibold text-slate-700">{currentUser.name}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    1
                  </div>
                  <p>
                    <strong className="text-slate-900">Bias-Free Anonymous Grading:</strong> Lecturers grade submissions blind. Student work is labeled solely by anonymous alias and student code.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    2
                  </div>
                  <p>
                    <strong className="text-slate-900">Peer Masking:</strong> In discussion boards, announcements, rosters, and direct messages, student and lecturer real emails and names are masked to peers.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    3
                  </div>
                  <p>
                    <strong className="text-slate-900">Temporal Sessions Supported:</strong> Any user can join with an ephemeral, disposable login pass with no permanent account needed.
                  </p>
                </div>
              </div>

              {currentUser?.isTemporal && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                  <strong>Current Temporal Pass:</strong> {currentUser.temporalToken}
                  <div className="text-[11px] mt-0.5">
                    Expires at: {currentUser.temporalExpiresAt ? new Date(currentUser.temporalExpiresAt).toLocaleTimeString() : 'N/A'} ({temporalState.formatted})
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAnonymityModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
