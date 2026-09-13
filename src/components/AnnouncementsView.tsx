import React, { useState } from 'react';
import { Announcement, UserRole } from '../types';
import { Bell, Plus, X, Calendar, UserCheck, ShieldCheck } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  currentRole: UserRole;
  authorName: string;
  authorAnonymousAlias?: string;
  isAuditUnmaskMode?: boolean;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  currentRole,
  authorName,
  authorAnonymousAlias,
  isAuditUnmaskMode = false,
  onAddAnnouncement
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddAnnouncement({
      title: title.trim(),
      content: content.trim(),
      authorName,
      authorAnonymousAlias: authorAnonymousAlias || 'Anon Instructor',
      authorRole: currentRole === 'admin' ? 'admin' : 'lecturer',
      targetRole: 'all'
    });

    setTitle('');
    setContent('');
    setShowModal(false);
  };

  const canPost = currentRole === 'admin' || currentRole === 'lecturer';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Campus Announcements</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional alerts and course notices recorded in the <code className="text-blue-600 font-mono">Announcements</code> Google Sheet.
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post Announcement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div
            key={ann.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  ann.authorRole === 'admin' ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-800'
                }`}>
                  {ann.authorRole}
                </span>
                <h3 className="font-heading font-bold text-slate-900 text-base">{ann.title}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {ann.createdAt}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <div>
                Posted by <span className="font-bold text-slate-800">{ann.authorAnonymousAlias || ann.authorName}</span>
                {isAuditUnmaskMode && (
                  <span className="ml-1 text-[10px] text-amber-700 font-mono">({ann.authorName})</span>
                )}
              </div>
              <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Institutional Post
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold font-heading text-slate-900">Publish Campus Announcement</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Examination Schedule Released"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bulletin Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the full message details..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
