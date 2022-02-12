const multer = require("multer");
const uuid = require("uuid");

const upload = multer({
  storage: multer.diskStorage({
    destination: "product-data/images",
    filename: function (req, file, cb) {
      cb(null, uuid.v4()+'-'+file.originalname);
    },
  }),
});

const configuredUploadMiddleware = upload.single("image");

module.exports = configuredUploadMiddleware;
