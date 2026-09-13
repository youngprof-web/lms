import React, { useState } from 'react';
import { DirectMessage, User } from '../types';
import { MessageSquare, Send, Plus, X, User as UserIcon, ShieldCheck } from 'lucide-react';
import { getPeerDisplayName } from '../utils/anonymity';

interface MessagesViewProps {
  currentUser: User;
  users: User[];
  messages: DirectMessage[];
  isAuditUnmaskMode?: boolean;
  onSendMessage: (
    receiverId: string,
    receiverName: string,
    subject: string,
    message: string,
    receiverAnonymousAlias?: string
  ) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  currentUser,
  users,
  messages,
  isAuditUnmaskMode = false,
  onSendMessage
}) => {
  const [showModal, setShowModal] = useState(false);
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const [receiverId, setReceiverId] = useState(otherUsers[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const myMessages = messages.filter(
    m => m.senderId === currentUser.id || m.receiverId === currentUser.id
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    const receiver = users.find(u => u.id === receiverId);
    if (!receiver) return;

    onSendMessage(
      receiver.id,
      receiver.name,
      subject.trim(),
      body.trim(),
      receiver.anonymousAlias
    );
    setSubject('');
    setBody('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span>Direct Messages</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Peer-anonymized communication between students and instructors recorded in the Google Sheet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Peer Anonymity Active</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Message</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {myMessages.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No direct messages in your inbox. Click compose to start an anonymous conversation!
          </div>
        ) : (
          myMessages.map(msg => {
            const isSentByMe = msg.senderId === currentUser.id;
            const peerAlias = isSentByMe
              ? msg.receiverAnonymousAlias || msg.receiverName
              : msg.senderAnonymousAlias || msg.senderName;
            const realPeerName = isSentByMe ? msg.receiverName : msg.senderName;

            return (
              <div key={msg.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isSentByMe ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {isSentByMe ? `To: ${peerAlias}` : `From: ${peerAlias}`}
                      {isAuditUnmaskMode && (
                        <span className="ml-1 text-[9px] text-amber-700">({realPeerName})</span>
                      )}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{msg.subject}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{msg.sentAt}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                  {msg.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">Compose Anonymous Message</h3>
                <p className="text-xs text-slate-400">Recipient will only see your anonymous alias</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient (Identified by Anonymous Alias)
                </label>
                <select
                  value={receiverId}
                  onChange={e => setReceiverId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white"
                >
                  {otherUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.anonymousAlias || u.name} — ({u.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question on Module 2 Flexbox"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your message here..."
                  value={body}
                  onChange={e => setBody(e.target.value)}
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
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Anonymously
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
