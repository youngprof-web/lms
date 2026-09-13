import { User, Course, Enrollment, Submission, GradeItem, Announcement, DirectMessage, ActivityLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_stud_1',
    name: 'Alex Rivera',
    email: 'student@lms.edu',
    role: 'student',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    joined: '2026-08-10',
    anonymousAlias: 'Anon Scholar #482'
  },
  {
    id: 'usr_lect_1',
    name: 'Prof. Marcus Chen',
    email: 'lecturer@lms.edu',
    role: 'lecturer',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    joined: '2026-05-14',
    anonymousAlias: 'Anon Instructor #319'
  },
  {
    id: 'usr_admin_1',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@lms.edu',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    joined: '2026-01-01',
    anonymousAlias: 'Anon Proctor #105'
  },
  {
    id: 'usr_stud_2',
    name: 'Elena Rostova',
    email: 'elena@lms.edu',
    role: 'student',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    joined: '2026-09-02',
    anonymousAlias: 'Anon Scholar #704'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_cs101',
    code: 'CS-101',
    title: 'Modern Web Development with JavaScript',
    description: 'Master HTML5, CSS3, ES6+ JavaScript, responsive layouts, and cloud deployment on Google infrastructure.',
    category: 'Computer Science',
    level: 'Beginner',
    duration: '8 Weeks',
    lecturerId: 'usr_lect_1',
    lecturerName: 'Prof. Marcus Chen',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
    status: 'published',
    modules: [
      {
        id: 'mod_1',
        courseId: 'crs_cs101',
        title: 'Module 1: Web Architecture & Semantic HTML',
        order: 1,
        description: 'Understand client-server architecture, HTTP response codes, and accessible semantic tagging.',
        lessons: [
          {
            id: 'les_1',
            moduleId: 'mod_1',
            courseId: 'crs_cs101',
            title: '1.1 Client-Server Web Protocols',
            order: 1,
            contentType: 'video',
            contentUrl: 'https://www.youtube-nocookie.com/embed/UB1O30fR-EE',
            textContent: `### Web Architecture & HTTP Communication

Web systems function on an asynchronous Request-Response protocol:
1. **The Client (Browser)** creates an HTTP GET or POST request targeting a specific URL endpoint.
2. **DNS Resolution** resolves the domain to an IP address.
3. **The Backend Server** (such as Google Apps Script's \`doGet\` or \`doPost\`) parses headers and payload parameters.
4. **The Database** (e.g. Google Sheets tables) performs CRUD queries.
5. **The Response** delivers structured HTML, CSS, or JSON back to the browser.`,
            durationMinutes: 20
          },
          {
            id: 'les_2',
            moduleId: 'mod_1',
            courseId: 'crs_cs101',
            title: '1.2 Semantic HTML5 & Modern Forms',
            order: 2,
            contentType: 'text',
            textContent: `### Semantic HTML Elements and Accessibility

Semantic elements clearly describe their meaning to both the browser and the developer:

* \`<header>\`: Introductory content or navigational aids
* \`<nav>\`: A section that links to other pages or parts within the page
* \`<main>\`: Dominant content of the document body
* \`<article>\`: Self-contained composition in a document
* \`<section>\`: Standalone thematic grouping of content

Using proper semantics ensures screen readers interpret navigation menus correctly, while search engines index key content with greater accuracy.`,
            durationMinutes: 30
          }
        ]
      },
      {
        id: 'mod_2',
        courseId: 'crs_cs101',
        title: 'Module 2: Responsive CSS & Modern Layouts',
        order: 2,
        description: 'Master CSS Grid, Flexbox alignment, and mobile-first media query architectures.',
        lessons: [
          {
            id: 'les_3',
            moduleId: 'mod_2',
            courseId: 'crs_cs101',
            title: '2.1 Mobile-First Viewports & Flexbox',
            order: 1,
            contentType: 'video',
            contentUrl: 'https://www.youtube-nocookie.com/embed/rg7Fvvl3taU',
            textContent: `### Mobile-First Responsive Design

In mobile-first design, styles are written for the smallest screen widths by default without media queries.

\`\`\`css
/* Base styles: Mobile viewports */
.container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

/* Tablet & Desktop breakpoint */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    padding: 2rem;
  }
}
\`\`\`

This strategy guarantees minimal CSS overhead for mobile devices and ensures clean progressive enhancement.`,
            durationMinutes: 40
          }
        ]
      }
    ],
    materials: [
      {
        id: 'mat_1',
        courseId: 'crs_cs101',
        moduleId: 'mod_1',
        title: 'CS101_Lecture_Notes_Week1.pdf',
        fileType: 'pdf',
        fileSize: '2.4 MB',
        driveViewUrl: 'https://drive.google.com',
        driveDownloadUrl: 'https://drive.google.com',
        uploadedAt: '2026-09-01'
      },
      {
        id: 'mat_2',
        courseId: 'crs_cs101',
        moduleId: 'mod_2',
        title: 'Responsive_CheatSheet_Guide.pdf',
        fileType: 'pdf',
        fileSize: '1.1 MB',
        driveViewUrl: 'https://drive.google.com',
        driveDownloadUrl: 'https://drive.google.com',
        uploadedAt: '2026-09-05'
      }
    ],
    assignments: [
      {
        id: 'asg_1',
        courseId: 'crs_cs101',
        moduleId: 'mod_1',
        title: 'Project 1: Responsive Portfolio Layout',
        description: 'Construct a single-page responsive web layout using semantic tags, accessible forms, and CSS Flexbox.',
        dueDate: '2026-10-15',
        maxPoints: 100
      }
    ],
    quizzes: [
      {
        id: 'qiz_1',
        courseId: 'crs_cs101',
        moduleId: 'mod_1',
        title: 'Module 1 Assessment: HTML & Web Standards',
        description: 'Assess foundational knowledge of HTML5, HTTP status codes, and browser rendering.',
        timeLimitMinutes: 15,
        passPercentage: 70,
        questions: [
          {
            id: 'que_1',
            quizId: 'qiz_1',
            questionText: 'Which HTTP status code signifies a successful request?',
            options: ['200 OK', '404 Not Found', '500 Internal Error', '301 Redirect'],
            correctAnswer: '200 OK',
            points: 25
          },
          {
            id: 'que_2',
            quizId: 'qiz_1',
            questionText: 'Which HTML5 semantic element should wrap primary navigation links?',
            options: ['<nav>', '<header>', '<menu>', '<aside>'],
            correctAnswer: '<nav>',
            points: 25
          },
          {
            id: 'que_3',
            quizId: 'qiz_1',
            questionText: 'In mobile-first responsive CSS architecture, which media query is standard?',
            options: ['@media (min-width: ...)', '@media (max-width: ...)', '@media (device-width)', 'None'],
            correctAnswer: '@media (min-width: ...)',
            points: 25
          },
          {
            id: 'que_4',
            quizId: 'qiz_1',
            questionText: 'Does Google Apps Script run server-side in Google Cloud infrastructure?',
            options: ['Yes, on Google cloud servers', 'No, strictly in browser memory', 'Only via local Node.js', 'None'],
            correctAnswer: 'Yes, on Google cloud servers',
            points: 25
          }
        ]
      }
    ]
  },
  {
    id: 'crs_ds201',
    code: 'DS-201',
    title: 'Data Science & Google Sheets Analysis',
    description: 'Analytical modeling, Google Sheets functions, statistical foundations, and data visualizations.',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '6 Weeks',
    lecturerId: 'usr_lect_1',
    lecturerName: 'Prof. Marcus Chen',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    status: 'published',
    modules: [
      {
        id: 'mod_ds_1',
        courseId: 'crs_ds201',
        title: 'Module 1: Relational Lookup & Advanced Formulas',
        order: 1,
        description: 'Harness XLOOKUP, INDEX/MATCH, and QUERY language for high-speed data retrieval.',
        lessons: [
          {
            id: 'les_ds_1',
            moduleId: 'mod_ds_1',
            courseId: 'crs_ds201',
            title: '1.1 Mastering the QUERY Function in Sheets',
            order: 1,
            contentType: 'text',
            textContent: `Google Sheets QUERY function utilizes SQL-like statements to aggregate, filter, and transform multi-column tables.

Example:
=QUERY(A1:E100, "SELECT A, B, SUM(E) WHERE D = 'active' GROUP BY A, B ORDER BY SUM(E) DESC", 1)`,
            durationMinutes: 35
          }
        ]
      }
    ],
    materials: [
      {
        id: 'mat_ds_1',
        courseId: 'crs_ds201',
        title: 'Spreadsheet_Data_Modeling_Guide.pdf',
        fileType: 'pdf',
        fileSize: '3.2 MB',
        driveViewUrl: 'https://drive.google.com',
        driveDownloadUrl: 'https://drive.google.com',
        uploadedAt: '2026-09-08'
      }
    ],
    assignments: [],
    quizzes: []
  },
  {
    id: 'crs_ai301',
    code: 'AI-301',
    title: 'Generative AI & Cloud Architecture',
    description: 'Principles of deep learning, LLMs, prompt engineering, and microservice infrastructure.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    duration: '10 Weeks',
    lecturerId: 'usr_admin_1',
    lecturerName: 'Dr. Sarah Jenkins',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600',
    status: 'published',
    modules: [
      {
        id: 'mod_ai_1',
        courseId: 'crs_ai301',
        title: 'Module 1: Transformer Foundations',
        order: 1,
        description: 'Self-attention mechanisms, encoder-decoder designs, and embedding vector spaces.',
        lessons: [
          {
            id: 'les_ai_1',
            moduleId: 'mod_ai_1',
            courseId: 'crs_ai301',
            title: '1.1 Attention Mechanisms Explained',
            order: 1,
            contentType: 'text',
            textContent: 'Understand how self-attention computes query, key, and value matrices across token sequences.',
            durationMinutes: 45
          }
        ]
      }
    ],
    materials: [],
    assignments: [],
    quizzes: []
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr_1',
    studentId: 'usr_stud_1',
    courseId: 'crs_cs101',
    progressPercentage: 50,
    enrolledAt: '2026-08-15',
    status: 'active',
    completedLessonIds: ['les_1']
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    assignmentId: 'asg_1',
    assignmentTitle: 'Project 1: Responsive Portfolio Layout',
    studentId: 'usr_stud_1',
    studentName: 'Alex Rivera',
    studentAnonymousAlias: 'Anon Scholar #482',
    submittedAt: '2026-09-12T14:30:00Z',
    submissionText: 'Here is my GitHub repository and Drive link for the responsive portfolio layout: https://github.com/alexrivera/portfolio-demo',
    fileDriveUrl: 'https://drive.google.com/demo-upload',
    fileName: 'AlexRivera_Portfolio_v1.zip',
    status: 'submitted',
    pointsEarned: undefined,
    feedback: ''
  }
];

export const INITIAL_GRADES: GradeItem[] = [
  {
    id: 'grd_1',
    studentId: 'usr_stud_1',
    courseId: 'crs_cs101',
    title: 'HTML & Semantic Web Basics',
    itemType: 'quiz',
    score: 90,
    maxScore: 100,
    percentage: 90,
    gradedAt: '2026-09-11',
    feedback: 'Excellent grasp of semantic elements and document structuring.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Welcome to the Cloud LMS Academic Portal',
    content: 'All course materials and Google Drive resources have been synchronized. Please review your syllabus and upcoming deadlines.',
    authorId: 'usr_admin_1',
    authorName: 'Dr. Sarah Jenkins',
    authorAnonymousAlias: 'Anon Proctor #105',
    authorRole: 'admin',
    createdAt: '2026-09-10'
  },
  {
    id: 'ann_2',
    courseId: 'crs_cs101',
    title: 'CS101 Office Hours & Google Meet Schedule',
    content: 'Live instructor Q&A will be hosted every Thursday at 3:00 PM UTC via Google Meet. Link posted in Module 1 resources.',
    authorId: 'usr_lect_1',
    authorName: 'Prof. Marcus Chen',
    authorAnonymousAlias: 'Anon Instructor #319',
    authorRole: 'lecturer',
    createdAt: '2026-09-11'
  }
];

export const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: 'msg_1',
    senderId: 'usr_lect_1',
    senderName: 'Prof. Marcus Chen',
    senderAnonymousAlias: 'Anon Instructor #319',
    receiverId: 'usr_stud_1',
    receiverName: 'Alex Rivera',
    receiverAnonymousAlias: 'Anon Scholar #482',
    subject: 'Feedback on Week 1 Submission',
    message: 'Great start Alex! Make sure to test your layout on screen widths below 375px before the final submission.',
    isRead: true,
    sentAt: '2026-09-12 10:15'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  { id: 'log_1', timestamp: '2026-09-13 08:00', userName: 'Dr. Sarah Jenkins', action: 'DATABASE_BOOTSTRAP', details: 'Initialized all 15 Google Sheets relational tables.' },
  { id: 'log_2', timestamp: '2026-09-13 09:15', userName: 'Alex Rivera', action: 'LESSON_COMPLETED', details: 'Completed lesson les_1 in course crs_cs101.' },
  { id: 'log_3', timestamp: '2026-09-13 10:30', userName: 'Alex Rivera', action: 'ASSIGNMENT_SUBMITTED', details: 'Submitted assignment Project 1.' }
];
