import React, { useState } from 'react';
import { Course, Enrollment, Lesson, Material } from '../types';
import {
  PlayCircle,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  Award,
  Upload,
  BookOpen,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface CoursePlayerViewProps {
  course: Course;
  enrollment?: Enrollment;
  studentId: string;
  onBack: () => void;
  onEnroll: (courseId: string) => void;
  onMarkLessonComplete: (courseId: string, lessonId: string) => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenAssignment: (assignmentId: string) => void;
}

export const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({
  course,
  enrollment,
  studentId,
  onBack,
  onEnroll,
  onMarkLessonComplete,
  onOpenQuiz,
  onOpenAssignment
}) => {
  // Extract all lessons in sequential order
  const allLessons: Lesson[] = [];
  course.modules.forEach(mod => {
    mod.lessons.forEach(l => allLessons.push(l));
  });

  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons.length > 0 ? allLessons[0].id : ''
  );

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const activeLessonIdx = allLessons.findIndex(l => l.id === activeLesson?.id);

  const isEnrolled = !!enrollment;
  const progress = enrollment?.progressPercentage || 0;
  const completedIds = enrollment?.completedLessonIds || [];
  const isCurrentCompleted = activeLesson ? completedIds.includes(activeLesson.id) : false;

  const handlePrevLesson = () => {
    if (activeLessonIdx > 0) {
      setActiveLessonId(allLessons[activeLessonIdx - 1].id);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIdx < allLessons.length - 1) {
      setActiveLessonId(allLessons[activeLessonIdx + 1].id);
    }
  };

  const handleDownloadMaterial = (mat: Material) => {
    // Generate a simple simulated PDF blob or trigger download
    const content = `Cloud LMS Material: ${mat.title}\nCourse: ${course.title} (${course.code})\nDate: ${mat.uploadedAt}\nGoogle Drive Storage: Verified`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mat.title;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Catalog
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
              {course.code}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">{course.title}</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Instructor: <span className="font-semibold text-slate-700">{course.lecturerName}</span> • Duration: {course.duration}
          </p>
        </div>

        {/* Enrollment & Progress Widget */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
          {isEnrolled ? (
            <div className="space-y-1 w-44">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Course Progress</span>
                <span className="text-blue-600">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400">
                {completedIds.length} of {allLessons.length} lessons completed
              </div>
            </div>
          ) : (
            <button
              onClick={() => onEnroll(course.id)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              Enroll Now to Track Progress
            </button>
          )}
        </div>
      </div>

      {/* Main Learning Stage & Curriculum Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Curriculum Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Course Curriculum
              </h3>
              <span className="text-xs text-slate-400 font-semibold">{allLessons.length} Lessons</span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {course.modules.map(mod => (
                <div key={mod.id} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide px-2">
                    {mod.title}
                  </div>

                  <div className="space-y-1">
                    {mod.lessons.map(les => {
                      const isActive = activeLesson?.id === les.id;
                      const isDone = completedIds.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => setActiveLessonId(les.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm transition-all ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {les.contentType === 'video' ? (
                              <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                            ) : (
                              <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>

                          {isDone && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Downloadable Materials Box (Google Drive Integration) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              Drive Learning Materials
            </h3>
            <p className="text-xs text-slate-500">Lecture notes and supplemental files hosted on Google Drive.</p>

            {course.materials.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-2">No downloadable notes currently attached.</div>
            ) : (
              <div className="space-y-2">
                {course.materials.map(mat => (
                  <div
                    key={mat.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="overflow-hidden pr-2">
                      <div className="text-xs font-bold text-slate-800 truncate">{mat.title}</div>
                      <div className="text-[10px] text-slate-400">{mat.fileSize} • Drive PDF</div>
                    </div>
                    <button
                      onClick={() => handleDownloadMaterial(mat)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Lesson Content Stage & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Lesson Navigation Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {activeLesson?.contentType === 'video' ? 'Video Lecture' : 'Text Lesson'} • {activeLesson?.durationMinutes} Mins
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 mt-1">
                  {activeLesson?.title}
                </h2>
              </div>

              {/* Complete & Navigation Action Buttons */}
              <div className="flex items-center gap-2">
                {isEnrolled && (
                  <button
                    onClick={() => activeLesson && onMarkLessonComplete(course.id, activeLesson.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isCurrentCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isCurrentCompleted ? 'Completed ✓' : 'Mark as Completed'}
                  </button>
                )}

                <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                  <button
                    disabled={activeLessonIdx === 0}
                    onClick={handlePrevLesson}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous Lesson"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activeLessonIdx === allLessons.length - 1}
                    onClick={handleNextLesson}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next Lesson"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Display: Video Player or Reading Text */}
            {activeLesson?.contentType === 'video' && activeLesson.contentUrl && (
              <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden bg-slate-900 shadow-md">
                <iframe
                  src={activeLesson.contentUrl}
                  title={activeLesson.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Textual Lesson Notes */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-5 rounded-xl border border-slate-200">
              {activeLesson?.textContent ? (
                <div className="whitespace-pre-line font-sans">
                  {activeLesson.textContent}
                </div>
              ) : (
                <p className="text-slate-400 italic">No detailed reading notes attached for this lesson.</p>
              )}
            </div>

            {/* Assessment Bar: Quizzes & Assignments for this course */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Test your understanding or submit the required course project:
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {course.quizzes.length > 0 && (
                  <button
                    onClick={() => onOpenQuiz(course.quizzes[0].id)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Award className="w-4 h-4" />
                    Take Module Quiz ({course.quizzes[0].questions.length} Qs)
                  </button>
                )}

                {course.assignments.length > 0 && (
                  <button
                    onClick={() => onOpenAssignment(course.assignments[0].id)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    Submit Assignment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
