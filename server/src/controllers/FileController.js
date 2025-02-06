import path from 'path';
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import { __IP } from '../../../GLOBAL.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileController {
    static retrieveAllFiles(req, res) {
        const uploadsDir = path.join(__dirname, '../uploads');

        // Read the directory
        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve files" });
            }

            // Array to store file details
            const fileDetails = [];

            // Counter to track processed files
            let processedFiles = 0;

            // If the directory is empty, return an empty array
            if (files.length === 0) {
                return res.status(200).json({
                    message: "All files retrieved successfully",
                    files: fileDetails,
                });
            }

            // Iterate through each file and get its details
            files.forEach((filename) => {
                const filePath = path.join(uploadsDir, filename);

                // Get file stats (e.g., size)
                fs.stat(filePath, (statErr, stats) => {
                    if (statErr) {
                        console.error(`Failed to get stats for file: ${filename}`, statErr);
                        processedFiles++;
                        return;
                    }

                    // Construct file details object
                    const fileInfo = {
                        originalName: filename, // Assuming the original name is the same as the filename
                        filename: filename,
                        path: filePath,
                        size: stats.size, // File size in bytes
                    };

                    // Add file details to the array
                    fileDetails.push(fileInfo);

                    // Increment the processed files counter
                    processedFiles++;

                    // Check if all files have been processed
                    if (processedFiles === files.length) {
                        // Send the response with all file details
                        res.status(200).json({
                            message: "All files retrieved successfully",
                            files: fileDetails,
                        });
                    }
                });
            });
        });
    }

    static async upload(req, res) {
        try {
          // Check if a file is uploaded
          if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
          }
      
          // Construct the full URI for the uploaded file
          const fileURI = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      
          // Respond with the new file information
          res.status(200).json({
            message: "Avatar uploaded successfully",
            file: {
              originalName: req.file.originalname,
              filename: req.file.filename,
              uri: fileURI,
              path: req.file.path,
              size: req.file.size,
            },
          });
        } catch (error) {
          console.error("Error during avatar upload:", error);
          res.status(500).json({ error: "An error occurred during avatar upload." });
        }
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

    static deleteFile(req, res) {
        const { filename } = req.params; // Treat the `id` parameter as the filename
        const filePath = path.join(__dirname, '../uploads', filename); // Construct the file path

        // Check if the file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ error: "File not found" });
            }

            // Delete the file
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Failed to delete file: ${filePath}`, unlinkErr);
                    return res.status(500).json({ error: "Failed to delete file" });
                }

                console.log(`File deleted successfully: ${filePath}`);
                res.status(200).json({ message: "File deleted successfully" });
            });
        });
    }
}

export default FileController;
