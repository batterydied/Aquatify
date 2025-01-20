import path from 'path';
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";

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

    static async uploadAvatar(req, res) {
        try {
          const { id } = req.params;
          const previousAvatarPath = req.body.previousAvatarPath; // Path to the previously associated avatar
      
          // Check if a file is uploaded
          if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
          }
      
          // If there's a previous avatar, attempt to delete it
          if (previousAvatarPath) {
            const filePath = path.join(process.cwd(), previousAvatarPath); // Get the absolute path
            fs.access(filePath, fs.constants.F_OK, (err) => {
              if (!err) {
                fs.unlink(filePath, (unlinkErr) => {
                  if (unlinkErr) {
                    console.error(`Failed to delete file: ${filePath}`, unlinkErr);
                  } else {
                    console.log(`Deleted previous avatar: ${filePath}`);
                  }
                });
              }
            });
          }
      
          // Construct the full URI for the uploaded file
          const fileURI = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      
          // Update the user's avatarFileURI in the database
          await axios.put(`http://192.168.1.23:3000/api/user/${id}`, {
            avatarFileURI: fileURI,
          });
      
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
}

export default FileController;
