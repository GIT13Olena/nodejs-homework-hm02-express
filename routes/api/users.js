const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/authenticate");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../../controllers/users");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", authenticate, getCurrentUser);

module.exports = router;
