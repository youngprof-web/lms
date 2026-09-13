import React, { useState } from 'react';
import { Course, Submission } from '../types';
import { Plus, BookOpen, CheckCircle, Clock, FileText, Upload, Award, HelpCircle } from 'lucide-react';

interface LecturerStudioProps {
  lecturerName: string;
  courses: Course[];
  submissions: Submission[];
  onOpenGrading: (submission: Submission) => void;
  onNewCourse: () => void;
  onPreviewCourse: (courseId: string) => void;
}

export const LecturerStudio: React.FC<LecturerStudioProps> = ({
  lecturerName,
  courses,
  submissions,
  onOpenGrading,
  onNewCourse,
  onPreviewCourse
}) => {
  const pendingCount = submissions.filter(s => s.status === 'submitted').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            Instructor Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">
            Course Curriculum & Assessment Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your courses, design syllabus modules, attach Google Drive learning notes, and grade student submissions.
          </p>
        </div>

        <button
          onClick={onNewCourse}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{courses.length}</div>
            <div className="text-xs font-semibold text-slate-500">Published Courses</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{pendingCount}</div>
            <div className="text-xs font-semibold text-slate-500">Submissions to Grade</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-heading text-slate-900">{gradedCount}</div>
            <div className="text-xs font-semibold text-slate-500">Graded Submissions</div>
          </div>
        </div>
      </div>

      {/* Course Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-slate-900 text-base">Course Offerings</h2>
          <span className="text-xs text-slate-400 font-semibold">{courses.length} Total Curricula</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Modules</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-600">{c.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{c.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {c.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{c.modules.length} Modules</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onPreviewCourse(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      Preview Course
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Submissions to Grade Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-slate-900 text-base">Student Project Submissions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Review student code notes, Google Drive file attachments, and enter feedback.</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            {pendingCount} Pending Review
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Assessment Title</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{sub.studentName}</td>
                  <td className="py-3 px-4 text-slate-700">{sub.assignmentTitle}</td>
                  <td className="py-3 px-4 text-slate-500">{sub.submittedAt.split('T')[0]}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sub.status === 'graded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {sub.pointsEarned !== undefined ? `${sub.pointsEarned} / 100` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenGrading(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        sub.status === 'graded'
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                      }`}
                    >
                      {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
