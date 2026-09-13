import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  GraduationCap,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onRegisterUser: (userData: { name: string; email: string; role: UserRole; password?: string }) => void;
  onLaunchTemporalLogin?: (role: UserRole, durationMinutes: number) => void;
  onCancel?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  users,
  onLoginSuccess,
  onRegisterUser,
  onLaunchTemporalLogin,
  onCancel
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'temporal' | 'forgot'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');

  // Temporal login state
  const [tempRole, setTempRole] = useState<UserRole>('student');
  const [tempDuration, setTempDuration] = useState<number>(60); // 60 minutes default

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailClean = loginEmail.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === emailClean);

    if (!foundUser) {
      setErrorMessage('No user found with this email address. Please register or select a demo account.');
      return;
    }

    if (foundUser.status === 'inactive') {
      setErrorMessage('This account has been deactivated by an administrator. Please contact IT support.');
      return;
    }

    onLoginSuccess(foundUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Please fill in your full name and email address.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setErrorMessage('An account with this email already exists. Please sign in instead.');
      return;
    }

    onRegisterUser({
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      password: regPassword
    });

    setSuccessMessage('Account registered successfully! Logging you in...');
  };

  const handleQuickDemoLogin = (email: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      onLoginSuccess(foundUser);
    }
  };

  const handleLaunchTemporal = (roleToLaunch: UserRole = tempRole, mins: number = tempDuration) => {
    if (onLaunchTemporalLogin) {
      onLaunchTemporalLogin(roleToLaunch, mins);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 p-6 text-center text-white relative">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-3 text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-heading">
            {tab === 'login'
              ? 'Sign In to LMS'
              : tab === 'register'
              ? 'Create New Account'
              : tab === 'temporal'
              ? 'Instant Temporal Access'
              : 'Password Recovery'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Google Apps Script & Sheets Powered Academic Portal
          </p>

          {/* Privacy Guarantee Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Peer-to-Peer Anonymity Active — Real identities masked</span>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs"
            >
              ✕ Close
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center transition-colors ${
              tab === 'login'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('temporal');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'temporal'
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Temporal Login</span>
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center transition-colors ${
              tab === 'register'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TEMPORAL LOGIN TAB */}
          {tab === 'temporal' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  Ephemeral & Anonymous Guest Session
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-800/90">
                  Instantly enter the LMS without an email or permanent password. All your actions will be masked under an auto-generated anonymous alias (e.g. <em>Temp Scholar #...</em>) to ensure total privacy among peers.
                </p>
              </div>

              {/* Step 1: Select Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Temporal Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTempRole('student')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      tempRole === 'student'
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <GraduationCap className="w-4 h-4" />
                      Student
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Learn & take quizzes anonymously
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempRole('lecturer')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      tempRole === 'lecturer'
                        ? 'border-purple-500 bg-purple-50/80 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                      <BookOpen className="w-4 h-4" />
                      Lecturer
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Author courses & blind grade
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempRole('admin')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      tempRole === 'admin'
                        ? 'border-amber-500 bg-amber-50/80 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                      <Shield className="w-4 h-4" />
                      Admin
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Audit system & review logs
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Select Duration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Session Expiration Window
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '30 Mins', mins: 30 },
                    { label: '1 Hour', mins: 60 },
                    { label: '2 Hours', mins: 120 },
                    { label: '24 Hours', mins: 1440 }
                  ].map(d => (
                    <button
                      key={d.mins}
                      type="button"
                      onClick={() => setTempDuration(d.mins)}
                      className={`py-2 px-2 text-center text-xs font-bold rounded-lg border transition-colors ${
                        tempDuration === d.mins
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Launch Button */}
              <button
                type="button"
                onClick={() => handleLaunchTemporal(tempRole, tempDuration)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Launch {tempDuration >= 60 ? `${tempDuration / 60}h` : `${tempDuration}m`} Temporal {tempRole.toUpperCase()} Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Fast 1-Click Preset Links */}
              <div className="pt-3 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Quick 1-Hour Presets
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleLaunchTemporal('student', 60)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 text-[11px] font-bold transition-colors"
                  >
                    Guest Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLaunchTemporal('lecturer', 60)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 text-[11px] font-bold transition-colors"
                  >
                    Guest Lecturer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLaunchTemporal('admin', 60)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 text-[11px] font-bold transition-colors"
                  >
                    Guest Auditor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIGN IN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="student@lms.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Temporal Access Callout */}
              <div
                onClick={() => setTab('temporal')}
                className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 cursor-pointer hover:border-emerald-300 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Need a Quick Anonymous Pass?</div>
                    <div className="text-[10px] text-slate-500">No registration needed • 1-click temporal session</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  Temporal &rarr;
                </span>
              </div>

              {/* Quick Demo Access */}
              <div className="pt-3 border-t border-slate-200">
                <div className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Pre-Configured Demo Accounts
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('student@lms.edu')}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
                      <BookOpen className="w-3 h-3" />
                      Student
                    </div>
                    <div className="text-[10px] text-slate-700 font-semibold truncate">Alex Rivera</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">Anon Scholar #482</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('lecturer@lms.edu')}
                    className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700">
                      <UserIcon className="w-3 h-3" />
                      Lecturer
                    </div>
                    <div className="text-[10px] text-slate-700 font-semibold truncate">Prof. Chen</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">Anon Instructor #319</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin@lms.edu')}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                      <Shield className="w-3 h-3" />
                      Admin
                    </div>
                    <div className="text-[10px] text-slate-700 font-semibold truncate">Dr. Jenkins</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">Anon Proctor #105</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTER TAB */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (Private to You)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Protected by peer anonymity: other students will only see your anonymous alias.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="jordan.smith@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                      regRole === 'student'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('lecturer')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                      regRole === 'lecturer'
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Lecturer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create LMS Account</span>
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD TAB */}
          {tab === 'forgot' && (
            <div className="space-y-4 text-center py-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your university email address. A password reset token and verification link will be generated in accordance with campus security policies.
              </p>
              <input
                type="email"
                placeholder="registered.email@university.edu"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage('Reset instructions sent to your institutional email.');
                  setTab('login');
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-xs text-slate-500 hover:underline block mx-auto"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
