const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/authenticate");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const User = require("../../models/users");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const { loginUser } = require("../../controllers/users");
const { getCurrentUser } = require("../../controllers/users");
const { updateAvatar } = require("../../controllers/users");

const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: "girnyak.1olena@gmail.com", 
    pass: process.env.EMAIL_PASSWORD,
  },
});

const storage = multer.diskStorage({
  destination: "public/avatars",
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarURL;

    if (req.file) {
      avatarURL = `/avatars/${req.file.filename}`;
    } else {
      avatarURL = gravatar.url(email, { s: "250", d: "retro" });
    }

    const verificationToken = uuid.v4();

    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    const verificationLink = `http://localhost:3000/api/users/verify/${verificationToken}`;

    const mailOptions = {
      from: email,
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending verification email:", error);
        res.status(500).json({ message: "Failed to send verification email" });
      } else {
        console.log("Verification email sent:", info.response);
        res.status(201).json({
          user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/resend-verification-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const verificationLink = `${process.env.PORT}/api/users/verify/${user.verificationToken}`;

    const mailOptions = {
      from: email,
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error resending verification email:", error);
        res.status(500).json({ message: "Failed to resend verification email" });
      } else {
        console.log("Resent verification email:", info.response);
        res.status(200).json({ message: "Resent verification email" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", loginUser);

router.get("/current", authenticate, getCurrentUser);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
