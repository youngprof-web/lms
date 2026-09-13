/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT LEARNING MANAGEMENT SYSTEM (LMS)
 * File: Database.gs
 * Purpose: Google Sheets data operations, schema management, and CRUD helpers.
 * ==============================================================================
 */

/**
 * Global database schema definition across all 15 relational tables.
 */
var DB_SCHEMA = {
  Users: ['id', 'name', 'email', 'passwordHash', 'role', 'status', 'avatar', 'anonymousAlias', 'isTemporal', 'temporalToken', 'temporalExpiresAt', 'createdAt', 'updatedAt'],
  Courses: ['id', 'title', 'code', 'description', 'category', 'level', 'thumbnail', 'lecturerId', 'lecturerName', 'duration', 'status', 'createdAt'],
  Modules: ['id', 'courseId', 'title', 'orderIndex', 'createdAt'],
  Lessons: ['id', 'moduleId', 'courseId', 'title', 'contentType', 'contentBody', 'videoUrl', 'attachmentDriveId', 'durationMinutes', 'orderIndex', 'createdAt'],
  Enrollments: ['id', 'studentId', 'courseId', 'progressPercentage', 'status', 'enrolledAt', 'lastAccessedAt', 'completedAt'],
  LessonProgress: ['id', 'studentId', 'lessonId', 'courseId', 'isCompleted', 'completedAt'],
  Assignments: ['id', 'courseId', 'title', 'description', 'dueDate', 'maxPoints', 'attachmentDriveId', 'createdAt'],
  Submissions: ['id', 'assignmentId', 'studentId', 'studentName', 'studentAnonymousAlias', 'submittedAt', 'driveFileId', 'fileName', 'submissionText', 'status', 'pointsEarned', 'feedback', 'gradedAt', 'gradedBy'],
  Quizzes: ['id', 'courseId', 'moduleId', 'title', 'description', 'timeLimitMinutes', 'passPercentage', 'createdAt'],
  QuizQuestions: ['id', 'quizId', 'questionText', 'questionType', 'optionsJson', 'correctOptionIndex', 'points', 'orderIndex'],
  QuizAttempts: ['id', 'quizId', 'studentId', 'score', 'maxScore', 'percentage', 'isPassed', 'answersJson', 'attemptedAt'],
  Grades: ['id', 'studentId', 'courseId', 'itemType', 'itemId', 'title', 'score', 'maxScore', 'percentage', 'feedback', 'gradedAt'],
  Announcements: ['id', 'title', 'content', 'authorName', 'authorAnonymousAlias', 'authorRole', 'courseId', 'priority', 'createdAt'],
  DirectMessages: ['id', 'senderId', 'senderName', 'senderAnonymousAlias', 'receiverId', 'receiverName', 'receiverAnonymousAlias', 'subject', 'message', 'isRead', 'sentAt'],
  ActivityLogs: ['id', 'timestamp', 'userId', 'userName', 'action', 'details', 'ipAddress'],
  SystemSettings: ['key', 'value', 'description', 'updatedAt']
};

/**
 * Returns a specific Google Sheet by name.
 */
function getSheetByName_(sheetName) {
  var ss = getDatabase_();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (DB_SCHEMA[sheetName]) {
      sheet.appendRow(DB_SCHEMA[sheetName]);
      sheet.getRange(1, 1, 1, DB_SCHEMA[sheetName].length)
        .setFontWeight('bold')
        .setBackground('#1e293b')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

/**
 * Reads all rows from a sheet as an array of JavaScript objects mapped by column header.
 */
function readSheetData_(sheetName) {
  var sheet = getSheetByName_(sheetName);
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  if (lastRow <= 1 || lastCol === 0) return [];
  
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  
  return rows.map(function(row) {
    var item = {};
    headers.forEach(function(header, idx) {
      item[header] = row[idx];
    });
    return item;
  });
}

/**
 * Finds a single row matching a field value.
 */
function findRowByField_(sheetName, fieldName, value) {
  var items = readSheetData_(sheetName);
  for (var i = 0; i < items.length; i++) {
    if (String(items[i][fieldName]) === String(value)) {
      return items[i];
    }
  }
  return null;
}

/**
 * Inserts a new record into a table.
 */
function insertRecord_(sheetName, record) {
  var sheet = getSheetByName_(sheetName);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var row = headers.map(function(header) {
    return record[header] !== undefined ? record[header] : '';
  });
  
  sheet.appendRow(row);
  return record;
}

/**
 * Updates an existing record identified by fieldName.
 */
function updateRecord_(sheetName, fieldName, value, updates) {
  var sheet = getSheetByName_(sheetName);
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1) return false;
  
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var fieldIdx = headers.indexOf(fieldName);
  if (fieldIdx === -1) return false;
  
  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  
  for (var r = 0; r < values.length; r++) {
    if (String(values[r][fieldIdx]) === String(value)) {
      var rowNum = r + 2;
      for (var colKey in updates) {
        var cIdx = headers.indexOf(colKey);
        if (cIdx !== -1) {
          sheet.getRange(rowNum, cIdx + 1).setValue(updates[colKey]);
        }
      }
      return true;
    }
  }
  return false;
}

/**
 * Deletes a row matching a field value.
 */
function deleteRecord_(sheetName, fieldName, value) {
  var sheet = getSheetByName_(sheetName);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var fieldIdx = headers.indexOf(fieldName);
  if (fieldIdx === -1) return false;
  
  var colValues = sheet.getRange(2, fieldIdx + 1, lastRow - 1, 1).getValues();
  for (var r = colValues.length - 1; r >= 0; r--) {
    if (String(colValues[r][0]) === String(value)) {
      sheet.deleteRow(r + 2);
      return true;
    }
  }
  return false;
}

/**
 * Exports complete database state as a JSON bundle for backup.
 */
function exportFullDatabaseBackup() {
  var backup = {
    appName: CONFIG.APP_NAME,
    timestamp: new Date().toISOString(),
    tables: {}
  };
  
  for (var table in DB_SCHEMA) {
    backup.tables[table] = readSheetData_(table);
  }
  
  return backup;
}
