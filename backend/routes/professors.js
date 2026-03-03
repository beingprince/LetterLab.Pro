import express from "express";
import mongoose from "mongoose";
import Professor from "../models/Professor.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const PROFESSOR_LIMIT = 20;

// ACTION: Protect all professor routes with auth middleware
// This ensures all operations are tied to a logged-in user.
router.use(auth);

// Route to add a new professor (NOW SECURE)
router.post("/add", async (req, res) => {
  try {
    // ACTION: 1. Check contact limit
    const count = await Professor.countDocuments({ userId: req.user.id });
    if (count >= PROFESSOR_LIMIT) {
      return res.status(403).json({
        error: `You have reached the ${PROFESSOR_LIMIT}-contact limit.`,
      });
    }

    // ACTION: 2. Add userId to the new professor
    const { name, email, department, university } = req.body;
    const newProf = new Professor({
      name,
      email: email.toLowerCase(),
      department,
      university,
      userId: req.user.id, // <-- Link to the logged-in user
    });

    await newProf.save();
    res.status(201).json({ message: "Professor added", professor: newProf });
  } catch (err) {
    // ACTION: 3. Handle duplicate email error (for this specific user)
    if (err.code === 11000) {
      return res.status(409).json({ error: "This email is already in your contact list." });
    }
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/professors (NOW SECURE)
router.get("/", async (req, res) => {
  try {
    // ACTION: Find only professors belonging to the logged-in user
    const professors = await Professor.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(professors);
  } catch (err) {
    return res.status(500).json({ message: "Server error fetching professors." });
  }
});

// DELETE /api/professors/:id — hard delete, verify userId
router.delete("/:id", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const id = req.params.id;
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
      return res.status(400).json({ error: "Invalid id." });
    }
    const deleted = await Professor.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ error: "Professor not found." });
    }
    return res.status(200).json({ success: true, deletedId: id });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error deleting professor." });
  }
});

// ACTION: *** NEW ROUTE ***
// This is the "gate" for Flow 2. It checks if an email
// belongs to a saved professor for this user.
router.post("/check", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const found = await Professor.findOne({
      email: email.toLowerCase(),
      userId: req.user.id,
    });

    if (found) {
      res.json({ isProfessor: true, professor: found });
    } else {
      res.json({ isProfessor: false, message: "Email not in professor list." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error checking professor." });
  }
});

export default router;