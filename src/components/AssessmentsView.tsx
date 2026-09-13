import React, { useState } from 'react';
import { Course, Submission, UserRole, User } from '../types';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  Eye,
  FileText,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AssessmentsViewProps {
  courses: Course[];
  submissions: Submission[];
  currentUser: User;
  isAuditUnmaskMode?: boolean;
  onOpenGrading: (submission: Submission) => void;
  onSubmitAssignmentWork?: (assignmentId: string) => void;
  onTakeQuiz?: (quizId: string) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({
  courses,
  submissions,
  currentUser,
  isAuditUnmaskMode = false,
  onOpenGrading,
  onSubmitAssignmentWork,
  onTakeQuiz
}) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'assignments' | 'quizzes'>('submissions');
  const [filterCourse, setFilterCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allAssignments = courses.flatMap(c =>
    c.assignments.map(a => ({ ...a, courseCode: c.code, courseTitle: c.title }))
  );

  const allQuizzes = courses.flatMap(c =>
    c.quizzes.map(q => ({ ...q, courseCode: c.code, courseTitle: c.title }))
  );

  const filteredSubmissions = submissions.filter(s => {
    if (currentUser.role === 'student' && s.studentId !== currentUser.id) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.assignmentTitle.toLowerCase().includes(q) ||
        s.studentName.toLowerCase().includes(q) ||
        (s.submissionText && s.submissionText.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">Academic Assessments & Submissions</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {currentUser.role === 'student'
              ? 'View course assignments, take module quizzes, and review grades.'
              : 'Review submitted project deliverables, evaluate answers, and award marks.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'submissions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submissions ({filteredSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'assignments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assignments ({allAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'quizzes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quizzes ({allQuizzes.length})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search submissions by title or student..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student (Peer Anonymized)</th>
                  <th className="py-3 px-4">Assessment Title</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Evaluation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      No submissions recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map(sub => {
                    const isSelf = currentUser.id === sub.studentId;
                    const canSeeReal = isSelf || isAuditUnmaskMode;
                    const displayStudentName = sub.studentAnonymousAlias || 'Anon Scholar #482';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{displayStudentName}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                                You
                              </span>
                            )}
                          </div>
                          {canSeeReal ? (
                            <div className="text-[10px] text-slate-500">{sub.studentName}</div>
                          ) : (
                            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Blind Evaluated
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{sub.assignmentTitle}</div>
                          {sub.fileName && (
                            <div className="text-[11px] text-blue-600 flex items-center gap-1 font-mono">
                              <FileText className="w-3 h-3" />
                              {sub.fileName}
                            </div>
                          )}
                        </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {sub.submittedAt ? sub.submittedAt.split('T')[0] : 'Today'}
                      </td>
                      <td className="py-3 px-4">
                        {sub.status === 'graded' ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {sub.pointsEarned} / 100 pts
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {currentUser.role !== 'student' ? (
                          <button
                            onClick={() => onOpenGrading(sub)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                          >
                            {sub.status === 'graded' ? 'Regrade' : 'Grade Submission'}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500">
                            {sub.feedback ? `Feedback: ${sub.feedback}` : 'Pending review'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignments Grid */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAssignments.map(asg => (
            <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-blue-600 uppercase font-mono">{asg.courseCode}</span>
                <span className="text-slate-400">Due: {asg.dueDate}</span>
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base">{asg.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{asg.description}</p>
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Max Points: <strong className="text-slate-900">{asg.maxPoints} pts</strong></span>
                {onSubmitAssignmentWork && (
                  <button
                    onClick={() => onSubmitAssignmentWork(asg.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Submit Work
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quizzes Grid */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allQuizzes.map(q => (
            <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-purple-600 uppercase font-mono">{q.courseCode}</span>
                <span className="text-slate-400">{q.timeLimitMinutes} min limit</span>
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base">{q.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{q.description}</p>
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Pass mark: <strong className="text-slate-900">{q.passPercentage}%</strong></span>
                {onTakeQuiz && (
                  <button
                    onClick={() => onTakeQuiz(q.id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    Take Quiz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
