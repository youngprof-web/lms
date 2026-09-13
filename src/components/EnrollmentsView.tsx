import React, { useState } from 'react';
import { Enrollment, Course, User } from '../types';
import {
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  BookOpen,
  Filter,
  X,
  ShieldCheck
} from 'lucide-react';
import { maskEmail } from '../utils/anonymity';

interface EnrollmentsViewProps {
  enrollments: Enrollment[];
  courses: Course[];
  users: User[];
  isAuditUnmaskMode?: boolean;
  onAddEnrollment: (studentId: string, courseId: string) => void;
  onRemoveEnrollment: (enrollmentId: string) => void;
  onUpdateProgress: (enrollmentId: string, newProgress: number) => void;
}

export const EnrollmentsView: React.FC<EnrollmentsViewProps> = ({
  enrollments,
  courses,
  users,
  isAuditUnmaskMode = false,
  onAddEnrollment,
  onRemoveEnrollment,
  onUpdateProgress
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  const students = users.filter(u => u.role === 'student');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) return;

    onAddEnrollment(selectedStudentId, selectedCourseId);
    setShowAddModal(false);
    setSelectedStudentId('');
    setSelectedCourseId('');
  };

  const filteredEnrollments = enrollments.filter(enr => {
    if (courseFilter !== 'all' && enr.courseId !== courseFilter) return false;
    const student = users.find(u => u.id === enr.studentId);
    const course = courses.find(c => c.id === enr.courseId);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const sName = student?.name.toLowerCase() || '';
      const cTitle = course?.title.toLowerCase() || '';
      const cCode = course?.code.toLowerCase() || '';
      return sName.includes(q) || cTitle.includes(q) || cCode.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">Manage Course Enrollments</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor academic progress, register students for courses, adjust completion rates, and manage class rosters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Enroll Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name or course..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Courses ({courses.length})</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Progress Status</th>
                <th className="py-3 px-4">Enrolled On</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No active enrollments found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map(enr => {
                  const student = users.find(u => u.id === enr.studentId);
                  const course = courses.find(c => c.id === enr.courseId);

                  return (
                    <tr key={enr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={student?.anonymousAlias || student?.name || 'Student'}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{student?.anonymousAlias || student?.name || 'Anon Scholar'}</span>
                              {student?.isTemporal && (
                                <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-amber-100 text-amber-800 border border-amber-300">
                                  Temp
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {isAuditUnmaskMode ? student?.email : maskEmail(student?.email || '')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{course?.title || 'Unknown Course'}</div>
                        <div className="text-[11px] text-blue-600 font-mono">{course?.code}</div>
                      </td>
                      <td className="py-3 px-4 w-52">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-semibold text-slate-700">
                              {enr.progressPercentage}% Completed
                            </span>
                            <span
                              className={`px-1.5 py-0.2 text-[9px] font-bold uppercase rounded ${
                                enr.progressPercentage === 100
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {enr.status}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                enr.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${enr.progressPercentage}%` }}
                            />
                          </div>
                          {/* Quick slider to update progress */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={enr.progressPercentage}
                            onChange={e => onUpdateProgress(enr.id, parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            title="Drag to adjust progress"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{enr.enrolledAt}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm('Drop this student from the course?')) {
                              onRemoveEnrollment(enr.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Drop Enrollment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Enrollment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-base">Register Student for Course</h3>
                  <p className="text-xs text-slate-500">Add an enrollment record to Google Sheets</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Course</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title} ({c.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
