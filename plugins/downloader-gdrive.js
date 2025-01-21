import fg from 'api-dylux'; // Import the `api-dylux` library

const MAX_FILE_SIZE_MB = 2100; // Maximum file size (2.1 GB)

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `❌ *Error: Missing URL!*\n\nUsage: ${usedPrefix + command} <Google Drive URL>`,
      m
    );
  }

  let url = args[0];

  try {
    // Convert usercontent download link to standard Google Drive link if needed
    url = normalizeDriveLink(url);

    // Extract the file ID from the normalized Google Drive URL
    const fileId = extractFileId(url);
    if (!fileId) {
      throw new Error('Invalid Google Drive URL.');
    }

    // Fetch file details using fg.GDriveDl
    const res = await fg.GDriveDl(`https://drive.google.com/file/d/${fileId}/view?usp=sharing`);

    // Validate response and check file size
    if (!res || !res.downloadUrl) {
      throw new Error('Failed to fetch file details. Make sure the URL is valid.');
    }

    const fileSizeMB = parseFloat(res.fileSize.replace(/[^\d.]/g, '')); // Convert file size to a number
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return conn.reply(
        m.chat,
        `❌ *Error: File size exceeds the limit of 2.1 GB.*\n\nFile size: ${res.fileSize}`,
        m
      );
    }

    // Send file details
    await conn.reply(
      m.chat,
      `- *📃 File name:* ${res.fileName}\n- *💈 File Size:* ${res.fileSize}\n- *🕹️ File type:* ${res.mimetype}`,
      m
    );

    // Send the file
    await conn.sendMessage(
      m.chat,
      {
        document: { url: res.downloadUrl }, // File download URL
        fileName: res.fileName, // File name
        mimetype: res.mimetype, // File MIME type
      },
      { quoted: m }
    );
  } catch (error) {
    console.error('Error occurred:', error); // Log the full error for debugging

    // Check if `error.message` exists before using `.includes`
    const errorMessage = error?.message || ''; // Safely get the error message

    // Handle JSON parse errors for large files
    if (errorMessage.includes('Unexpected token')) {
      return conn.reply(
        m.chat,
        `❌ *Error: Unable to process the file.*\n\nReason: The file may be too large to process via the current method.`,
        m
      );
    }

    // Handle other errors
    await conn.reply(
      m.chat,
      `❌ *Error: Unable to process the request.*\n\nReason: ${errorMessage || 'Unknown error'}`,
      m
    );
    console.error(error); // Log the error for debugging
  }
};

/**
 * Normalize Google Drive link formats
 * @param {string} url - The original URL provided by the user
 * @returns {string} - A normalized Google Drive URL
 */
function normalizeDriveLink(url) {
  // If the URL is already in the correct format, return it
  if (url.includes('drive.google.com/file/d/')) {
    return url;
  }

  // Handle `drive.usercontent.google.com` links
  if (url.includes('drive.usercontent.google.com/download')) {
    const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      const fileId = idMatch[1];
      return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    }
  }

  // Return the original URL if no changes were made
  return url;
}

/**
 * Extract file ID from Google Drive URL
 * @param {string} url - Google Drive URL
 * @returns {string|null} - Extracted file ID or null if invalid
 */
function extractFileId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Command trigger
handler.command = /^(gdrive|gdrivedl)$/i;

export default handler;

