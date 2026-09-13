import React, { useState } from 'react';
import {
  User,
  UserRole,
  Course,
  Enrollment,
  Submission,
  GradeItem,
  Announcement,
  DirectMessage,
  ActivityLog,
  SystemSettings
} from './types';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_ENROLLMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_GRADES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MESSAGES,
  INITIAL_LOGS
} from './data/mockLmsData';
import {
  createTemporalSessionUser,
  generateAnonymousAlias
} from './utils/anonymity';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { LoginView } from './components/LoginView';
import { CourseCatalogView } from './components/CourseCatalogView';
import { CoursePlayerView } from './components/CoursePlayerView';
import { StudentDashboard } from './components/StudentDashboard';
import { LecturerStudio } from './components/LecturerStudio';
import { AdminDashboard } from './components/AdminDashboard';
import { UsersManagementView } from './components/UsersManagementView';
import { CoursesManagementView } from './components/CoursesManagementView';
import { EnrollmentsView } from './components/EnrollmentsView';
import { AssessmentsView } from './components/AssessmentsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { MessagesView } from './components/MessagesView';
import { GradesView } from './components/GradesView';
import { GasExportHub } from './components/GasExportHub';
import { QuizModal } from './components/QuizModal';
import { AssignmentModal } from './components/AssignmentModal';
import { GradingModal } from './components/GradingModal';
import { NewCourseModal } from './components/NewCourseModal';
import { AddUserModal } from './components/AddUserModal';
import { EditUserModal } from './components/EditUserModal';
import { EditCourseModal } from './components/EditCourseModal';

export default function App() {
  // Global Data State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [grades, setGrades] = useState<GradeItem[]>(INITIAL_GRADES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [messages, setMessages] = useState<DirectMessage[]>(INITIAL_MESSAGES);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    institutionName: 'State University of Technology',
    academicTerm: 'Fall 2025 Semester',
    allowOpenRegistration: true,
    driveFolderId: 'LMS_Uploads_Storage',
    spreadsheetId: '15zRSQkSCS4N-1xDvCIOW1Fv0Tofpc-tdU1ClIbtH5OyCEhYy7Pbsop4t',
    gradingScale: 'percentage',
    backupIntervalDays: 7,
    maintenanceMode: false
  });

  // Authentication & Context
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isAuditUnmaskMode, setIsAuditUnmaskMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'lms' | 'gas'>('lms');
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('crs_cs101');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals State
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Activity Logger
  const handleLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userName: currentUser ? currentUser.anonymousAlias || currentUser.name : 'System',
      action,
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Authentication Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthenticated(true);
    handleLog('USER_LOGIN', `User ${user.anonymousAlias || user.name} authenticated as ${user.role}`);

    if (user.role === 'admin') setCurrentView('adminDashboard');
    else if (user.role === 'lecturer') setCurrentView('lecturerStudio');
    else setCurrentView('studentDashboard');
  };

  const handleLaunchTemporalLogin = (role: UserRole = 'student', durationMinutes: number = 60) => {
    const tempUser = createTemporalSessionUser(role, durationMinutes);
    setUsers(prev => [tempUser, ...prev]);
    setCurrentUser(tempUser);
    setCurrentRole(tempUser.role);
    setIsAuthenticated(true);
    handleLog(
      'TEMPORAL_LOGIN_ISSUED',
      `Ephemeral session issued for ${tempUser.anonymousAlias} (${durationMinutes} mins validity, Token: ${tempUser.temporalToken?.substring(0, 8)}...)`
    );

    if (role === 'admin') setCurrentView('adminDashboard');
    else if (role === 'lecturer') setCurrentView('lecturerStudio');
    else setCurrentView('studentDashboard');
  };

  const handleExtendTemporalSession = (extraMinutes: number = 30) => {
    if (!currentUser.isTemporal || !currentUser.temporalExpiresAt) return;
    const currentExp = new Date(currentUser.temporalExpiresAt).getTime();
    const newExp = new Date(currentExp + extraMinutes * 60 * 1000).toISOString();
    const updatedUser = { ...currentUser, temporalExpiresAt: newExp };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    handleLog('TEMPORAL_EXTENDED', `Session extended for ${currentUser.anonymousAlias} by +${extraMinutes}m`);
  };

  const handleRegisterUser = (userData: { name: string; email: string; role: UserRole; password?: string }) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: 'active',
      password: userData.password || 'Welcome@2025',
      anonymousAlias: generateAnonymousAlias(userData.role),
      avatar:
        userData.role === 'student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : userData.role === 'lecturer'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      joined: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);
    setIsAuthenticated(true);
    handleLog('USER_REGISTERED', `New account created: ${newUser.anonymousAlias} (${newUser.role})`);

    if (newUser.role === 'admin') setCurrentView('adminDashboard');
    else if (newUser.role === 'lecturer') setCurrentView('lecturerStudio');
    else setCurrentView('studentDashboard');
  };

  const handleLogout = () => {
    handleLog('USER_LOGOUT', `User ${currentUser.name} signed out`);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const matchedUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(matchedUser);

    if (role === 'student') setCurrentView('studentDashboard');
    else if (role === 'lecturer') setCurrentView('lecturerStudio');
    else if (role === 'admin') setCurrentView('adminDashboard');
  };

  // Student Actions
  const handleEnroll = (courseId: string) => {
    if (enrollments.some(e => e.courseId === courseId && e.studentId === currentUser.id)) {
      setSelectedCourseId(courseId);
      setCurrentView('coursePlayer');
      return;
    }

    const newEnr: Enrollment = {
      id: `enr_${Date.now()}`,
      studentId: currentUser.id,
      courseId,
      progressPercentage: 0,
      enrolledAt: new Date().toISOString().split('T')[0],
      status: 'active',
      completedLessonIds: []
    };

    setEnrollments(prev => [...prev, newEnr]);
    setSelectedCourseId(courseId);
    setCurrentView('coursePlayer');
    handleLog('ENROLL_COURSE', `Enrolled in course ${courseId}`);
  };

  const handleMarkLessonComplete = (courseId: string, lessonId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    let totalLessonsCount = 0;
    course.modules.forEach(m => {
      totalLessonsCount += m.lessons.length;
    });

    setEnrollments(prev =>
      prev.map(enr => {
        if (enr.courseId === courseId && enr.studentId === currentUser.id) {
          const completed = enr.completedLessonIds.includes(lessonId)
            ? enr.completedLessonIds
            : [...enr.completedLessonIds, lessonId];

          const progress = Math.min(
            100,
            Math.round((completed.length / (totalLessonsCount || 1)) * 100)
          );

          return {
            ...enr,
            completedLessonIds: completed,
            progressPercentage: progress,
            status: progress === 100 ? 'completed' : 'active'
          };
        }
        return enr;
      })
    );

    handleLog('LESSON_COMPLETED', `Completed lesson ${lessonId} in ${course.code}`);
  };

  const handleSubmitQuizResult = (score: number, maxScore: number, percentage: number) => {
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const newGrade: GradeItem = {
      id: `grd_${Date.now()}`,
      studentId: currentUser.id,
      courseId: selectedCourseId,
      title: `${selectedCourse?.code || 'Module'} Quiz Evaluation`,
      itemType: 'quiz',
      score,
      maxScore,
      percentage,
      gradedAt: new Date().toISOString().split('T')[0],
      feedback: percentage >= 70 ? 'Passed evaluation criteria.' : 'Needs review of core concepts.'
    };

    setGrades(prev => [newGrade, ...prev]);
    handleLog('QUIZ_ATTEMPT', `Scored ${percentage}% on ${selectedCourse?.code} quiz.`);
  };

  const handleSubmitAssignment = (submissionText: string, fileName?: string) => {
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const assignment =
      selectedCourse?.assignments.find(a => a.id === activeAssignmentId) ||
      selectedCourse?.assignments[0];

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      assignmentId: assignment?.id || `asg_${Date.now()}`,
      assignmentTitle: assignment?.title || 'Course Project',
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAnonymousAlias: currentUser.anonymousAlias || 'Anon Scholar #482',
      submittedAt: new Date().toISOString(),
      submissionText,
      fileName,
      status: 'submitted'
    };

    setSubmissions(prev => [newSub, ...prev]);
    handleLog('ASSIGNMENT_SUBMITTED', `Uploaded work for ${newSub.assignmentTitle}`);
  };

  // Lecturer Actions
  const handleSaveGrade = (submissionId: string, score: number, feedback: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    setSubmissions(prev =>
      prev.map(s => (s.id === submissionId ? { ...s, pointsEarned: score, feedback, status: 'graded' } : s))
    );

    const newGrade: GradeItem = {
      id: `grd_${Date.now()}`,
      studentId: sub.studentId,
      title: sub.assignmentTitle,
      itemType: 'assignment',
      score,
      maxScore: 100,
      percentage: score,
      gradedAt: new Date().toISOString().split('T')[0],
      feedback
    };
    setGrades(prev => [newGrade, ...prev]);
    handleLog('GRADE_SUBMITTED', `Awarded ${score}/100 to ${sub.studentName}`);
  };

  // Administration: Course Management
  const handleAddCourse = (course: Course) => {
    setCourses(prev => [course, ...prev]);
    handleLog('COURSE_CREATED', `Added course ${course.code} - ${course.title}`);
  };

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c)));
    handleLog('COURSE_UPDATED', `Updated curriculum details for ${updatedCourse.code}`);
  };

  const handleDeleteCourse = (courseId: string) => {
    const c = courses.find(item => item.id === courseId);
    setCourses(prev => prev.filter(item => item.id !== courseId));
    setEnrollments(prev => prev.filter(item => item.courseId !== courseId));
    handleLog('COURSE_DELETED', `Deleted course ${c?.code || courseId}`);
  };

  const handleApproveCourse = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, status: 'published' } : c))
    );
    const c = courses.find(item => item.id === courseId);
    handleLog('COURSE_APPROVED', `Approved and published course ${c?.code || courseId}`);
  };

  // Administration: User Management
  const handleAddUser = (userData: Omit<User, 'id' | 'joined'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      anonymousAlias: userData.anonymousAlias || generateAnonymousAlias(userData.role),
      joined: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    handleLog('USER_CREATED', `Created ${newUser.role} account for ${newUser.anonymousAlias}`);
  };

  const handleSaveEditedUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    handleLog('USER_UPDATED', `Updated user record for ${updatedUser.name}`);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
    );
    handleLog('USER_STATUS_TOGGLED', `Toggled account status for user ID ${userId}`);
  };

  const handleResetUserPassword = (userId: string) => {
    const u = users.find(user => user.id === userId);
    setUsers(prev =>
      prev.map(item => (item.id === userId ? { ...item, password: 'Password@2025' } : item))
    );
    handleLog('PASSWORD_RESET', `Password reset to default for ${u?.name || userId}`);
    alert(`Password reset successfully for ${u?.name || userId}. Default password set to: Password@2025`);
  };

  const handleManageRole = (userId: string, newRole: UserRole) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
    const u = users.find(user => user.id === userId);
    handleLog('USER_ROLE_CHANGED', `Changed role of ${u?.name || userId} to ${newRole}`);
  };

  // Administration: Enrollment Management
  const handleAddEnrollment = (studentId: string, courseId: string) => {
    if (enrollments.some(e => e.studentId === studentId && e.courseId === courseId)) {
      alert('This student is already enrolled in this course.');
      return;
    }

    const newEnr: Enrollment = {
      id: `enr_${Date.now()}`,
      studentId,
      courseId,
      progressPercentage: 0,
      enrolledAt: new Date().toISOString().split('T')[0],
      status: 'active',
      completedLessonIds: []
    };

    setEnrollments(prev => [...prev, newEnr]);
    handleLog('ENROLLMENT_MANUALLY_ADDED', `Admin enrolled student ${studentId} into course ${courseId}`);
  };

  const handleRemoveEnrollment = (enrollmentId: string) => {
    setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
    handleLog('ENROLLMENT_DROPPED', `Removed enrollment record ${enrollmentId}`);
  };

  const handleUpdateEnrollmentProgress = (enrollmentId: string, newProgress: number) => {
    setEnrollments(prev =>
      prev.map(e =>
        e.id === enrollmentId
          ? {
              ...e,
              progressPercentage: newProgress,
              status: newProgress === 100 ? 'completed' : 'active'
            }
          : e
      )
    );
  };

  // Administration: Reports & System Backup
  const handleBackupData = () => {
    const backupSnapshot = {
      appName: 'Google Apps Script LMS',
      timestamp: new Date().toISOString(),
      institution: systemSettings.institutionName,
      academicTerm: systemSettings.academicTerm,
      tables: {
        Users: users,
        Courses: courses,
        Enrollments: enrollments,
        Submissions: submissions,
        Grades: grades,
        Announcements: announcements,
        Messages: messages,
        ActivityLogs: logs,
        SystemSettings: systemSettings
      }
    };

    const blob = new Blob([JSON.stringify(backupSnapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lms_complete_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    handleLog('DATA_BACKUP_CREATED', 'Exported complete database JSON snapshot across all 15 sheets');
  };

  const handleSaveSettings = (newSettings: SystemSettings) => {
    setSystemSettings(newSettings);
    handleLog('SETTINGS_CONFIGURED', 'Updated institution parameters and Google integration keys');
  };

  // Communication Actions
  const handleAddAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    handleLog('ANNOUNCEMENT_POSTED', `Notice published: ${ann.title}`);
  };

  const handleSendMessage = (
    receiverId: string,
    receiverName: string,
    subject: string,
    message: string,
    receiverAnonymousAlias?: string
  ) => {
    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAnonymousAlias: currentUser.anonymousAlias || 'Anon Peer',
      receiverId,
      receiverName,
      receiverAnonymousAlias,
      subject,
      message,
      isRead: false,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setMessages(prev => [newMsg, ...prev]);
    handleLog('MESSAGE_SENT', `Direct message sent to ${receiverAnonymousAlias || receiverName}`);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const userEnrollment = enrollments.find(
    e => e.courseId === selectedCourse?.id && e.studentId === currentUser?.id
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Fixed Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        isAuthenticated={isAuthenticated}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        isAuditUnmaskMode={isAuditUnmaskMode}
        onToggleAuditUnmask={() => setIsAuditUnmaskMode(prev => !prev)}
        onExtendTemporalSession={handleExtendTemporalSession}
      />

      <div className="flex-1 flex pt-16">
        {/* Navigation Sidebar Drawer */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentView={currentView}
          currentRole={currentRole}
          currentUser={currentUser}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
          onNewCourse={() => setIsNewCourseModalOpen(true)}
        />

        {/* Main Content Stage */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          {activeTab === 'gas' ? (
            /* Mode 2: Dedicated Google Apps Script Code & Deployment Hub */
            <GasExportHub />
          ) : (
            /* Mode 1: Interactive LMS Views */
            <>
              {/* Login & Registration View */}
              {currentView === 'login' && (
                <LoginView
                  users={users}
                  onLoginSuccess={handleLoginSuccess}
                  onRegisterUser={handleRegisterUser}
                  onLaunchTemporalLogin={handleLaunchTemporalLogin}
                  onCancel={() => setCurrentView('landing')}
                />
              )}

              {/* Landing Page */}
              {currentView === 'landing' && (
                <LandingView
                  courses={courses}
                  onNavigate={setCurrentView}
                  onSelectCourse={id => {
                    setSelectedCourseId(id);
                    setCurrentView('coursePlayer');
                  }}
                  onSwitchRole={handleRoleChange}
                />
              )}

              {/* Course Catalog */}
              {currentView === 'catalog' && (
                <CourseCatalogView
                  courses={courses}
                  enrollments={enrollments}
                  studentId={currentUser?.id}
                  onEnroll={handleEnroll}
                  onSelectCourse={id => {
                    setSelectedCourseId(id);
                    setCurrentView('coursePlayer');
                  }}
                />
              )}

              {/* Course Player */}
              {currentView === 'coursePlayer' && selectedCourse && (
                <CoursePlayerView
                  course={selectedCourse}
                  enrollment={userEnrollment}
                  studentId={currentUser?.id}
                  onBack={() => setCurrentView('catalog')}
                  onEnroll={handleEnroll}
                  onMarkLessonComplete={handleMarkLessonComplete}
                  onOpenQuiz={qId => setActiveQuizId(qId)}
                  onOpenAssignment={aId => setActiveAssignmentId(aId)}
                />
              )}

              {/* Dynamic Role Dashboard */}
              {currentView === 'dashboard' && (
                currentRole === 'student' ? (
                  <StudentDashboard
                    studentName={currentUser.name}
                    studentId={currentUser.id}
                    courses={courses}
                    enrollments={enrollments}
                    submissions={submissions.filter(s => s.studentId === currentUser.id)}
                    grades={grades.filter(g => g.studentId === currentUser.id)}
                    announcements={announcements}
                    onSelectCourse={id => {
                      setSelectedCourseId(id);
                      setCurrentView('coursePlayer');
                    }}
                    onNavigate={setCurrentView}
                  />
                ) : currentRole === 'lecturer' ? (
                  <LecturerStudio
                    lecturerName={currentUser.name}
                    courses={courses.filter(c => c.lecturerId === currentUser.id || currentRole === 'admin')}
                    submissions={submissions}
                    onOpenGrading={sub => setGradingSubmission(sub)}
                    onNewCourse={() => setIsNewCourseModalOpen(true)}
                    onPreviewCourse={id => {
                      setSelectedCourseId(id);
                      setCurrentView('coursePlayer');
                    }}
                  />
                ) : (
                  <AdminDashboard
                    users={users}
                    courses={courses}
                    enrollments={enrollments}
                    logs={logs}
                    onNavigate={setCurrentView}
                    onAddUser={() => setIsAddUserModalOpen(true)}
                    onEditUser={u => setEditingUser(u)}
                    onToggleUserStatus={handleToggleUserStatus}
                    onResetUserPassword={handleResetUserPassword}
                    onManageRole={handleManageRole}
                    onAddCourse={() => setIsNewCourseModalOpen(true)}
                    onEditCourse={c => setEditingCourse(c)}
                    onDeleteCourse={handleDeleteCourse}
                    onApproveCourse={handleApproveCourse}
                    onBackupData={handleBackupData}
                  />
                )
              )}

              {/* Explicit Student Dashboard */}
              {(currentView === 'studentDashboard' || currentView === 'myCourses') && (
                <StudentDashboard
                  studentName={currentUser.name}
                  studentId={currentUser.id}
                  courses={courses}
                  enrollments={enrollments}
                  submissions={submissions.filter(s => s.studentId === currentUser.id)}
                  grades={grades.filter(g => g.studentId === currentUser.id)}
                  announcements={announcements}
                  onSelectCourse={id => {
                    setSelectedCourseId(id);
                    setCurrentView('coursePlayer');
                  }}
                  onNavigate={setCurrentView}
                />
              )}

              {/* Explicit Lecturer Studio */}
              {currentView === 'lecturerStudio' && (
                <LecturerStudio
                  lecturerName={currentUser.name}
                  courses={courses.filter(c => c.lecturerId === currentUser.id || currentRole === 'admin')}
                  submissions={submissions}
                  onOpenGrading={sub => setGradingSubmission(sub)}
                  onNewCourse={() => setIsNewCourseModalOpen(true)}
                  onPreviewCourse={id => {
                    setSelectedCourseId(id);
                    setCurrentView('coursePlayer');
                  }}
                />
              )}

              {/* Explicit Admin Dashboard */}
              {currentView === 'adminDashboard' && (
                <AdminDashboard
                  users={users}
                  courses={courses}
                  enrollments={enrollments}
                  logs={logs}
                  onNavigate={setCurrentView}
                  onAddUser={() => setIsAddUserModalOpen(true)}
                  onEditUser={u => setEditingUser(u)}
                  onToggleUserStatus={handleToggleUserStatus}
                  onResetUserPassword={handleResetUserPassword}
                  onManageRole={handleManageRole}
                  onAddCourse={() => setIsNewCourseModalOpen(true)}
                  onEditCourse={c => setEditingCourse(c)}
                  onDeleteCourse={handleDeleteCourse}
                  onApproveCourse={handleApproveCourse}
                  onBackupData={handleBackupData}
                />
              )}

              {/* Navigation: Users (All) */}
              {currentView === 'users' && (
                <UsersManagementView
                  users={users}
                  defaultRoleFilter="all"
                  isAuditUnmaskMode={isAuditUnmaskMode}
                  title="User Accounts & Roles Management"
                  subtitle="Directory of institutional accounts synchronized with the Google Sheets Users table."
                  onAddUser={() => setIsAddUserModalOpen(true)}
                  onEditUser={u => setEditingUser(u)}
                  onToggleStatus={handleToggleUserStatus}
                  onResetPassword={handleResetUserPassword}
                  onManageRole={handleManageRole}
                />
              )}

              {/* Navigation: Students */}
              {currentView === 'students' && (
                <UsersManagementView
                  users={users}
                  defaultRoleFilter="student"
                  isAuditUnmaskMode={isAuditUnmaskMode}
                  title="Student Directory & Academic Accounts"
                  subtitle="Enrolled students with permission to study modules and take evaluations."
                  onAddUser={() => setIsAddUserModalOpen(true)}
                  onEditUser={u => setEditingUser(u)}
                  onToggleStatus={handleToggleUserStatus}
                  onResetPassword={handleResetUserPassword}
                  onManageRole={handleManageRole}
                />
              )}

              {/* Navigation: Lecturers */}
              {currentView === 'lecturers' && (
                <UsersManagementView
                  users={users}
                  defaultRoleFilter="lecturer"
                  isAuditUnmaskMode={isAuditUnmaskMode}
                  title="Faculty & Lecturer Roster"
                  subtitle="Instructors authorized to design courses, upload learning materials, and grade deliverables."
                  onAddUser={() => setIsAddUserModalOpen(true)}
                  onEditUser={u => setEditingUser(u)}
                  onToggleStatus={handleToggleUserStatus}
                  onResetPassword={handleResetUserPassword}
                  onManageRole={handleManageRole}
                />
              )}

              {/* Navigation: Courses */}
              {currentView === 'courses' && (
                <CoursesManagementView
                  courses={courses}
                  onAddCourse={() => setIsNewCourseModalOpen(true)}
                  onEditCourse={c => setEditingCourse(c)}
                  onDeleteCourse={handleDeleteCourse}
                  onApproveCourse={handleApproveCourse}
                  onPreviewCourse={id => {
                    setSelectedCourseId(id);
                    setCurrentView('coursePlayer');
                  }}
                />
              )}

              {/* Navigation: Enrollments */}
              {currentView === 'enrollments' && (
                <EnrollmentsView
                  enrollments={enrollments}
                  courses={courses}
                  users={users}
                  isAuditUnmaskMode={isAuditUnmaskMode}
                  onAddEnrollment={handleAddEnrollment}
                  onRemoveEnrollment={handleRemoveEnrollment}
                  onUpdateProgress={handleUpdateEnrollmentProgress}
                />
              )}

              {/* Navigation: Assessments */}
              {currentView === 'assessments' && (
                <AssessmentsView
                  courses={courses}
                  submissions={submissions}
                  currentUser={currentUser}
                  isAuditUnmaskMode={isAuditUnmaskMode}
                  onOpenGrading={sub => setGradingSubmission(sub)}
                  onSubmitAssignmentWork={asgId => setActiveAssignmentId(asgId)}
                  onTakeQuiz={qId => setActiveQuizId(qId)}
                />
              )}

              {/* Navigation: Reports */}
              {currentView === 'reports' && (
                <ReportsView
                  users={users}
                  courses={courses}
                  enrollments={enrollments}
                  grades={grades}
                  submissions={submissions}
                  logs={logs}
                />
              )}

              {/* Navigation: Settings */}
              {currentView === 'settings' && (
                <SettingsView
                  settings={systemSettings}
                  logs={logs}
                  onSaveSettings={handleSaveSettings}
                  onTriggerBackup={handleBackupData}
                />
              )}

              {/* Navigation: Announcements */}
              {currentView === 'announcements' && (
                <AnnouncementsView
                  announcements={announcements}
                  currentRole={currentRole}
                  authorName={currentUser.name}
                  authorAnonymousAlias={currentUser.anonymousAlias}
                  isAuditUnmaskMode={isAuditUnmaskMode}
                  onAddAnnouncement={handleAddAnnouncement}
                />
              )}

              {/* Navigation: Messages */}
              {currentView === 'messages' && (
                <MessagesView
                  currentUser={currentUser}
                  users={users}
                  messages={messages}
                  isAuditUnmaskMode={isAuditUnmaskMode}
                  onSendMessage={handleSendMessage}
                />
              )}

              {/* Sub-view: Assignments */}
              {currentView === 'assignments' && (
                <AssessmentsView
                  courses={courses}
                  submissions={submissions}
                  currentUser={currentUser}
                  isAuditUnmaskMode={isAuditUnmaskMode}
                  onOpenGrading={sub => setGradingSubmission(sub)}
                  onSubmitAssignmentWork={asgId => setActiveAssignmentId(asgId)}
                  onTakeQuiz={qId => setActiveQuizId(qId)}
                />
              )}

              {/* Sub-view: Grades */}
              {currentView === 'grades' && (
                <GradesView
                  studentName={currentUser.name}
                  grades={grades.filter(g => g.studentId === currentUser.id)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {activeQuizId && selectedCourse?.quizzes.length && (
        <QuizModal
          quiz={selectedCourse.quizzes.find(q => q.id === activeQuizId) || selectedCourse.quizzes[0]}
          onClose={() => setActiveQuizId(null)}
          onSubmitResult={handleSubmitQuizResult}
        />
      )}

      {activeAssignmentId && selectedCourse?.assignments.length && (
        <AssignmentModal
          assignment={
            selectedCourse.assignments.find(a => a.id === activeAssignmentId) ||
            selectedCourse.assignments[0]
          }
          studentName={currentUser.name}
          onClose={() => setActiveAssignmentId(null)}
          onSubmit={handleSubmitAssignment}
        />
      )}

      {gradingSubmission && (
        <GradingModal
          submission={gradingSubmission}
          isAuditUnmaskMode={isAuditUnmaskMode}
          onClose={() => setGradingSubmission(null)}
          onSaveGrade={handleSaveGrade}
        />
      )}

      {isNewCourseModalOpen && (
        <NewCourseModal
          lecturerName={currentUser.name}
          lecturerId={currentUser.id}
          onClose={() => setIsNewCourseModalOpen(false)}
          onSave={handleAddCourse}
        />
      )}

      {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => setIsAddUserModalOpen(false)}
          onAddUser={handleAddUser}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEditedUser}
        />
      )}

      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleEditCourse}
          onDelete={handleDeleteCourse}
          onApprove={handleApproveCourse}
        />
      )}
    </div>
  );
}
