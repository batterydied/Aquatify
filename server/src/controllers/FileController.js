import path from 'path';
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileController {
    static retrieveAllFiles(req, res){
        const uploadsDir = path.join(__dirname, "../uploads");

        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve files" });
            }

            res.status(200).json({
                message: "All files retrieved successfully",
                files: files
            });
        });
    }

    static upload(req, res){
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
      
        res.status(200).json({
          message: "File uploaded successfully",
          file: {
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
          },
        });
    }
    static retrieveFile(req, res){
        const filePath = path.join(__dirname, "../uploads", req.params.filename);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
            return res.status(404).json({ error: "File not found" });
            }
            res.sendFile(filePath);
        });
    }
}

export default FileController;
