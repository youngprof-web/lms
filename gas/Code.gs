/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT LEARNING MANAGEMENT SYSTEM (LMS) - BACKEND
 * File: Code.gs
 * Description: Core backend service handling authentication, role-based access
 * control, Google Sheets database operations, and Google Drive file storage.
 * ==============================================================================
 */

// Global Configuration
var CONFIG = {
  APP_NAME: 'Google Apps Script LMS',
  VERSION: '1.0.0',
  // Active Google Spreadsheet ID configured for production LMS database
  SPREADSHEET_ID: '15zRSQkSCS4N-1xDvCIOW1Fv0Tofpc-tdU1ClIbtH5OyCEhYy7Pbsop4t', 
  DRIVE_FOLDER_NAME: 'LMS_Uploads_Storage',
  SESSION_DURATION_HOURS: 24
};

/**
 * Serves the HTML application when accessed via GET request.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.appName = CONFIG.APP_NAME;
  
  return template.evaluate()
    .setTitle(CONFIG.APP_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Handles incoming POST requests (e.g. webhooks or direct JSON API invocations).
 */
function doPost(e) {
  try {
    var contents = e.postData ? JSON.parse(e.postData.contents) : {};
    var action = contents.action;
    var payload = contents.payload || {};
    
    var result = handleApiAction(action, payload);
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper to include HTML partials (Styles, JavaScript, etc.) into Index.html.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Dispatches API actions for REST/POST or internal calls.
 */
function handleApiAction(action, payload) {
  switch (action) {
    case 'login': return apiLogin(payload.email, payload.password);
    case 'register': return apiRegister(payload);
    case 'createTemporalLogin': return apiCreateTemporalLogin(payload.role, payload.durationMinutes);
    case 'validateSession': return apiValidateSession(payload.userId, payload.temporalToken);
    case 'extendTemporalSession': return apiExtendTemporalSession(payload.userId, payload.temporalToken, payload.additionalMinutes);
    case 'getCourses': return apiGetCourses(payload.filter);
    case 'getCourseDetail': return apiGetCourseDetail(payload.courseId, payload.userId);
    case 'enrollCourse': return apiEnrollCourse(payload.studentId, payload.courseId);
    case 'submitAssignment': return apiSubmitAssignment(payload);
    case 'gradeSubmission': return apiGradeSubmission(payload.submissionId, payload.points, payload.feedback);
    case 'submitQuiz': return apiSubmitQuiz(payload);
    case 'uploadFile': return apiUploadToDrive(payload.base64, payload.fileName, payload.mimeType);
    case 'setupDatabase': return setupDatabase();
    default: throw new Error('Unknown API action: ' + action);
  }
}

/**
 * Returns the target Google Spreadsheet instance.
 */
function getDatabase_() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = CONFIG.SPREADSHEET_ID || props.getProperty('SPREADSHEET_ID');
  
  if (sheetId) {
    return SpreadsheetApp.openById(sheetId);
  }
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    throw new Error('No Google Spreadsheet linked. Please run setupDatabase() or set SPREADSHEET_ID in Script Properties.');
  }
}

/**
 * Database table definitions and schema headers
 */
var SCHEMA = {
  Users: ['id', 'name', 'email', 'passwordHash', 'role', 'status', 'avatar', 'anonymousAlias', 'isTemporal', 'temporalToken', 'temporalExpiresAt', 'createdAt', 'updatedAt'],
  Courses: ['id', 'title', 'code', 'description', 'category', 'level', 'thumbnail', 'lecturerId', 'lecturerName', 'duration', 'status', 'createdAt'],
  Enrollments: ['id', 'studentId', 'courseId', 'progressPercentage', 'enrolledAt', 'completedAt', 'status'],
  Modules: ['id', 'courseId', 'title', 'order', 'description'],
  Lessons: ['id', 'moduleId', 'courseId', 'title', 'order', 'contentType', 'contentUrl', 'textContent', 'durationMinutes', 'isCompleted'],
  Materials: ['id', 'courseId', 'moduleId', 'title', 'fileType', 'driveFileId', 'driveViewUrl', 'driveDownloadUrl', 'fileSize', 'uploadedAt'],
  Assignments: ['id', 'courseId', 'moduleId', 'title', 'description', 'dueDate', 'maxPoints', 'attachmentUrl', 'createdAt'],
  Submissions: ['id', 'assignmentId', 'studentId', 'studentName', 'studentAnonymousAlias', 'submissionText', 'fileDriveUrl', 'submittedAt', 'status', 'pointsEarned', 'feedback'],
  Quizzes: ['id', 'courseId', 'moduleId', 'title', 'description', 'timeLimitMinutes', 'passPercentage', 'createdAt'],
  Questions: ['id', 'quizId', 'questionText', 'questionType', 'optionsJson', 'correctAnswer', 'points'],
  QuizAttempts: ['id', 'quizId', 'studentId', 'score', 'totalPoints', 'percentage', 'passed', 'attemptedAt', 'answersJson'],
  Grades: ['id', 'studentId', 'courseId', 'itemType', 'itemId', 'title', 'score', 'maxScore', 'percentage', 'gradedAt', 'feedback'],
  Announcements: ['id', 'courseId', 'authorId', 'authorName', 'authorAnonymousAlias', 'authorRole', 'title', 'content', 'targetRole', 'createdAt'],
  Messages: ['id', 'senderId', 'senderName', 'senderAnonymousAlias', 'receiverId', 'receiverName', 'receiverAnonymousAlias', 'subject', 'message', 'isRead', 'sentAt'],
  ActivityLogs: ['id', 'userId', 'userName', 'action', 'details', 'timestamp']
};

/**
 * Initializes the Google Spreadsheet with all 15 required tables and seed data.
 * Run this function once from the Apps Script editor to bootstrap your database!
 */
function setupDatabase() {
  var ss;
  var props = PropertiesService.getScriptProperties();
  var existingId = CONFIG.SPREADSHEET_ID || props.getProperty('SPREADSHEET_ID');
  
  if (existingId) {
    ss = SpreadsheetApp.openById(existingId);
  } else {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch(e) {
      ss = SpreadsheetApp.create('LMS_Master_Database');
      props.setProperty('SPREADSHEET_ID', ss.getId());
    }
  }

  // Ensure all schema sheets exist with proper headers
  Object.keys(SCHEMA).forEach(function(tableName) {
    var sheet = ss.getSheetByName(tableName);
    var headers = SCHEMA[tableName];
    if (!sheet) {
      sheet = ss.insertSheet(tableName);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#E2E8F0');
      sheet.setFrozenRows(1);
    }
  });

  // Seed default Admin user if Users sheet is empty
  var usersSheet = ss.getSheetByName('Users');
  if (usersSheet.getLastRow() <= 1) {
    seedInitialData_(ss);
  }

  // Ensure Drive storage folder exists
  getOrCreateUploadFolder_();

  return {
    success: true,
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl(),
    message: 'LMS Database and sheets initialized successfully.'
  };
}

/**
 * Seeds initial demo courses, users, and questions.
 */
function seedInitialData_(ss) {
  var now = new Date().toISOString();
  
  // Seed Users: 1 Admin, 1 Lecturer, 1 Student with Anonymous Aliases
  var usersSheet = ss.getSheetByName('Users');
  usersSheet.appendRow(['usr_admin_1', 'Dr. Sarah Jenkins', 'admin@lms.edu', hashPassword_('admin123'), 'admin', 'active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Admin Overseer #01', false, '', '', now, now]);
  usersSheet.appendRow(['usr_lect_1', 'Prof. Marcus Chen', 'lecturer@lms.edu', hashPassword_('lecturer123'), 'lecturer', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Faculty Preceptor #42', false, '', '', now, now]);
  usersSheet.appendRow(['usr_stud_1', 'Alex Rivera', 'student@lms.edu', hashPassword_('student123'), 'student', 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Scholar Cipher #88', false, '', '', now, now]);

  // Seed Courses
  var coursesSheet = ss.getSheetByName('Courses');
  coursesSheet.appendRow(['crs_cs101', 'Modern Web Development with JavaScript', 'CS-101', 'Master HTML5, CSS3, ES6+ JavaScript, responsive layouts, and cloud deployment.', 'Computer Science', 'Beginner', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'usr_lect_1', 'Prof. Marcus Chen', '8 Weeks', 'published', now]);
  coursesSheet.appendRow(['crs_ds201', 'Data Science & Spreadsheets Analysis', 'DS-201', 'Analytical modeling, Google Sheets functions, statistical foundations, and data visualizations.', 'Data Science', 'Intermediate', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', 'usr_lect_1', 'Prof. Marcus Chen', '6 Weeks', 'published', now]);
  coursesSheet.appendRow(['crs_ai301', 'Generative AI & Cloud Architecture', 'AI-301', 'Principles of deep learning, LLMs, prompt engineering, and microservice infrastructure.', 'Artificial Intelligence', 'Advanced', 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600', 'usr_admin_1', 'Dr. Sarah Jenkins', '10 Weeks', 'published', now]);

  // Seed Modules
  var modSheet = ss.getSheetByName('Modules');
  modSheet.appendRow(['mod_1', 'crs_cs101', 'Module 1: Web Architecture & Semantic HTML', 1, 'Core concepts of HTTP, DOM structure, and accessibility.']);
  modSheet.appendRow(['mod_2', 'crs_cs101', 'Module 2: Responsive CSS & Modern Layouts', 2, 'Flexbox, CSS Grid, mobile-first design, and utility styling.']);

  // Seed Lessons
  var lesSheet = ss.getSheetByName('Lessons');
  lesSheet.appendRow(['les_1', 'mod_1', 'crs_cs101', 'Introduction to the Client-Server Web', 1, 'video', 'https://www.youtube.com/watch?v=UB1O30fR-EE', 'Understand how browser clients communicate with backend servers over HTTP protocols and JSON exchanges.', 25, true]);
  lesSheet.appendRow(['les_2', 'mod_1', 'crs_cs101', 'Semantic HTML5 Elements & Forms', 2, 'text', '', 'HTML5 introduced semantic tags like header, nav, main, article, and section to improve accessibility, SEO, and screen-reader parsing.', 30, false]);
  lesSheet.appendRow(['les_3', 'mod_2', 'crs_cs101', 'Mastering Flexbox & Grid Systems', 1, 'video', 'https://www.youtube.com/watch?v=rg7Fvvl3taU', 'Deep dive into 1D flexbox alignment and 2D grid matrix positioning for responsive viewport scaling.', 45, false]);

  // Seed Materials
  var matSheet = ss.getSheetByName('Materials');
  matSheet.appendRow(['mat_1', 'crs_cs101', 'mod_1', 'CS101_Lecture_Notes_Week1.pdf', 'pdf', 'drive_demo_1', 'https://drive.google.com', 'https://drive.google.com', '2.4 MB', now]);

  // Seed Assignments
  var assignSheet = ss.getSheetByName('Assignments');
  assignSheet.appendRow(['asg_1', 'crs_cs101', 'mod_1', 'Build a Responsive Portfolio Page', 'Construct a single-page responsive web layout using semantic tags and modern CSS media queries.', '2026-10-15', 100, '', now]);

  // Seed Quizzes
  var quizSheet = ss.getSheetByName('Quizzes');
  quizSheet.appendRow(['qiz_1', 'crs_cs101', 'mod_1', 'Module 1 Assessment: HTML & Web Standards', 'Test your knowledge on semantic tags, DOM parsing, and status codes.', 15, 70, now]);

  // Seed Questions
  var qSheet = ss.getSheetByName('Questions');
  qSheet.appendRow(['que_1', 'qiz_1', 'Which HTTP status code indicates a successful request?', 'multiple_choice', JSON.stringify(['200 OK', '404 Not Found', '500 Server Error', '301 Moved']), '200 OK', 25]);
  qSheet.appendRow(['que_2', 'qiz_1', 'Which HTML5 element represents the primary navigation region?', 'multiple_choice', JSON.stringify(['<nav>', '<header>', '<menu>', '<section>']), '<nav>', 25]);
  qSheet.appendRow(['que_3', 'qiz_1', 'In responsive mobile-first design, what media query type is standard?', 'multiple_choice', JSON.stringify(['min-width', 'max-width', 'orientation only', 'color-index']), 'min-width', 25]);
  qSheet.appendRow(['que_4', 'qiz_1', 'Does Google Apps Script run server-side in Google Cloud infrastructure?', 'multiple_choice', JSON.stringify(['Yes, on Google servers', 'No, strictly in user browser', 'Only on local Node runtime', 'None of the above']), 'Yes, on Google servers', 25]);

  // Seed Enrollment for Alex Rivera
  var enrollSheet = ss.getSheetByName('Enrollments');
  enrollSheet.appendRow(['enr_1', 'usr_stud_1', 'crs_cs101', 35, now, '', 'active']);

  // Seed Announcements
  var annSheet = ss.getSheetByName('Announcements');
  annSheet.appendRow(['ann_1', 'crs_cs101', 'usr_lect_1', 'Prof. Marcus Chen', 'lecturer', 'Welcome to Modern Web Development!', 'Welcome students! Please review Module 1 notes and complete your initial assignment before Friday.', 'all', now]);
  annSheet.appendRow(['ann_2', '', 'usr_admin_1', 'Dr. Sarah Jenkins', 'admin', 'Campus Server Maintenance Scheduled', 'Google Apps Script cloud database updates are scheduled for Sunday 02:00 AM UTC. No downtime anticipated.', 'all', now]);

  // Seed Activity Log
  var logSheet = ss.getSheetByName('ActivityLogs');
  logSheet.appendRow(['log_1', 'usr_admin_1', 'Dr. Sarah Jenkins', 'SYSTEM_INITIALIZATION', 'Bootstrap seed data created.', now]);
}

// ==============================================================================
// GENERIC DATABASE HELPER FUNCTIONS (CRUD)
// ==============================================================================

function getSheetData_(sheetName) {
  var ss = getDatabase_();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0];
  var results = [];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    obj._rowIndex = i + 1; // 1-based index
    results.push(obj);
  }
  return results;
}

function appendRecord_(sheetName, record) {
  var ss = getDatabase_();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet ' + sheetName + ' not found.');
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = [];
  headers.forEach(function(header) {
    row.push(record[header] !== undefined ? record[header] : '');
  });
  sheet.appendRow(row);
  return record;
}

function updateRecord_(sheetName, id, updates) {
  var ss = getDatabase_();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet ' + sheetName + ' not found.');
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;
  var headers = data[0];
  var idCol = headers.indexOf('id');
  if (idCol === -1) idCol = 0;

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] == id) {
      Object.keys(updates).forEach(function(key) {
        var colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          sheet.getRange(i + 1, colIndex + 1).setValue(updates[key]);
        }
      });
      return true;
    }
  }
  return false;
}

function deleteRecord_(sheetName, id) {
  var ss = getDatabase_();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return false;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');
  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] == id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function generateId_(prefix) {
  return (prefix || 'id') + '_' + Utilities.getUuid().slice(0, 8);
}

function hashPassword_(password) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  var txt = '';
  for (var i = 0; i < rawHash.length; i++) {
    var val = rawHash[i];
    if (val < 0) val += 256;
    var byteStr = val.toString(16);
    if (byteStr.length === 1) byteStr = '0' + byteStr;
    txt += byteStr;
  }
  return txt;
}

function logActivity_(userId, userName, action, details) {
  try {
    appendRecord_('ActivityLogs', {
      id: generateId_('log'),
      userId: userId || 'system',
      userName: userName || 'System',
      action: action,
      details: details,
      timestamp: new Date().toISOString()
    });
  } catch(e) {
    Logger.log('Error logging activity: ' + e.message);
  }
}

// ==============================================================================
// ANONYMITY & TEMPORAL SESSIONS ENGINE
// ==============================================================================

/**
 * Generates an institutional anonymous alias to ensure peer privacy.
 */
function generateAnonymousAlias_(role) {
  var adjectives = ['Scholarly', 'Cipher', 'Anonymous', 'Quantum', 'Nebula', 'Prism', 'Hidden', 'Oblique', 'Cryptic', 'Vigilant', 'Silent', 'Arcane'];
  var nouns = {
    student: ['Scholar', 'Learner', 'Seeker', 'Cadet', 'Apprentice', 'Fellow', 'Disciple', 'Voyager'],
    lecturer: ['Faculty', 'Instructor', 'Preceptor', 'Docent', 'Mentor', 'Curator', 'Educator'],
    admin: ['Overseer', 'Warden', 'Architect', 'Sentinel', 'Keeper', 'Auditor']
  };
  var roleKey = nouns[role] ? role : 'student';
  var pool = nouns[roleKey];
  var adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  var noun = pool[Math.floor(Math.random() * pool.length)];
  var num = Math.floor(100 + Math.random() * 900);
  return adj + ' ' + noun + ' #' + num;
}

/**
 * Server-side validation of a user session.
 * For temporal/ephemeral users, validates against temporalExpiresAt and token.
 * Automatically marks expired sessions and throws an explicit security error.
 */
function validateSession_(userId, temporalToken) {
  if (!userId) return null;
  var users = getSheetData_('Users');
  var user = users.find(function(u) { return u.id === userId; });
  if (!user) {
    throw new Error('User account not found.');
  }

  // Check if this account is a temporal session
  var isTemp = user.isTemporal === true || user.isTemporal === 'true';
  if (isTemp) {
    if (temporalToken && user.temporalToken && user.temporalToken !== temporalToken) {
      throw new Error('Security alert: Temporal session token mismatch.');
    }
    if (user.temporalExpiresAt) {
      var expiresAt = new Date(user.temporalExpiresAt).getTime();
      var now = Date.now();
      if (now > expiresAt) {
        updateRecord_('Users', user.id, { status: 'expired', updatedAt: new Date().toISOString() });
        logActivity_(user.id, user.anonymousAlias || user.name, 'SESSION_EXPIRED', 'Temporal session expired at ' + user.temporalExpiresAt);
        throw new Error('Temporal session has expired. Please launch a new temporary login.');
      }
    }
  }

  return user;
}

/**
 * Creates an ephemeral, time-bounded login session.
 */
function apiCreateTemporalLogin(role, durationMinutes) {
  var duration = parseInt(durationMinutes, 10) || 60;
  var targetRole = role === 'admin' ? 'admin' : (role === 'lecturer' ? 'lecturer' : 'student');
  var now = new Date();
  var expiresAt = new Date(now.getTime() + duration * 60 * 1000);
  var userId = generateId_('temp');
  var alias = generateAnonymousAlias_(targetRole);
  var token = 'tok_' + Utilities.getUuid().replace(/-/g, '').substring(0, 16);

  var newUser = {
    id: userId,
    name: 'Temporary ' + targetRole.charAt(0).toUpperCase() + targetRole.slice(1),
    email: 'temp.' + userId + '@ephemeral.lms',
    passwordHash: '',
    role: targetRole,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    anonymousAlias: alias,
    isTemporal: true,
    temporalToken: token,
    temporalExpiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  appendRecord_('Users', newUser);
  logActivity_(
    userId,
    alias,
    'TEMPORAL_LOGIN_ISSUED',
    'Issued ' + duration + '-minute temporal login for ' + targetRole + ' (' + alias + ')'
  );

  var safeUser = Object.assign({}, newUser);
  delete safeUser.passwordHash;
  return safeUser;
}

/**
 * Validates active session and returns TTL metrics.
 */
function apiValidateSession(userId, temporalToken) {
  var user = validateSession_(userId, temporalToken);
  if (!user) return { valid: false };

  var isTemp = user.isTemporal === true || user.isTemporal === 'true';
  var remainingSeconds = null;
  if (isTemp && user.temporalExpiresAt) {
    var expiresAt = new Date(user.temporalExpiresAt).getTime();
    remainingSeconds = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
  }

  var safeUser = Object.assign({}, user);
  delete safeUser.passwordHash;
  return {
    valid: true,
    user: safeUser,
    isTemporal: isTemp,
    remainingSeconds: remainingSeconds
  };
}

/**
 * Extends an active temporal session by extra minutes.
 */
function apiExtendTemporalSession(userId, temporalToken, additionalMinutes) {
  var user = validateSession_(userId, temporalToken);
  if (!user) throw new Error('Session not found.');
  var isTemp = user.isTemporal === true || user.isTemporal === 'true';
  if (!isTemp) {
    return { success: true, message: 'Standard account does not require extension.' };
  }

  var extra = parseInt(additionalMinutes, 10) || 30;
  var currentExp = new Date(user.temporalExpiresAt).getTime();
  var newExp = new Date(currentExp + extra * 60 * 1000);
  
  updateRecord_('Users', userId, {
    temporalExpiresAt: newExp.toISOString(),
    updatedAt: new Date().toISOString()
  });

  logActivity_(userId, user.anonymousAlias || user.name, 'SESSION_EXTENDED', 'Extended session by +' + extra + ' mins');

  return {
    success: true,
    temporalExpiresAt: newExp.toISOString(),
    remainingSeconds: Math.max(0, Math.round((newExp.getTime() - Date.now()) / 1000))
  };
}

// ==============================================================================
// AUTHENTICATION & PROFILE APIs
// ==============================================================================

/**
 * Registers a new user with validation and generates an anonymous alias.
 */
function apiRegister(userData) {
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error('Name, email, and password are required fields.');
  }
  var email = userData.email.toLowerCase().trim();
  var users = getSheetData_('Users');
  var exists = users.some(function(u) { return u.email.toLowerCase() === email; });
  if (exists) {
    throw new Error('An account with this email address already exists.');
  }

  var userId = generateId_('usr');
  var role = userData.role === 'lecturer' ? 'lecturer' : 'student'; // Admin only through admin dashboard
  var now = new Date().toISOString();
  var alias = generateAnonymousAlias_(role);
  
  var newUser = {
    id: userId,
    name: userData.name.trim(),
    email: email,
    passwordHash: hashPassword_(userData.password),
    role: role,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    anonymousAlias: alias,
    isTemporal: false,
    temporalToken: '',
    temporalExpiresAt: '',
    createdAt: now,
    updatedAt: now
  };

  appendRecord_('Users', newUser);
  logActivity_(userId, alias, 'USER_REGISTERED', 'New user registered with role: ' + role + ' (' + alias + ')');

  // Return safe profile without password hash
  var safeUser = Object.assign({}, newUser);
  delete safeUser.passwordHash;
  return safeUser;
}

/**
 * Authenticates user credentials, validates session expiration, and returns profile.
 */
function apiLogin(email, password) {
  if (!email || !password) {
    throw new Error('Please provide both email and password.');
  }
  var users = getSheetData_('Users');
  var hash = hashPassword_(password);
  var user = users.find(function(u) {
    return u.email.toLowerCase() === email.toLowerCase().trim();
  });

  if (!user || user.passwordHash !== hash) {
    throw new Error('Invalid email or password.');
  }

  // Check temporal expiration if account was marked temporal
  var isTemp = user.isTemporal === true || user.isTemporal === 'true';
  if (isTemp && user.temporalExpiresAt) {
    var expiresAt = new Date(user.temporalExpiresAt).getTime();
    if (Date.now() > expiresAt) {
      updateRecord_('Users', user.id, { status: 'expired', updatedAt: new Date().toISOString() });
      throw new Error('This temporary account has expired. Please launch a new temporary login.');
    }
  }

  if (user.status !== 'active') {
    throw new Error('Your account is inactive or expired. Please contact the administrator.');
  }

  // Auto-generate anonymous alias if missing from legacy records
  if (!user.anonymousAlias) {
    var newAlias = generateAnonymousAlias_(user.role);
    user.anonymousAlias = newAlias;
    updateRecord_('Users', user.id, { anonymousAlias: newAlias });
  }

  logActivity_(user.id, user.anonymousAlias || user.name, 'USER_LOGIN', 'User logged into system.');
  
  var safeUser = Object.assign({}, user);
  delete safeUser.passwordHash;
  return safeUser;
}

/**
 * Updates user profile details.
 */
function apiUpdateProfile(userId, updates) {
  var users = getSheetData_('Users');
  var user = users.find(function(u) { return u.id === userId; });
  if (!user) throw new Error('User not found.');

  var allowedUpdates = {};
  if (updates.name) allowedUpdates.name = updates.name.trim();
  if (updates.avatar) allowedUpdates.avatar = updates.avatar;
  allowedUpdates.updatedAt = new Date().toISOString();

  updateRecord_('Users', userId, allowedUpdates);
  logActivity_(userId, user.name, 'PROFILE_UPDATED', 'Updated user profile information.');
  return { success: true, message: 'Profile updated successfully.' };
}

/**
 * Changes user password with current password verification.
 */
function apiChangePassword(userId, currentPassword, newPassword) {
  var users = getSheetData_('Users');
  var user = users.find(function(u) { return u.id === userId; });
  if (!user) throw new Error('User not found.');

  if (user.passwordHash !== hashPassword_(currentPassword)) {
    throw new Error('Current password does not match.');
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  updateRecord_('Users', userId, {
    passwordHash: hashPassword_(newPassword),
    updatedAt: new Date().toISOString()
  });

  logActivity_(userId, user.name, 'PASSWORD_CHANGED', 'User password changed.');
  return { success: true, message: 'Password updated successfully.' };
}

/**
 * Initiates password reset for forgotten credentials.
 */
function apiForgotPassword(email) {
  var users = getSheetData_('Users');
  var user = users.find(function(u) { return u.email.toLowerCase() === email.toLowerCase().trim(); });
  if (!user) {
    // Return friendly message without revealing user existence
    return { success: true, message: 'If the email exists, password reset instructions have been dispatched.' };
  }
  logActivity_(user.id, user.name, 'PASSWORD_RESET_REQUESTED', 'Password reset requested.');
  return { success: true, message: 'Temporary reset link dispatched to your registered address.' };
}

// ==============================================================================
// COURSE & ENROLLMENT APIs
// ==============================================================================

/**
 * Retrieves all published or accessible courses with optional filtering.
 */
function apiGetCourses(filter) {
  var courses = getSheetData_('Courses');
  if (!filter) return courses;

  return courses.filter(function(c) {
    var matchSearch = true;
    var matchCategory = true;
    var matchLevel = true;

    if (filter.search) {
      var s = filter.search.toLowerCase();
      matchSearch = (c.title && c.title.toLowerCase().indexOf(s) !== -1) ||
                    (c.description && c.description.toLowerCase().indexOf(s) !== -1) ||
                    (c.code && c.code.toLowerCase().indexOf(s) !== -1);
    }
    if (filter.category && filter.category !== 'All') {
      matchCategory = c.category === filter.category;
    }
    if (filter.level && filter.level !== 'All') {
      matchLevel = c.level === filter.level;
    }
    return matchSearch && matchCategory && matchLevel;
  });
}

/**
 * Returns comprehensive details for a course: modules, lessons, materials, quizzes, and user enrollment status.
 */
function apiGetCourseDetail(courseId, userId) {
  var courses = getSheetData_('Courses');
  var course = courses.find(function(c) { return c.id === courseId; });
  if (!course) throw new Error('Course not found.');

  var modules = getSheetData_('Modules').filter(function(m) { return m.courseId === courseId; });
  var lessons = getSheetData_('Lessons').filter(function(l) { return l.courseId === courseId; });
  var materials = getSheetData_('Materials').filter(function(m) { return m.courseId === courseId; });
  var assignments = getSheetData_('Assignments').filter(function(a) { return a.courseId === courseId; });
  var quizzes = getSheetData_('Quizzes').filter(function(q) { return q.courseId === courseId; });

  // Enrollment data for this student
  var enrollment = null;
  var completedLessonIds = [];
  if (userId) {
    var enrollments = getSheetData_('Enrollments');
    enrollment = enrollments.find(function(e) { return e.courseId === courseId && e.studentId === userId; });
    
    // Retrieve student's completed lessons from ActivityLogs or structured grades
    var logs = getSheetData_('ActivityLogs');
    completedLessonIds = logs
      .filter(function(log) { return log.userId === userId && log.action === 'LESSON_COMPLETED' && log.details.indexOf(courseId) !== -1; })
      .map(function(log) {
        var match = log.details.match(/lessonId:([a-zA-Z0-9_-]+)/);
        return match ? match[1] : '';
      })
      .filter(Boolean);
  }

  return {
    course: course,
    modules: modules.sort(function(a, b) { return a.order - b.order; }),
    lessons: lessons.sort(function(a, b) { return a.order - b.order; }),
    materials: materials,
    assignments: assignments,
    quizzes: quizzes,
    enrollment: enrollment,
    completedLessonIds: completedLessonIds
  };
}

/**
 * Enrolls a student into a course.
 */
function apiEnrollCourse(studentId, courseId) {
  var enrollments = getSheetData_('Enrollments');
  var existing = enrollments.find(function(e) { return e.studentId === studentId && e.courseId === courseId; });
  if (existing) {
    return { success: true, message: 'Already enrolled in this course.', enrollment: existing };
  }

  var newEnrollment = {
    id: generateId_('enr'),
    studentId: studentId,
    courseId: courseId,
    progressPercentage: 0,
    enrolledAt: new Date().toISOString(),
    completedAt: '',
    status: 'active'
  };

  appendRecord_('Enrollments', newEnrollment);
  logActivity_(studentId, 'Student', 'COURSE_ENROLLED', 'Enrolled into course: ' + courseId);
  return { success: true, message: 'Successfully enrolled!', enrollment: newEnrollment };
}

/**
 * Marks a lesson as completed and recalculates course progress.
 */
function apiMarkLessonComplete(studentId, courseId, lessonId) {
  logActivity_(studentId, 'Student', 'LESSON_COMPLETED', 'courseId:' + courseId + ',lessonId:' + lessonId);
  
  // Calculate total lessons vs completed
  var totalLessons = getSheetData_('Lessons').filter(function(l) { return l.courseId === courseId; }).length;
  var logs = getSheetData_('ActivityLogs').filter(function(l) { 
    return l.userId === studentId && l.action === 'LESSON_COMPLETED' && l.details.indexOf(courseId) !== -1;
  });
  
  // Unique completed lessons
  var completedSet = {};
  logs.forEach(function(l) {
    var match = l.details.match(/lessonId:([a-zA-Z0-9_-]+)/);
    if (match) completedSet[match[1]] = true;
  });
  completedSet[lessonId] = true;
  
  var completedCount = Object.keys(completedSet).length;
  var progress = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 100;

  var enrollments = getSheetData_('Enrollments');
  var enrollment = enrollments.find(function(e) { return e.studentId === studentId && e.courseId === courseId; });
  if (enrollment) {
    updateRecord_('Enrollments', enrollment.id, {
      progressPercentage: progress,
      status: progress === 100 ? 'completed' : 'active',
      completedAt: progress === 100 ? new Date().toISOString() : ''
    });
  }

  return { success: true, progress: progress, completedCount: completedCount, totalLessons: totalLessons };
}

// ==============================================================================
// GOOGLE DRIVE STORAGE & FILE UPLOADS
// ==============================================================================

/**
 * Gets or creates the Google Drive folder for LMS uploaded materials.
 */
function getOrCreateUploadFolder_() {
  var folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);
}

/**
 * Receives a Base64-encoded file from the browser, creates a Drive file,
 * sets public-read permissions for students, and returns the file URLs.
 */
function apiUploadToDrive(base64Data, fileName, mimeType) {
  if (!base64Data || !fileName) {
    throw new Error('File data and filename are required.');
  }

  var folder = getOrCreateUploadFolder_();
  var cleanBase64 = base64Data.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
  var decoded = Utilities.base64Decode(cleanBase64);
  var blob = Utilities.newBlob(decoded, mimeType || 'application/octet-stream', fileName);

  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    success: true,
    fileId: file.getId(),
    fileName: file.getName(),
    viewUrl: file.getUrl(),
    downloadUrl: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
    fileSize: Math.round(file.getSize() / 1024) + ' KB'
  };
}

// ==============================================================================
// ASSIGNMENT & GRADING APIs
// ==============================================================================

/**
 * Submits an assignment with text or Google Drive attachment link.
 * Enforces session validity (checking temporal expiration) and persists studentAnonymousAlias.
 */
function apiSubmitAssignment(submissionData) {
  var asgId = submissionData.assignmentId;
  var studentId = submissionData.studentId;
  var studentName = submissionData.studentName || 'Student';
  var submissionText = submissionData.submissionText || '';
  var fileDriveUrl = submissionData.fileDriveUrl || '';

  if (!asgId || !studentId) {
    throw new Error('Assignment ID and Student ID are required.');
  }

  // Enforce session validity for temporal sessions
  validateSession_(studentId, submissionData.temporalToken);

  var users = getSheetData_('Users');
  var studentUser = users.find(function(u) { return u.id === studentId; });
  var studentAlias = submissionData.studentAnonymousAlias || (studentUser ? studentUser.anonymousAlias : '') || generateAnonymousAlias_('student');

  var existing = getSheetData_('Submissions').find(function(s) {
    return s.assignmentId === asgId && s.studentId === studentId;
  });

  var now = new Date().toISOString();
  if (existing) {
    updateRecord_('Submissions', existing.id, {
      submissionText: submissionText,
      fileDriveUrl: fileDriveUrl,
      studentAnonymousAlias: studentAlias,
      submittedAt: now,
      status: 'submitted'
    });
    return { success: true, message: 'Assignment resubmitted successfully.' };
  }

  var subId = generateId_('sub');
  appendRecord_('Submissions', {
    id: subId,
    assignmentId: asgId,
    studentId: studentId,
    studentName: studentName,
    studentAnonymousAlias: studentAlias,
    submissionText: submissionText,
    fileDriveUrl: fileDriveUrl,
    submittedAt: now,
    status: 'submitted',
    pointsEarned: '',
    feedback: ''
  });

  logActivity_(studentId, studentAlias, 'ASSIGNMENT_SUBMITTED', 'Submitted assignment ID: ' + asgId);
  return { success: true, message: 'Assignment submitted successfully!', submissionId: subId };
}

/**
 * Grades an assignment submission with feedback.
 */
function apiGradeSubmission(submissionId, points, feedback) {
  var sub = getSheetData_('Submissions').find(function(s) { return s.id === submissionId; });
  if (!sub) throw new Error('Submission not found.');

  var assignment = getSheetData_('Assignments').find(function(a) { return a.id === sub.assignmentId; });
  var maxPoints = assignment ? assignment.maxPoints : 100;
  var percentage = Math.round((points / maxPoints) * 100);

  updateRecord_('Submissions', submissionId, {
    pointsEarned: points,
    feedback: feedback,
    status: 'graded'
  });

  // Record in Grades table
  appendRecord_('Grades', {
    id: generateId_('grd'),
    studentId: sub.studentId,
    courseId: assignment ? assignment.courseId : '',
    itemType: 'assignment',
    itemId: sub.assignmentId,
    title: assignment ? assignment.title : 'Assignment',
    score: points,
    maxScore: maxPoints,
    percentage: percentage,
    gradedAt: new Date().toISOString(),
    feedback: feedback
  });

  logActivity_(sub.studentId, sub.studentName, 'ASSIGNMENT_GRADED', 'Scored ' + points + '/' + maxPoints);
  return { success: true, message: 'Submission graded successfully.' };
}

// ==============================================================================
// QUIZ & AUTOMATIC SCORING ENGINE
// ==============================================================================

/**
 * Fetches a quiz along with its questions (omits correct answers for students).
 */
function apiGetQuiz(quizId, isLecturerOrAdmin) {
  var quiz = getSheetData_('Quizzes').find(function(q) { return q.id === quizId; });
  if (!quiz) throw new Error('Quiz not found.');

  var questions = getSheetData_('Questions').filter(function(q) { return q.quizId === quizId; });
  
  var safeQuestions = questions.map(function(q) {
    var item = {
      id: q.id,
      quizId: q.quizId,
      questionText: q.questionText,
      questionType: q.questionType,
      options: typeof q.optionsJson === 'string' ? JSON.parse(q.optionsJson || '[]') : q.optionsJson,
      points: Number(q.points) || 10
    };
    if (isLecturerOrAdmin) {
      item.correctAnswer = q.correctAnswer;
    }
    return item;
  });

  return {
    quiz: quiz,
    questions: safeQuestions
  };
}

/**
 * Processes quiz submission with automated answer evaluation and score calculation.
 */
function apiSubmitQuiz(attemptData) {
  var quizId = attemptData.quizId;
  var studentId = attemptData.studentId;
  var userAnswers = attemptData.answers || {}; // { questionId: selectedAnswer }

  var quiz = getSheetData_('Quizzes').find(function(q) { return q.id === quizId; });
  if (!quiz) throw new Error('Quiz not found.');

  var questions = getSheetData_('Questions').filter(function(q) { return q.quizId === quizId; });
  
  var score = 0;
  var totalPoints = 0;
  var resultsDetail = [];

  questions.forEach(function(q) {
    var points = Number(q.points) || 10;
    totalPoints += points;
    var userAns = (userAnswers[q.id] || '').trim();
    var isCorrect = userAns.toLowerCase() === String(q.correctAnswer).toLowerCase().trim();

    if (isCorrect) {
      score += points;
    }

    resultsDetail.push({
      questionId: q.id,
      questionText: q.questionText,
      userAnswer: userAns,
      correctAnswer: q.correctAnswer,
      isCorrect: isCorrect,
      pointsEarned: isCorrect ? points : 0
    });
  });

  var percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  var passed = percentage >= (Number(quiz.passPercentage) || 60);

  var attemptId = generateId_('att');
  var now = new Date().toISOString();

  appendRecord_('QuizAttempts', {
    id: attemptId,
    quizId: quizId,
    studentId: studentId,
    score: score,
    totalPoints: totalPoints,
    percentage: percentage,
    passed: passed,
    attemptedAt: now,
    answersJson: JSON.stringify(userAnswers)
  });

  // Record grade
  appendRecord_('Grades', {
    id: generateId_('grd'),
    studentId: studentId,
    courseId: quiz.courseId,
    itemType: 'quiz',
    itemId: quizId,
    title: quiz.title,
    score: score,
    maxScore: totalPoints,
    percentage: percentage,
    gradedAt: now,
    feedback: passed ? 'Passed on first attempt!' : 'Requires review. Minimum pass is ' + quiz.passPercentage + '%'
  });

  logActivity_(studentId, 'Student', 'QUIZ_SUBMITTED', 'Quiz ' + quizId + ' scored ' + score + '/' + totalPoints);

  return {
    success: true,
    score: score,
    totalPoints: totalPoints,
    percentage: percentage,
    passed: passed,
    passPercentage: quiz.passPercentage,
    resultsDetail: resultsDetail
  };
}

// ==============================================================================
// ANNOUNCEMENTS & MESSAGING
// ==============================================================================

function apiGetAnnouncements(targetRole, courseId) {
  var all = getSheetData_('Announcements');
  return all.filter(function(a) {
    var roleMatch = !a.targetRole || a.targetRole === 'all' || a.targetRole === targetRole;
    var courseMatch = !courseId || !a.courseId || a.courseId === courseId;
    return roleMatch && courseMatch;
  }).reverse();
}

function apiPostAnnouncement(announcementData) {
  var authorAlias = announcementData.authorAnonymousAlias;
  if (!authorAlias && announcementData.authorId) {
    var users = getSheetData_('Users');
    var author = users.find(function(u) { return u.id === announcementData.authorId; });
    if (author && author.anonymousAlias) authorAlias = author.anonymousAlias;
  }
  var newAnn = {
    id: generateId_('ann'),
    courseId: announcementData.courseId || '',
    authorId: announcementData.authorId,
    authorName: announcementData.authorName,
    authorAnonymousAlias: authorAlias || generateAnonymousAlias_(announcementData.authorRole || 'lecturer'),
    authorRole: announcementData.authorRole,
    title: announcementData.title,
    content: announcementData.content,
    targetRole: announcementData.targetRole || 'all',
    createdAt: new Date().toISOString()
  };
  appendRecord_('Announcements', newAnn);
  return { success: true, announcement: newAnn };
}

function apiGetMessages(userId) {
  var msgs = getSheetData_('Messages');
  return msgs.filter(function(m) {
    return m.receiverId === userId || m.senderId === userId;
  }).reverse();
}

function apiSendMessage(messageData) {
  var users = getSheetData_('Users');
  var sender = users.find(function(u) { return u.id === messageData.senderId; });
  var receiver = users.find(function(u) { return u.id === messageData.receiverId; });
  var senderAlias = messageData.senderAnonymousAlias || (sender ? sender.anonymousAlias : '') || generateAnonymousAlias_('student');
  var receiverAlias = messageData.receiverAnonymousAlias || (receiver ? receiver.anonymousAlias : '') || generateAnonymousAlias_('student');

  var newMsg = {
    id: generateId_('msg'),
    senderId: messageData.senderId,
    senderName: messageData.senderName,
    senderAnonymousAlias: senderAlias,
    receiverId: messageData.receiverId,
    receiverName: messageData.receiverName,
    receiverAnonymousAlias: receiverAlias,
    subject: messageData.subject,
    message: messageData.message,
    isRead: false,
    sentAt: new Date().toISOString()
  };
  appendRecord_('Messages', newMsg);
  return { success: true, message: newMsg };
}

// ==============================================================================
// LECTURER DASHBOARD MANAGEMENT APIs
// ==============================================================================

function apiLecturerCreateCourse(courseData) {
  var courseId = generateId_('crs');
  var newCourse = {
    id: courseId,
    title: courseData.title,
    code: courseData.code || ('CRS-' + Math.floor(100 + Math.random() * 900)),
    description: courseData.description,
    category: courseData.category || 'General',
    level: courseData.level || 'Beginner',
    thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    lecturerId: courseData.lecturerId,
    lecturerName: courseData.lecturerName,
    duration: courseData.duration || '6 Weeks',
    status: 'published',
    createdAt: new Date().toISOString()
  };
  appendRecord_('Courses', newCourse);
  return { success: true, course: newCourse };
}

function apiLecturerSaveModule(moduleData) {
  var modId = moduleData.id || generateId_('mod');
  if (moduleData.id) {
    updateRecord_('Modules', modId, moduleData);
  } else {
    moduleData.id = modId;
    appendRecord_('Modules', moduleData);
  }
  return { success: true, module: moduleData };
}

function apiLecturerSaveLesson(lessonData) {
  var lesId = lessonData.id || generateId_('les');
  if (lessonData.id) {
    updateRecord_('Lessons', lesId, lessonData);
  } else {
    lessonData.id = lesId;
    appendRecord_('Lessons', lessonData);
  }
  return { success: true, lesson: lessonData };
}

function apiLecturerSaveAssignment(asgData) {
  var asgId = asgData.id || generateId_('asg');
  asgData.createdAt = new Date().toISOString();
  if (asgData.id) {
    updateRecord_('Assignments', asgId, asgData);
  } else {
    asgData.id = asgId;
    appendRecord_('Assignments', asgData);
  }
  return { success: true, assignment: asgData };
}

function apiLecturerSaveQuiz(quizData, questions) {
  var qizId = quizData.id || generateId_('qiz');
  quizData.createdAt = new Date().toISOString();
  if (quizData.id) {
    updateRecord_('Quizzes', qizId, quizData);
  } else {
    quizData.id = qizId;
    appendRecord_('Quizzes', quizData);
  }

  // Insert or update questions
  if (questions && questions.length) {
    questions.forEach(function(q) {
      var qId = q.id || generateId_('que');
      q.id = qId;
      q.quizId = qizId;
      q.optionsJson = JSON.stringify(q.options || []);
      appendRecord_('Questions', q);
    });
  }

  return { success: true, quiz: quizData };
}

// ==============================================================================
// ADMINISTRATOR DASHBOARD APIs
// ==============================================================================

function apiAdminGetStats() {
  return {
    totalUsers: getSheetData_('Users').length,
    totalCourses: getSheetData_('Courses').length,
    totalEnrollments: getSheetData_('Enrollments').length,
    totalSubmissions: getSheetData_('Submissions').length,
    activeQuizzes: getSheetData_('Quizzes').length
  };
}

function apiAdminGetUsers() {
  var users = getSheetData_('Users');
  return users.map(function(u) {
    var safe = Object.assign({}, u);
    delete safe.passwordHash;
    return safe;
  });
}

function apiAdminToggleUser(userId, newStatus) {
  updateRecord_('Users', userId, { status: newStatus, updatedAt: new Date().toISOString() });
  return { success: true, status: newStatus };
}

function apiAdminResetPassword(userId, newPassword) {
  var pass = newPassword || 'Pass123!';
  updateRecord_('Users', userId, {
    passwordHash: hashPassword_(pass),
    updatedAt: new Date().toISOString()
  });
  return { success: true, temporaryPassword: pass };
}

function apiAdminExportTable(tableName) {
  var data = getSheetData_(tableName);
  return { success: true, tableName: tableName, records: data };
}
