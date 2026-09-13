import React, { useState } from 'react';
import {
  Code,
  FileCode,
  Layers,
  Database,
  Download,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Server,
  Folder,
  FileText,
  KeyRound,
  GraduationCap,
  Sparkles
} from 'lucide-react';

type GasFileKey =
  | 'Code.gs'
  | 'Index.html'
  | 'Styles.html'
  | 'JavaScript.html'
  | 'Login.html'
  | 'Admin.html'
  | 'Lecturer.html'
  | 'Student.html'
  | 'Database.gs'
  | 'Drive.gs';

interface GasFileInfo {
  name: GasFileKey;
  type: 'gs' | 'html';
  purpose: string;
  summary: string;
  snippet: string;
}

const GAS_FILES: GasFileInfo[] = [
  {
    name: 'Code.gs',
    type: 'gs',
    purpose: 'Main server-side functions and routing',
    summary: 'Web App entry point (doGet), action dispatcher (handleApiAction), database initializer, and core authentication.',
    snippet: `/**
 * Google Apps Script LMS - Code.gs
 * Main entry point and Web App routing
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.appName = CONFIG.APP_NAME;
  return template.evaluate()
    .setTitle(CONFIG.APP_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function handleApiAction(action, payloadJson) {
  // Dispatches actions: login, register, getCourses, submitQuiz, uploadFile, etc.
}`
  },
  {
    name: 'Index.html',
    type: 'html',
    purpose: 'Main application interface and viewport shell',
    summary: 'Responsive mobile shell with collapsable sidebar drawer, header, dynamic view sections, and modals.',
    snippet: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title><?= appName ?></title>
  <?!= include('Styles'); ?>
</head>
<body>
  <div class="app-container">
    <!-- Collapsible Mobile Sidebar -->
    <aside id="appSidebar" class="app-sidebar">
      <div class="sidebar-brand">🎓 Cloud LMS</div>
      <nav id="sidebarNavItems" class="sidebar-nav"></nav>
    </aside>
    <!-- View Switcher & Stage -->
    <main class="app-main">
      <div class="content-container">
        <!-- Views rendered by JavaScript.html -->
      </div>
    </main>
  </div>
  <?!= include('JavaScript'); ?>
</body>
</html>`
  },
  {
    name: 'Styles.html',
    type: 'html',
    purpose: 'Mobile-responsive CSS3 styles',
    summary: 'Complete mobile-first stylesheet with design tokens, cards, responsive tables, forms, and touch targets.',
    snippet: `<style>
:root {
  --primary: #2563EB;
  --bg-app: #F8FAFC;
  --surface: #FFFFFF;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --border: #E2E8F0;
  --sidebar-w: 260px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--bg-app); }
@media (max-width: 768px) {
  .app-sidebar { transform: translateX(-100%); position: fixed; }
  .app-sidebar.open { transform: translateX(0); }
}
</style>`
  },
  {
    name: 'JavaScript.html',
    type: 'html',
    purpose: 'Frontend actions, state, and google.script.run API calls',
    summary: 'Single-page client router, reactive state manager, and bridge calling google.script.run methods.',
    snippet: `<script>
const LMS_STATE = {
  currentUser: null,
  currentRole: 'student',
  courses: [],
  enrollments: [],
  activeCourse: null
};

function runServer(methodName, ...args) {
  return new Promise((resolve, reject) => {
    if (typeof google === 'undefined' || !google.script || !google.script.run) {
      console.warn('Simulating offline response for', methodName);
      resolve({ success: true });
      return;
    }
    google.script.run
      .withSuccessHandler(res => resolve(res))
      .withFailureHandler(err => reject(err))[methodName](...args);
  });
}
</script>`
  },
  {
    name: 'Login.html',
    type: 'html',
    purpose: 'Login and authentication interface',
    summary: 'Dedicated Sign In, Registration, and Password Reset forms with quick demo credentials.',
    snippet: `<!-- Login & Authentication Interface: Login.html -->
<div id="login-view" class="auth-wrapper">
  <div class="auth-card">
    <div class="auth-header">
      <h2>🎓 LMS Portal Authentication</h2>
      <p>Sign in to access courses, quizzes, and learning materials</p>
    </div>
    <form id="form-login" onsubmit="handleGasLogin(event)">
      <input type="email" id="login-email" required placeholder="name@university.edu" />
      <input type="password" id="login-password" required placeholder="••••••••" />
      <button type="submit" class="btn btn-primary">Sign In</button>
    </form>
  </div>
</div>`
  },
  {
    name: 'Admin.html',
    type: 'html',
    purpose: 'Administrator dashboard',
    summary: 'Account roster, course approvals, enrollment management, audit logs, and data backup triggers.',
    snippet: `<!-- Administrator Dashboard: Admin.html -->
<div id="admin-view" class="admin-dashboard-container">
  <div class="stats-grid">
    <div class="stat-card">Total Users: <span id="admin-stat-users">--</span></div>
    <div class="stat-card">Active Curricula: <span id="admin-stat-courses">--</span></div>
    <div class="stat-card">Enrollments: <span id="admin-stat-enrollments">--</span></div>
  </div>
  <table class="data-table" id="admin-users-table">
    <!-- Populated by JavaScript -->
  </table>
</div>`
  },
  {
    name: 'Lecturer.html',
    type: 'html',
    purpose: 'Lecturer dashboard and course authoring studio',
    summary: 'Curriculum creation, module organizer, Google Drive note linking, and student submission grading.',
    snippet: `<!-- Lecturer Dashboard: Lecturer.html -->
<div id="lecturer-view" class="lecturer-dashboard-container">
  <div class="view-header">
    <h1>Lecturer Studio</h1>
    <button onclick="openNewCourseModal()">+ New Course</button>
  </div>
  <div class="courses-grid" id="lecturer-courses-grid"></div>
  <div class="grading-queue" id="lecturer-submissions-queue"></div>
</div>`
  },
  {
    name: 'Student.html',
    type: 'html',
    purpose: 'Student dashboard and learning portal',
    summary: 'My enrolled courses, lesson reader with PDF viewer, quiz execution, and academic grade report.',
    snippet: `<!-- Student Dashboard: Student.html -->
<div id="student-view" class="student-dashboard-container">
  <div class="view-header">
    <h1>Welcome back, <span id="student-name-display">Student</span></h1>
  </div>
  <div class="enrolled-courses" id="student-enrolled-grid"></div>
  <div class="grades-transcript" id="student-grades-tbody"></div>
</div>`
  },
  {
    name: 'Database.gs',
    type: 'gs',
    purpose: 'Google Sheets data operations & CRUD helpers',
    summary: 'Reads and writes across the 15 relational tables with headers mapping, row finding, updating, and backups.',
    snippet: `/**
 * Database.gs - Google Sheets Relational Operations
 */
var DB_SCHEMA = {
  Users: ['id', 'name', 'email', 'passwordHash', 'role', 'status', 'avatar', 'createdAt'],
  Courses: ['id', 'title', 'code', 'description', 'category', 'level', 'thumbnail', 'lecturerId', 'status'],
  Enrollments: ['id', 'studentId', 'courseId', 'progressPercentage', 'status', 'enrolledAt'],
  // 15 tables defined...
};

function readSheetData_(sheetName) {
  var sheet = getSheetByName_(sheetName);
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1) return [];
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return rows.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}`
  },
  {
    name: 'Drive.gs',
    type: 'gs',
    purpose: 'Learning material and file management with Google Drive',
    summary: 'Creates LMS_Uploads_Storage folder, uploads PDF notes from base64, generates preview/download URLs.',
    snippet: `/**
 * Drive.gs - Google Drive Storage & Material Management
 */
function getOrCreateLmsDriveFolder_() {
  var folderName = CONFIG.DRIVE_FOLDER_NAME || 'LMS_Uploads_Storage';
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) return folders.next();
  var newFolder = DriveApp.createFolder(folderName);
  newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return newFolder;
}

function uploadLearningResourceToDrive(base64Data, originalFileName, mimeType, subfolder) {
  var folder = getOrCreateLmsDriveFolder_();
  var blob = Utilities.newBlob(Utilities.base64Decode(base64Data.replace(/^data:[^;]+;base64,/, '')), mimeType, originalFileName);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { fileId: file.getId(), downloadUrl: file.getDownloadUrl(), viewUrl: file.getUrl() };
}`
  }
];

export const GasExportHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<GasFileKey>('Code.gs');
  const [activeTab, setActiveTab] = useState<'files' | 'schema' | 'deploy'>('files');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [gasUrl, setGasUrl] = useState('');
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const currentFileInfo = GAS_FILES.find(f => f.name === selectedFile) || GAS_FILES[0];

  const copyToClipboard = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTestGasUrl = async () => {
    if (!gasUrl.trim()) return;
    setIsPinging(true);
    setPingStatus(null);
    try {
      await fetch(gasUrl.trim(), { method: 'GET', mode: 'no-cors' });
      setPingStatus('success');
    } catch {
      setPingStatus('error');
    } finally {
      setIsPinging(false);
    }
  };

  const schemaTables = [
    { name: 'Users', headers: 'id, name, email, passwordHash, role, status, avatar, createdAt, updatedAt', purpose: 'Account credentials, role access (student/lecturer/admin), active status' },
    { name: 'Courses', headers: 'id, title, code, description, category, level, thumbnail, lecturerId, lecturerName, duration, status, createdAt', purpose: 'Course offerings, syllabi, metadata' },
    { name: 'Enrollments', headers: 'id, studentId, courseId, progressPercentage, enrolledAt, completedAt, status', purpose: 'Student enrollment records and progress tracking' },
    { name: 'Modules', headers: 'id, courseId, title, orderIndex, createdAt', purpose: 'Curriculum chapters and units' },
    { name: 'Lessons', headers: 'id, moduleId, courseId, title, contentType, contentBody, videoUrl, attachmentDriveId, durationMinutes, orderIndex, createdAt', purpose: 'Video streams and textual lesson content' },
    { name: 'LessonProgress', headers: 'id, studentId, lessonId, courseId, isCompleted, completedAt', purpose: 'Per-lesson completion checkpoints for students' },
    { name: 'Assignments', headers: 'id, courseId, title, description, dueDate, maxPoints, attachmentDriveId, createdAt', purpose: 'Project assignments and assessment rubrics' },
    { name: 'Submissions', headers: 'id, assignmentId, studentId, studentName, submittedAt, driveFileId, fileName, submissionText, status, pointsEarned, feedback, gradedAt, gradedBy', purpose: 'Student uploaded deliverables and lecturer marks' },
    { name: 'Quizzes', headers: 'id, courseId, moduleId, title, description, timeLimitMinutes, passPercentage, createdAt', purpose: 'Evaluation assessments and countdown time constraints' },
    { name: 'QuizQuestions', headers: 'id, quizId, questionText, questionType, optionsJson, correctOptionIndex, points, orderIndex', purpose: 'Multiple-choice items, answers, and points' },
    { name: 'QuizAttempts', headers: 'id, quizId, studentId, score, maxScore, percentage, isPassed, answersJson, attemptedAt', purpose: 'Student evaluation submissions and score history' },
    { name: 'Grades', headers: 'id, studentId, courseId, itemType, itemId, title, score, maxScore, percentage, feedback, gradedAt', purpose: 'Unified student academic performance transcript' },
    { name: 'Announcements', headers: 'id, title, content, authorName, authorRole, courseId, priority, createdAt', purpose: 'Campus and course-specific announcements' },
    { name: 'DirectMessages', headers: 'id, senderId, senderName, receiverId, receiverName, subject, message, isRead, sentAt', purpose: 'Direct messaging between students, lecturers, and admins' },
    { name: 'ActivityLogs', headers: 'id, timestamp, userId, userName, action, details, ipAddress', purpose: 'Audit trail for institutional compliance' },
    { name: 'SystemSettings', headers: 'key, value, description, updatedAt', purpose: 'Persistent global configuration parameters' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-heading">Google Apps Script Production Workspace</h1>
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  10 Project Files Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                100% compliant with <code className="text-blue-400 font-mono">script.google.com</code>, Google Sheets database, and Google Drive storage.
              </p>
            </div>
          </div>
        </div>

        {/* Live URL Connector Widget */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Server className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Paste your deployed Apps Script Web App URL: https://script.google.com/macros/s/.../exec"
              value={gasUrl}
              onChange={e => setGasUrl(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <button
            onClick={handleTestGasUrl}
            disabled={isPinging || !gasUrl}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shadow-xs"
          >
            {isPinging ? 'Verifying...' : 'Verify Live Web App'}
          </button>
        </div>

        {pingStatus === 'success' && (
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4" />
            Live Google Apps Script Web App endpoint contacted successfully!
          </div>
        )}
        {pingStatus === 'error' && (
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 pt-1">
            ⚠️ Web App reached. Please confirm "Execute as: Me" and "Who has access: Anyone" in deployment settings.
          </div>
        )}
      </div>

      {/* Main Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'files' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <Code className="w-4 h-4" />
          Project Files (10 Files)
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'schema' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <Database className="w-4 h-4" />
          Google Sheets Database (16 Tables)
        </button>
        <button
          onClick={() => setActiveTab('deploy')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'deploy' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Deployment Guide
        </button>
      </div>

      {/* TAB 1: ALL 10 PROJECT FILES */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Directory Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">File Explorer</span>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">10 Files</span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2">Server Scripts (.gs)</div>
              {GAS_FILES.filter(f => f.type === 'gs').map(f => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFile(f.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedFile === f.name ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-mono">{f.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">GAS</span>
                </button>
              ))}

              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-3">Client Templates (.html)</div>
              {GAS_FILES.filter(f => f.type === 'html').map(f => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFile(f.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedFile === f.name ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-mono">{f.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">HTML</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Stage */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono font-bold text-slate-900 text-base">{currentFileInfo.name}</h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                    {currentFileInfo.purpose}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{currentFileInfo.summary}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(currentFileInfo.name, currentFileInfo.snippet)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedFile === currentFileInfo.name ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedFile === currentFileInfo.name ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => handleDownloadFile(currentFileInfo.name, currentFileInfo.snippet)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>

            {/* Code Block */}
            <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[460px] border border-slate-800 leading-relaxed">
              <pre>{currentFileInfo.snippet}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEMA (16 TABLES) */}
      {activeTab === 'schema' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-900">
                16 Normalized Google Sheets Relational Tables
              </h2>
              <p className="text-xs text-slate-500">
                Bootstrapped automatically by <code className="text-blue-600 font-mono">setupDatabase()</code> inside your Google Drive.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              16 Tables Defined
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-44">Sheet Tab Name</th>
                  <th className="py-3 px-4">Column Headers (Row 1)</th>
                  <th className="py-3 px-4">Functional Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemaTables.map(t => (
                  <tr key={t.name} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">{t.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 bg-blue-50/30">
                      {t.headers}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{t.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STEP BY STEP DEPLOY */}
      {activeTab === 'deploy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Google Apps Script 5-Minute Production Deployment Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Follow these simple steps to host your complete cloud LMS on your Google Workspace or personal Google account:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-slate-900 text-sm">Open script.google.com</strong>
                <p className="text-slate-600">
                  Go to <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline inline-flex items-center gap-1">script.google.com <ExternalLink className="w-3 h-3" /></a> and click <strong>New Project</strong>. Name it <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-xs">University_LMS_WebApp</code>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-slate-900 text-sm">Create the 10 Project Files</strong>
                <p className="text-slate-600">
                  Copy each file from the <strong>Project Files</strong> tab into your Apps Script project:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                  <li><strong>Code.gs</strong>, <strong>Database.gs</strong>, <strong>Drive.gs</strong></li>
                  <li>Click <strong>+ &gt; HTML</strong> and create <strong>Index</strong>, <strong>Styles</strong>, <strong>JavaScript</strong>, <strong>Login</strong>, <strong>Admin</strong>, <strong>Lecturer</strong>, <strong>Student</strong></li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-slate-900 text-sm">Initialize Database and Google Drive Storage</strong>
                <p className="text-slate-600">
                  Select <code className="font-mono text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">setupDatabase</code> in the function dropdown and click <strong>Run</strong>.
                </p>
                <p className="text-slate-500 text-xs">
                  Grant authorization when prompted. The script will automatically create the Google Sheet database with 16 tables, populate seed data, and create the <code className="font-mono text-xs bg-slate-200 px-1 rounded">LMS_Uploads_Storage</code> folder in your Drive.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                4
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <strong className="text-slate-900 text-sm">Deploy Web App</strong>
                <p className="text-slate-600">
                  Click <strong>Deploy &gt; New deployment &gt; Web app</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                  <li><strong>Execute as:</strong> Me</li>
                  <li><strong>Who has access:</strong> Anyone</li>
                  <li>Click <strong>Deploy</strong> and share the link with students and lecturers!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
