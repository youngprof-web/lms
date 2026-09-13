/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT LEARNING MANAGEMENT SYSTEM (LMS)
 * File: Drive.gs
 * Purpose: Learning material, PDF notes, and file management using Google Drive.
 * ==============================================================================
 */

/**
 * Retrieves or creates the primary Google Drive folder for LMS storage.
 */
function getOrCreateLmsDriveFolder_() {
  var folderName = CONFIG.DRIVE_FOLDER_NAME || 'LMS_Uploads_Storage';
  var folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  }
  
  var newFolder = DriveApp.createFolder(folderName);
  // Set sharing permissions so students can view study materials
  newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return newFolder;
}

/**
 * Retrieves or creates a specialized subfolder (e.g. 'CourseMaterials' or 'StudentSubmissions').
 */
function getOrCreateLmsSubfolder_(subfolderName) {
  var root = getOrCreateLmsDriveFolder_();
  var subfolders = root.getFoldersByName(subfolderName);
  if (subfolders.hasNext()) {
    return subfolders.next();
  }
  return root.createFolder(subfolderName);
}

/**
 * Uploads a base64 encoded document (PDF notes, slides, assignment deliverables) to Google Drive.
 */
function uploadLearningResourceToDrive(base64Data, originalFileName, mimeType, subfolder) {
  try {
    var targetFolder = subfolder ? getOrCreateLmsSubfolder_(subfolder) : getOrCreateLmsDriveFolder_();
    var cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    var decodedBytes = Utilities.base64Decode(cleanBase64);
    var blob = Utilities.newBlob(decodedBytes, mimeType || 'application/pdf', originalFileName);
    
    var file = targetFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      success: true,
      fileId: file.getId(),
      fileName: file.getName(),
      fileSize: file.getSize(),
      downloadUrl: file.getDownloadUrl(),
      viewUrl: 'https://drive.google.com/file/d/' + file.getId() + '/view?usp=sharing'
    };
  } catch (err) {
    Logger.log('Drive Upload Error: ' + err.toString());
    return {
      success: false,
      error: 'Google Drive upload failed: ' + err.message
    };
  }
}

/**
 * Deletes a file from Google Drive by its file ID.
 */
function deleteFileFromDrive(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetches metadata and access links for a stored Drive file.
 */
function getDriveFileMetadata(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
    return {
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      size: file.getSize(),
      url: file.getUrl(),
      downloadUrl: file.getDownloadUrl(),
      lastUpdated: file.getLastUpdated().toISOString()
    };
  } catch (err) {
    return null;
  }
}
