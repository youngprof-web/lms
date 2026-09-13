export type UserRole = 'student' | 'lecturer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatar: string;
  joined: string;
  password?: string;
  anonymousAlias?: string;
  isTemporal?: boolean;
  temporalToken?: string;
  temporalExpiresAt?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  order: number;
  contentType: 'video' | 'text';
  contentUrl?: string;
  textContent?: string;
  durationMinutes: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description?: string;
  lessons: Lesson[];
}

export interface Material {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  fileType: 'pdf' | 'doc' | 'zip' | 'link';
  fileSize: string;
  driveViewUrl: string;
  driveDownloadUrl: string;
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentAnonymousAlias?: string;
  submittedAt: string;
  submissionText: string;
  fileDriveUrl?: string;
  fileName?: string;
  status: 'submitted' | 'graded';
  pointsEarned?: number;
  feedback?: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passPercentage: number;
  questions: Question[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lecturerId: string;
  lecturerName: string;
  thumbnail: string;
  status: 'published' | 'draft' | 'pending';
  modules: Module[];
  materials: Material[];
  assignments: Assignment[];
  quizzes: Quiz[];
  enrolledCount?: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progressPercentage: number;
  enrolledAt: string;
  completedAt?: string;
  status: 'active' | 'completed';
  completedLessonIds: string[];
}

export interface GradeItem {
  id: string;
  studentId: string;
  courseId?: string;
  title: string;
  itemType: 'quiz' | 'assignment';
  score: number;
  maxScore: number;
  percentage: number;
  gradedAt: string;
  feedback?: string;
}

export interface Announcement {
  id: string;
  courseId?: string;
  authorId?: string;
  authorName: string;
  authorAnonymousAlias?: string;
  authorRole: 'admin' | 'lecturer';
  title: string;
  content: string;
  targetRole?: 'all' | 'student' | 'lecturer';
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAnonymousAlias?: string;
  receiverId: string;
  receiverName: string;
  receiverAnonymousAlias?: string;
  subject: string;
  message: string;
  isRead: boolean;
  sentAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  details: string;
}

export interface SystemSettings {
  institutionName: string;
  academicTerm: string;
  allowOpenRegistration: boolean;
  driveFolderId: string;
  spreadsheetId: string;
  gradingScale: 'percentage' | 'gpa' | 'letters';
  backupIntervalDays: number;
  maintenanceMode: boolean;
}
