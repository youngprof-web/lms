import React, { useState } from 'react';
import { Course } from '../types';
import { X, BookOpen, Plus } from 'lucide-react';

interface NewCourseModalProps {
  lecturerName: string;
  lecturerId: string;
  onClose: () => void;
  onSave: (course: Course) => void;
}

export const NewCourseModal: React.FC<NewCourseModalProps> = ({
  lecturerName,
  lecturerId,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [duration, setDuration] = useState('6 Weeks');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      category,
      level,
      duration,
      lecturerId,
      lecturerName,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      status: 'published',
      modules: [
        {
          id: `mod_${Date.now()}`,
          courseId: `crs_${Date.now()}`,
          title: 'Module 1: Foundations & Overview',
          order: 1,
          description: 'Introductory concepts and course roadmap.',
          lessons: [
            {
              id: `les_${Date.now()}`,
              moduleId: `mod_${Date.now()}`,
              courseId: `crs_${Date.now()}`,
              title: '1.1 Course Orientation',
              order: 1,
              contentType: 'text',
              textContent: 'Welcome to the course! Review syllabus and upcoming assignments.',
              durationMinutes: 15
            }
          ]
        }
      ],
      materials: [],
      assignments: [],
      quizzes: []
    };

    onSave(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Create New Academic Course
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS-202"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Database Systems"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Artificial Intelligence">AI & Machine Learning</option>
                <option value="Business">Information Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 8 Weeks"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Syllabus</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of course learning outcomes..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publish Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
