import React from 'react';
import { User, Course, Enrollment, GradeItem, Submission, ActivityLog } from '../types';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  PieChart,
  ShieldCheck
} from 'lucide-react';

interface ReportsViewProps {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  grades: GradeItem[];
  submissions: Submission[];
  logs: ActivityLog[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  users,
  courses,
  enrollments,
  grades,
  submissions,
  logs
}) => {
  const students = users.filter(u => u.role === 'student');
  const lecturers = users.filter(u => u.role === 'lecturer');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed' || e.progressPercentage === 100);

  const avgCompletionRate = enrollments.length
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progressPercentage, 0) / enrollments.length)
    : 0;

  const avgGrade = grades.length
    ? Math.round(grades.reduce((acc, g) => acc + g.percentage, 0) / grades.length)
    : 0;

  // Grade distributions
  const gradeA = grades.filter(g => g.percentage >= 90).length;
  const gradeB = grades.filter(g => g.percentage >= 80 && g.percentage < 90).length;
  const gradeC = grades.filter(g => g.percentage >= 70 && g.percentage < 80).length;
  const gradeDF = grades.filter(g => g.percentage < 70).length;

  const exportTable = (type: 'users' | 'courses' | 'enrollments' | 'grades' | 'logs') => {
    let content = '';
    let filename = `lms_${type}_report_${new Date().toISOString().split('T')[0]}.csv`;

    if (type === 'users') {
      content = 'ID,Name,Email,Role,Status,Joined\n' +
        users.map(u => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${u.joined}"`).join('\n');
    } else if (type === 'courses') {
      content = 'ID,Code,Title,Category,Level,Lecturer,Status\n' +
        courses.map(c => `"${c.id}","${c.code}","${c.title}","${c.category}","${c.level}","${c.lecturerName}","${c.status}"`).join('\n');
    } else if (type === 'enrollments') {
      content = 'ID,StudentID,CourseID,ProgressPercentage,Status,EnrolledDate\n' +
        enrollments.map(e => `"${e.id}","${e.studentId}","${e.courseId}",${e.progressPercentage},"${e.status}","${e.enrolledAt}"`).join('\n');
    } else if (type === 'grades') {
      content = 'ID,StudentID,Title,Type,Score,MaxScore,Percentage,GradedDate\n' +
        grades.map(g => `"${g.id}","${g.studentId}","${g.title}","${g.itemType}",${g.score},${g.maxScore},${g.percentage},"${g.gradedAt}"`).join('\n');
    } else if (type === 'logs') {
      content = 'ID,Timestamp,User,Action,Details\n' +
        logs.map(l => `"${l.id}","${l.timestamp}","${l.userName}","${l.action}","${l.details}"`).join('\n');
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">Institutional Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time visual reports on enrollment progress, academic achievement, and data export.
          </p>
        </div>

        {/* Quick Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportTable('grades')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Grades CSV
          </button>
          <button
            onClick={() => exportTable('enrollments')}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Enrollments CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900">{students.length}</div>
          <div className="text-[11px] text-slate-500">{enrollments.length} active course enrollments</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Completion</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900">{avgCompletionRate}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{completedEnrollments.length} completed courses</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Mean Grade Score</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900">{avgGrade}%</div>
          <div className="text-[11px] text-slate-500">{grades.length} graded assignments & quizzes</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Faculty Roster</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-900">{lecturers.length}</div>
          <div className="text-[11px] text-slate-500">{courses.length} curricula offered</div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-slate-900 text-base">Course Progress & Completion</h2>
            <span className="text-xs text-slate-400 font-mono">15 Tables Sync</span>
          </div>

          <div className="space-y-4">
            {courses.map(c => {
              const courseEnrollments = enrollments.filter(e => e.courseId === c.id);
              const courseAvg = courseEnrollments.length
                ? Math.round(
                    courseEnrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / courseEnrollments.length
                  )
                : 0;

              return (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 font-mono">{c.code}: {c.title}</span>
                    <span className="font-semibold text-slate-600">{courseAvg}% (Avg)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${courseAvg >= 70 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                      style={{ width: `${courseAvg}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{courseEnrollments.length} enrolled students</span>
                    <span>Instructor: {c.lecturerName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Grade Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-slate-900 text-base">Grade Distribution</h2>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Total {grades.length} Grades
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-2xl font-black text-emerald-700 font-heading">{gradeA}</div>
              <div className="text-xs font-bold text-emerald-800 mt-1">Grade A</div>
              <div className="text-[10px] text-emerald-600">90% - 100%</div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-2xl font-black text-blue-700 font-heading">{gradeB}</div>
              <div className="text-xs font-bold text-blue-800 mt-1">Grade B</div>
              <div className="text-[10px] text-blue-600">80% - 89%</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-2xl font-black text-amber-700 font-heading">{gradeC}</div>
              <div className="text-xs font-bold text-amber-800 mt-1">Grade C</div>
              <div className="text-[10px] text-amber-600">70% - 79%</div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-2xl font-black text-rose-700 font-heading">{gradeDF}</div>
              <div className="text-xs font-bold text-rose-800 mt-1">Grade D / F</div>
              <div className="text-[10px] text-rose-600">&lt; 70%</div>
            </div>
          </div>

          {/* Export All Data Hub */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Export Data (Relational Google Sheets Tables)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => exportTable('users')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium flex items-center justify-center gap-1"
              >
                <Download className="w-3 h-3" />
                Users Table
              </button>
              <button
                onClick={() => exportTable('courses')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium flex items-center justify-center gap-1"
              >
                <Download className="w-3 h-3" />
                Courses Table
              </button>
              <button
                onClick={() => exportTable('logs')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium flex items-center justify-center gap-1"
              >
                <Download className="w-3 h-3" />
                Activity Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
