import multer from "multer";

// Use memory storage because we don't need files right now
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle form-data for text fields
// This will parse all fields into req.body
export const parseFormData = upload.none();
