import React, { useState } from 'react';
import { Course, Enrollment } from '../types';
import { Search, Filter, BookOpen, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

interface CourseCatalogViewProps {
  courses: Course[];
  enrollments: Enrollment[];
  studentId: string;
  onEnroll: (courseId: string) => void;
  onSelectCourse: (courseId: string) => void;
}

export const CourseCatalogView: React.FC<CourseCatalogViewProps> = ({
  courses,
  enrollments,
  studentId,
  onEnroll,
  onSelectCourse
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const categories = ['All', 'Computer Science', 'Data Science', 'Artificial Intelligence'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      searchTerm === '' ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.courseId === courseId && e.studentId === studentId);
  };

  const getProgress = (courseId: string) => {
    const enr = enrollments.find(e => e.courseId === courseId && e.studentId === studentId);
    return enr ? enr.progressPercentage : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Academic Course Catalog</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore courses across software development, data science, and artificial intelligence.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, code, keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            {levels.map(lvl => (
              <option key={lvl} value={lvl}>{lvl} Level</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No matching courses found</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Try loosening your search terms or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const enrolled = isEnrolled(course.id);
            const progress = getProgress(course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-white/90 text-blue-700 shadow-xs">
                        {course.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-900/80 text-white">
                        {course.level}
                      </span>
                    </div>

                    {enrolled && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Enrolled
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span>{course.code}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-slate-900 text-base line-clamp-1">
                      {course.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="text-xs text-slate-500">
                      Instructor: <span className="font-medium text-slate-800">{course.lecturerName}</span>
                    </div>

                    {enrolled && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Learning Progress</span>
                          <span className="text-blue-600">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {enrolled ? (
                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Continue Studying
                    </button>
                  ) : (
                    <button
                      onClick={() => onEnroll(course.id)}
                      className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      Enroll in Course
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
