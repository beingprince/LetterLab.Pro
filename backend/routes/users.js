import { auth } from "../middleware/auth.js";
import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/ping", (_req, res) => res.json({ ok: true, where: "users router" }));

// Generate JWT
const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "supersecretkey", {
    expiresIn: "7d",
  });

// ✅ Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use." });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genToken(user._id),
    });
  } catch (err) {
    console.error("[POST /users/register]", err);
    res.status(500).json({ error: "Registration failed." });
  }
});

// ✅ Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ error: "Invalid credentials." });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genToken(user._id),
    });
  } catch (err) {
    console.error("[POST /users/login]", err);
    res.status(500).json({ error: "Login failed." });
  }
});

// ✅ Get all users (for admin/debug)
router.get("/", async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// ✅ Get user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});


export default router;
