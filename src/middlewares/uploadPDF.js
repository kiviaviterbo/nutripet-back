import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype !== "application/pdf" &&
    file.mimetype !== "application/octet-stream"
  ) {
    return cb(new Error("Envie um arquivo PDF válido."));
  }
  cb(null, true);
};

export const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});
