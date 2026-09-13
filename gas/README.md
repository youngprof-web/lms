# Google Apps Script Learning Management System (LMS)
### Complete Deployment & Configuration Manual

This document provides complete, step-by-step instructions for deploying and running the Learning Management System using **Google Apps Script**, **Google Sheets**, and **Google Drive**.

---

## 1. System Architecture Overview

* **Backend:** Google Apps Script Web App (`Code.gs`)
* **Database:** Google Spreadsheet with 15 normalized relational tables
* **Storage:** Google Drive dedicated folder (`LMS_Uploads_Storage`) for PDFs and student submissions
* **Frontend:** HTML5, CSS3, and Vanilla JavaScript (`Index.html`, `Styles.html`, `JavaScript.html`)
* **RPC Communication:** Native `google.script.run` (with built-in fallback for standalone testing)

---

## 2. Google Sheets Database Schema (15 Tables)

When you run `setupDatabase()` in Apps Script, the system creates the Google Spreadsheet and configures all 15 sheets automatically with bold frozen header rows.

| Sheet Name | Column Headers (Row 1) | Purpose |
| :--- | :--- | :--- |
| **Users** | `id`, `name`, `email`, `passwordHash`, `role`, `status`, `avatar`, `createdAt`, `updatedAt` | System accounts (admin, lecturer, student) |
| **Courses** | `id`, `title`, `code`, `description`, `category`, `level`, `thumbnail`, `lecturerId`, `lecturerName`, `duration`, `status`, `createdAt` | Course catalog and metadata |
| **Enrollments** | `id`, `studentId`, `courseId`, `progressPercentage`, `enrolledAt`, `completedAt`, `status` | Student enrollment and completion metrics |
| **Modules** | `id`, `courseId`, `title`, `order`, `description` | Course curriculum chapters |
| **Lessons** | `id`, `moduleId`, `courseId`, `title`, `order`, `contentType`, `contentUrl`, `textContent`, `durationMinutes`, `isCompleted` | Individual video and textual lessons |
| **Materials** | `id`, `courseId`, `moduleId`, `title`, `fileType`, `driveFileId`, `driveViewUrl`, `driveDownloadUrl`, `fileSize`, `uploadedAt` | Google Drive lecture notes & attachments |
| **Assignments** | `id`, `courseId`, `moduleId`, `title`, `description`, `dueDate`, `maxPoints`, `attachmentUrl`, `createdAt` | Assessment specifications |
| **Submissions** | `id`, `assignmentId`, `studentId`, `studentName`, `submissionText`, `fileDriveUrl`, `submittedAt`, `status`, `pointsEarned`, `feedback` | Student work and lecturer marks |
| **Quizzes** | `id`, `courseId`, `moduleId`, `title`, `description`, `timeLimitMinutes`, `passPercentage`, `createdAt` | Module evaluations |
| **Questions** | `id`, `quizId`, `questionText`, `questionType`, `optionsJson`, `correctAnswer`, `points` | Multiple choice items & answers |
| **QuizAttempts** | `id`, `quizId`, `studentId`, `score`, `totalPoints`, `percentage`, `passed`, `attemptedAt`, `answersJson` | Evaluation records and student responses |
| **Grades** | `id`, `studentId`, `courseId`, `itemType`, `itemId`, `title`, `score`, `maxScore`, `percentage`, `gradedAt`, `feedback` | Unified academic gradebook |
| **Announcements** | `id`, `courseId`, `authorId`, `authorName`, `authorRole`, `title`, `content`, `targetRole`, `createdAt` | Institutional and course news |
| **Messages** | `id`, `senderId`, `senderName`, `receiverId`, `receiverName`, `subject`, `message`, `isRead`, `sentAt` | Direct communication between users |
| **ActivityLogs** | `id`, `userId`, `userName`, `action`, `details`, `timestamp` | Security audit trail |

---

## 3. Step-by-Step Deployment Instructions

### Step 1: Create the Google Apps Script Project
1. Open [Google Drive](https://drive.google.com).
2. Click **New** > **More** > **Google Apps Script** (or visit [script.google.com](https://script.google.com/home/start)).
3. Title the project: `LMS_WebApp_Production`.

### Step 2: Add the Project Files
In the Apps Script Editor:
1. **Code.gs**: Replace the default code with the contents of `gas/Code.gs`.
2. Click **+** (Add a file) > **HTML**:
   - Name it `Index` and paste the contents of `gas/Index.html`.
3. Click **+** > **HTML**:
   - Name it `Styles` and paste the contents of `gas/Styles.html`.
4. Click **+** > **HTML**:
   - Name it `JavaScript` and paste the contents of `gas/JavaScript.html`.

### Step 3: Initialize Database & Google Drive Folder
1. In the Apps Script toolbar, select the function `setupDatabase` from the dropdown list.
2. Click **Run**.
3. A popup will request permissions (*Review Permissions* > Choose your account > *Advanced* > *Go to LMS_WebApp_Production (unsafe)* > *Allow*).
4. `setupDatabase` will:
   - Create a spreadsheet named `LMS_Master_Database` in your Google Drive.
   - Create all 15 sheets with column headers.
   - Insert default sample courses, modules, lessons, and seed users.
   - Create a Google Drive folder named `LMS_Uploads_Storage` for PDF uploads.
   - Save the `SPREADSHEET_ID` into Script Properties.

*(Optional)* If you prefer to use an existing Google Sheet, copy its ID from the URL (`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`) and paste it into `CONFIG.SPREADSHEET_ID` in `Code.gs`. (Currently configured target database: `15zRSQkSCS4N-1xDvCIOW1Fv0Tofpc-tdU1ClIbtH5OyCEhYy7Pbsop4t`).

### Step 4: Deploy as a Web App
1. Click the blue **Deploy** button at the top right > **New deployment**.
2. Click the gear icon (**Select type**) > Choose **Web app**.
3. Configure the deployment settings:
   - **Description**: `Version 1.0 Production LMS`
   - **Execute as**: **Me** (`your_email@gmail.com`)
   - **Who has access**: **Anyone** (allows students and lecturers to access the portal)
4. Click **Deploy**.
5. Copy the generated **Web app URL** (e.g., `https://script.google.com/macros/s/.../exec`).

---

## 4. Default Demonstration Accounts

The database bootstrap function `setupDatabase()` creates three default accounts:

| Role | Email | Password | Full Name | Access Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@lms.edu` | `admin123` | Dr. Sarah Jenkins | Full control: user management, logs, database export, course oversight |
| **Lecturer** | `lecturer@lms.edu` | `lecturer123` | Prof. Marcus Chen | Course authoring, module & lesson management, assignment grading, quizzes |
| **Student** | `student@lms.edu` | `student123` | Alex Rivera | Course enrollment, video/text study, Drive downloads, quizzes, assignments |

---

## 5. Feature Verification Checklist

1. **Course Browsing & Filtering**:
   - Go to "All Courses Catalog". Filter by category ("Computer Science") and level. Search by title.
2. **Student Enrollment & Course Player**:
   - Click "Enroll Now" on CS-101.
   - Study Lesson 1.1 (Video player), navigate to Lesson 1.2 (Text lesson), click "Mark as Completed".
   - Notice the progress bar update automatically in Google Sheets!
3. **Google Drive Materials**:
   - In the course player, click "Download" on `CS101_Lecture_Notes_Week1.pdf`.
4. **Interactive Quiz**:
   - Click "Take Module Quiz". Answer the 4 questions against the countdown timer. Submit to verify automatic grading and gradebook recording.
5. **Assignment Submission**:
   - Click "Submit Assignment", attach a file or type writeup notes, and submit.
6. **Lecturer Grading**:
   - Switch role to Lecturer. Open "Lecturer Studio", click "Grade Submission", enter score and feedback, then save.
7. **Admin Oversight & Data Export**:
   - Switch role to Administrator. Verify User Accounts, toggle account status (Active/Inactive), and click "Export Users" to download a CSV.
