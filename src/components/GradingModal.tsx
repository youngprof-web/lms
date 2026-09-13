import React, { useState } from 'react';
import { Submission } from '../types';
import { Award, FileText, CheckCircle, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface GradingModalProps {
  submission: Submission;
  isAuditUnmaskMode?: boolean;
  onClose: () => void;
  onSaveGrade: (submissionId: string, score: number, feedback: string) => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  submission,
  isAuditUnmaskMode = false,
  onClose,
  onSaveGrade
}) => {
  const [score, setScore] = useState<number>(submission.pointsEarned ?? 85);
  const [feedback, setFeedback] = useState<string>(submission.feedback ?? '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGrade(submission.id, Number(score), feedback.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Gradebook Evaluation
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Blind Grading Mode
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 mt-1">
              {submission.assignmentTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Submission Overview */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-slate-400">Student Identity: </span>
              <strong className="text-slate-900">
                {submission.studentAnonymousAlias || 'Anon Scholar #482'}
              </strong>
              {isAuditUnmaskMode && (
                <span className="ml-1 text-[11px] text-amber-700 font-mono">
                  (Audit Unmasked: {submission.studentName})
                </span>
              )}
            </div>
            <div className="text-slate-500">
              Submitted: {submission.submittedAt ? submission.submittedAt.split('T')[0] : 'Recent'}
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-700 mb-1">Student Writeup / Links:</div>
            <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 break-words">
              {submission.submissionText || 'No writeup provided.'}
            </p>
          </div>

          {submission.fileName && (
            <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-slate-800 truncate">{submission.fileName}</span>
              </div>
              <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Drive Synced
              </span>
            </div>
          )}
        </div>

        {/* Grading Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Score (Max 100 Points)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              className="w-32 px-3 py-2 text-sm font-bold rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instructor Feedback & Notes
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback for the student..."
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
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              Record Grade & Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
