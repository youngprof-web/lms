import React, { useState } from 'react';
import { Course } from '../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Check,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

interface CoursesManagementViewProps {
  courses: Course[];
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onApproveCourse: (courseId: string) => void;
  onPreviewCourse: (courseId: string) => void;
}

export const CoursesManagementView: React.FC<CoursesManagementViewProps> = ({
  courses,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onApproveCourse,
  onPreviewCourse
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    if (statusFilter !== 'all' && course.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.lecturerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">Curriculum & Course Offerings</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review course statuses, approve lecturer submissions, edit syllabi, and publish live classes.
          </p>
        </div>

        <button
          onClick={onAddCourse}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, code, lecturer, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({courses.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'published' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Published ({courses.filter(c => c.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review ({courses.filter(c => c.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'draft' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drafts ({courses.filter(c => c.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Course List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:border-slate-300 transition-all"
          >
            <div className="relative h-40 bg-slate-100 overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs ${
                    course.status === 'published'
                      ? 'bg-emerald-600 text-white'
                      : course.status === 'pending'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {course.status === 'pending' ? 'Pending Approval' : course.status}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white font-mono">
                  {course.code}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  {course.category} • {course.level}
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base line-clamp-1 mt-0.5">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {course.description}
                </p>
                <div className="text-xs text-slate-600 font-medium mt-2">
                  Instructor: <span className="font-bold text-slate-900">{course.lecturerName}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{course.modules.length} Modules</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Approve Action */}
                  {course.status !== 'published' && (
                    <button
                      onClick={() => onApproveCourse(course.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Approve Course"
                    >
                      <Check className="w-3 h-3" />
                      Approve
                    </button>
                  )}

                  <button
                    onClick={() => onPreviewCourse(course.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Preview Course Player"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onEditCourse(course)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Edit Course"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
