import multer from "multer";
import fs from "fs";
import path from "path";

// Define the allowed MIME types for video and image files
const ALLOWED_MIME_TYPES = [
    'video/mp4',
    'video/x-msvideo',
    'video/x-matroska',
    'video/x-flv',
    'video/webm',
    'video/quicktime',
    'image/jpeg',      // JPEG image files
    'image/png',       // PNG image files
    'image/gif',       // GIF image files
    'image/webp',      // WebP image files
];

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "./public/temp";
        
        // Ensure the upload directory exists, if not, create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        // Sanitize the file name (remove unwanted characters)
        const sanitizedFilename = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        cb(null, uniqueSuffix + '-' + sanitizedFilename); // Add unique suffix to the filename
    }
});

// Set up multer middleware with limits and file type validation
export const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500 MB limit for file uploads
    },
    fileFilter: (req, file, cb) => {
        console.log("Uploading file with MIME type:", file.mimetype); // Log the MIME type for debugging

        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            console.error('File upload failed: Invalid file type', file.mimetype);
            cb(new Error(`Invalid file type: ${file.mimetype}. Only video and image files are allowed.`), false); // Reject the file with an error message
        }
    }
});
