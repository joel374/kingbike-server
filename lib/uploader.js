const multer = require("multer");
const path = require("path");

const upload = ({
  filePrefix = "FILE",
  fileName = Date.now(),
  acceptedFileTypes = [],
}) => {
  const filePath = path.join(__dirname, ".././public");
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, filePath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.originalname.split(".").pop().toLowerCase();
      cb(null, `${filePrefix}-${uniqueSuffix}.${extension}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const extension = file.originalname.split(".").pop().toLowerCase();

    if (acceptedFileTypes.includes(extension) || acceptedFileTypes.length === 0) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  };

  return multer({
    storage: diskStorage,
    limits: { fileSize: 4 * 1024 * 1024 },
    fileFilter,
  });
};

module.exports = {
  upload,
};
