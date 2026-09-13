import React from 'react';
import { Course, UserRole } from '../types';
import { BookOpen, Sparkles, Server, Smartphone, Cloud, ArrowRight, ShieldCheck, CheckCircle2, PlayCircle } from 'lucide-react';

interface LandingViewProps {
  courses: Course[];
  onNavigate: (view: string) => void;
  onSelectCourse: (courseId: string) => void;
  onSwitchRole: (role: UserRole) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  courses,
  onNavigate,
  onSelectCourse,
  onSwitchRole
}) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Google Apps Script & Sheets Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
            Accessible, Cloud-Powered Learning for Everyone
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A full-featured educational platform built on Google Apps Script Web App, storing relational data in Google Sheets and lecture materials directly inside Google Drive. Completely serverless, zero hosting costs, and mobile-optimized.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('catalog')}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Browse Course Catalog
            </button>
            <button
              onClick={() => onNavigate('studentDashboard')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 transition-all flex items-center gap-2"
            >
              Open Student Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base mb-1">Google Apps Script</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Backend logic runs on Google infrastructure via <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono text-xs">google.script.run</code> with asynchronous execution.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Cloud className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base mb-1">Google Sheets DB</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            15 relational sheets for users, courses, modules, lessons, quizzes, grades, announcements, and audit logs.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base mb-1">Mobile Responsive</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mobile-first CSS layout with slide-out navigation, responsive touch controls, and accessible typography.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base mb-1">Role-Based Access</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Distinct workspaces for Students (learn & quiz), Lecturers (curriculum & grading), and Administrators.
          </p>
        </div>
      </div>

      {/* Featured Courses Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Featured Curricula</h2>
            <p className="text-xs sm:text-sm text-slate-500">Curated academic courses with video lectures, reading modules, and quizzes.</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Courses ({courses.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-white/95 text-blue-700 shadow-xs">
                    {course.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-900/80 text-white">
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{course.code} • {course.duration}</div>
                  <h3 className="font-heading font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Lecturer: <span className="font-medium text-slate-800">{course.lecturerName}</span>
                  </div>
                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    Enter Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Test Persona Switcher Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="max-w-2xl">
          <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg mb-1">
            Test All Three User Roles in Real Time
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
            Switch your active persona instantly using the buttons below or the header selector to test role-based views and permissions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                onSwitchRole('student');
                onNavigate('studentDashboard');
              }}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1 group-hover:text-emerald-600">
                <span>👨‍🎓</span> Student Role
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Study lessons, download PDF notes from Drive, submit assignments, take scored quizzes.
              </p>
            </button>

            <button
              onClick={() => {
                onSwitchRole('lecturer');
                onNavigate('lecturerStudio');
              }}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600">
                <span>👨‍🏫</span> Lecturer Role
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Create & edit courses, upload learning materials, grade submissions, publish results.
              </p>
            </button>

            <button
              onClick={() => {
                onSwitchRole('admin');
                onNavigate('adminDashboard');
              }}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-500 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-600">
                <span>🛡️</span> Administrator
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Manage user accounts, deactivate users, reset passwords, export Sheets database tables to CSV.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
