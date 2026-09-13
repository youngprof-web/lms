import React, { useState } from 'react';
import { SystemSettings, ActivityLog } from '../types';
import {
  Settings,
  Database,
  Cloud,
  Save,
  CheckCircle2,
  HardDrive,
  Download,
  RefreshCw,
  Shield,
  FileCheck,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface SettingsViewProps {
  settings: SystemSettings;
  logs: ActivityLog[];
  onSaveSettings: (settings: SystemSettings) => void;
  onTriggerBackup: () => void;
  onClearLogs?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  logs,
  onSaveSettings,
  onTriggerBackup,
  onClearLogs
}) => {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleBackup = () => {
    onTriggerBackup();
    setBackupStatus('Backup snapshot downloaded successfully & synced with Google Drive!');
    setTimeout(() => setBackupStatus(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">System Configuration & Data Backup</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage institutional settings, Google Cloud storage credentials, and create complete database backups.
          </p>
        </div>

        <button
          onClick={handleBackup}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <HardDrive className="w-4 h-4" />
          Backup Data Now
        </button>
      </div>

      {backupStatus && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{backupStatus}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institution & Term */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Settings className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-slate-900 text-base">Institution & Academic Term</h2>
              <p className="text-xs text-slate-500">Configure public institutional metadata</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                required
                value={formData.institutionName}
                onChange={e => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Academic Term
              </label>
              <input
                type="text"
                required
                value={formData.academicTerm}
                onChange={e => setFormData({ ...formData, academicTerm: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grading Policy Scale
              </label>
              <select
                value={formData.gradingScale}
                onChange={e => setFormData({ ...formData, gradingScale: e.target.value as any })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="percentage">Percentage (0% - 100%)</option>
                <option value="gpa">Standard 4.0 GPA Scale</option>
                <option value="letters">Letter Grades (A, B, C, D, F)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="openReg"
                checked={formData.allowOpenRegistration}
                onChange={e => setFormData({ ...formData, allowOpenRegistration: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="openReg" className="text-xs font-bold text-slate-700 cursor-pointer">
                Allow Open Student Registration (Self-Sign Up)
              </label>
            </div>
          </div>
        </div>

        {/* Google Workspace & Cloud Integration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Cloud className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-slate-900 text-base">Google Workspace Integration</h2>
              <p className="text-xs text-slate-500">Google Drive & Google Sheets persistent storage mapping</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Google Sheets Database ID (Script Properties: SPREADSHEET_ID)
                </label>
                {formData.spreadsheetId && (
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${formData.spreadsheetId}/edit`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Open Google Sheet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={formData.spreadsheetId}
                onChange={e => setFormData({ ...formData, spreadsheetId: e.target.value })}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-700"
              />
              <p className="text-[10px] text-slate-400 mt-1">Active Google Sheets database connected for cloud records & sync.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Drive Storage Folder Name / ID
              </label>
              <input
                type="text"
                value={formData.driveFolderId}
                onChange={e => setFormData({ ...formData, driveFolderId: e.target.value })}
                placeholder="LMS_Uploads_Storage"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-700"
              />
              <p className="text-[10px] text-slate-400 mt-1">Auto-created by Drive.gs / setupDatabase()</p>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-3">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved!
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            Configure & Save Settings
          </button>
        </div>
      </form>

      {/* Activity Logs Review Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-slate-900 text-base">Audit Trail & System Logs</h2>
            <p className="text-xs text-slate-500">Stored in the <code className="text-blue-600 font-mono">ActivityLogs</code> Google Sheet</p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
            {logs.length} Recorded Events
          </span>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.slice(0, 10).map(l => (
                <tr key={l.id} className="hover:bg-slate-50/70">
                  <td className="py-2 px-4 text-slate-500">{l.timestamp}</td>
                  <td className="py-2 px-4 font-bold text-slate-900">{l.userName}</td>
                  <td className="py-2 px-4 text-blue-600">{l.action}</td>
                  <td className="py-2 px-4 text-slate-600 font-sans">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
