import React, { useState } from 'react';
import { Course } from '../types';
import { X, CheckCircle2, BookOpen, Trash2, Check } from 'lucide-react';

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onSave: (updatedCourse: Course) => void;
  onDelete?: (courseId: string) => void;
  onApprove?: (courseId: string) => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  course,
  onClose,
  onSave,
  onDelete,
  onApprove
}) => {
  const [title, setTitle] = useState(course.title);
  const [code, setCode] = useState(course.code);
  const [description, setDescription] = useState(course.description);
  const [category, setCategory] = useState(course.category);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(course.level);
  const [duration, setDuration] = useState(course.duration);
  const [status, setStatus] = useState<'published' | 'draft' | 'pending'>(course.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    onSave({
      ...course,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      category,
      level,
      duration,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">Edit Course: {course.code}</h3>
              <p className="text-xs text-slate-500">Update curriculum details, approval, and publication</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Publication & Approval Status</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                  status === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                  status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Pending Review
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                  status === 'draft'
                    ? 'bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Draft
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete course ${course.code}?`)) {
                      onDelete(course.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Course
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {onApprove && status !== 'published' && (
                <button
                  type="button"
                  onClick={() => {
                    onApprove(course.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve Course
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
