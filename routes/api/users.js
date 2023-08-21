const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/authenticate");
const multer = require("multer");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateAvatar,
} = require("../../controllers/users");

const storage = multer.diskStorage({
  destination: "public/avatars", 
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", authenticate, getCurrentUser);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
