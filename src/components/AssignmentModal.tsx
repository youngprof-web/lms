import React, { useState, useRef } from 'react';
import { Assignment } from '../types';
import { Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react';

interface AssignmentModalProps {
  assignment: Assignment;
  studentName: string;
  onClose: () => void;
  onSubmit: (submissionText: string, fileName?: string) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  assignment,
  studentName,
  onClose,
  onSubmit
}) => {
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() && !selectedFile) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(submissionText, selectedFile?.name);
      setIsSubmitting(false);
      setDone(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Assignment Submission
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 mt-1">
              {assignment.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900">Assignment Uploaded!</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Your submission has been queued for lecturer evaluation and recorded in Google Sheets.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description Card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Assignment Briefing:</div>
              <p>{assignment.description}</p>
              <div className="flex gap-4 pt-1 text-[11px] text-slate-500 font-medium">
                <span>Due Date: <strong>{assignment.dueDate}</strong></span>
                <span>Max Points: <strong>{assignment.maxPoints}</strong></span>
              </div>
            </div>

            {/* Submission Text Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Written Solution / Repository Link / Notes
              </label>
              <textarea
                rows={4}
                value={submissionText}
                onChange={e => setSubmissionText(e.target.value)}
                placeholder="Paste code repository links, Google Doc links, or type your response here..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* File Upload Drop Zone (Click + Drag/Drop) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach File to Google Drive (PDF, ZIP, DOC)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <div className="text-xs font-semibold text-slate-700">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop file'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Google Drive automatic synchronization'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!submissionText.trim() && !selectedFile)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-40"
              >
                {isSubmitting ? 'Uploading to Drive...' : 'Submit Work'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
