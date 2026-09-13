import React from 'react';
import { Course, Enrollment, Submission, GradeItem, Announcement } from '../types';
import { BookOpen, Award, FileCheck, CheckCircle2, Clock, PlayCircle, Bell, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
  studentName: string;
  studentId: string;
  courses: Course[];
  enrollments: Enrollment[];
  submissions: Submission[];
  grades: GradeItem[];
  announcements: Announcement[];
  onSelectCourse: (courseId: string) => void;
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentName,
  studentId,
  courses,
  enrollments,
  submissions,
  grades,
  announcements,
  onSelectCourse,
  onNavigate
}) => {
  const userEnrollments = enrollments.filter(e => e.studentId === studentId);
  const enrolledCourses = courses.filter(c => userEnrollments.some(e => e.courseId === c.id));
  const completedCourses = userEnrollments.filter(e => e.progressPercentage === 100);

  const avgGrade =
    grades.length > 0
      ? Math.round(grades.reduce((acc, g) => acc + g.percentage, 0) / grades.length)
      : 88;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-2xl space-y-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-white/20 text-white border border-white/20">
            Student Academic Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Welcome back, {studentName}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            You have {enrolledCourses.length} active courses in progress. Complete your lessons and assignments to keep your academic streak alive!
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{enrolledCourses.length}</div>
            <div className="text-xs font-semibold text-slate-500">Enrolled Courses</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{completedCourses.length}</div>
            <div className="text-xs font-semibold text-slate-500">Completed Courses</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{submissions.length}</div>
            <div className="text-xs font-semibold text-slate-500">Submissions</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{avgGrade}%</div>
            <div className="text-xs font-semibold text-slate-500">Average Grade</div>
          </div>
        </div>
      </div>

      {/* Continue Studying (Enrolled Courses) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">Active Course Progress</h2>
            <p className="text-xs text-slate-500">Resume right where you left off in your modules.</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Find New Courses
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-3">You have not enrolled in any courses yet.</p>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledCourses.map(course => {
              const enr = userEnrollments.find(e => e.courseId === course.id);
              const progress = enr ? enr.progressPercentage : 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        {course.code}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{course.duration}</span>
                    </div>

                    <h3 className="font-heading font-bold text-slate-900 text-base line-clamp-1">
                      {course.title}
                    </h3>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>Syllabus Completion</span>
                        <span className="text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="w-full py-2 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Resume Study
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deadlines & Announcements Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Upcoming Assessment Deadlines
            </h3>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              All Assignments
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Project 1: Responsive Portfolio Layout</div>
                <div className="text-[11px] text-slate-500">Course: CS-101 • Due Oct 15, 2026</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                Due Soon
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Module 1 Quiz: HTML & Web Protocols</div>
                <div className="text-[11px] text-slate-500">Course: CS-101 • 15 Mins • 4 Questions</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                Self-Paced
              </span>
            </div>
          </div>
        </div>

        {/* Campus Announcements */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Latest Campus Bulletins
            </h3>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {announcements.slice(0, 2).map(ann => (
              <div key={ann.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-start">
                  <div className="text-xs font-bold text-slate-800">{ann.title}</div>
                  <span className="text-[10px] text-slate-400">{ann.createdAt}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
                <div className="text-[10px] font-semibold text-slate-500">By {ann.authorName} ({ann.authorRole})</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
