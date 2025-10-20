// backend/routes/conversations.js
import express from "express";
import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";

const router = express.Router();

// List: pinned first, then recent — ONLY current user's
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({ userId, isDeleted: false })
      .sort({ isPinned: -1, pinnedAt: -1, lastActivityAt: -1 })
      .select("title isPinned pinnedAt lastActivityAt createdAt updatedAt totalTokens")
      .limit(100);
    res.json(conversations);
  } catch (error) {
    console.error("[GET /conversations]", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Create: forces userId from token
router.post("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { title, messages } = req.body || {};

    const safeMessages = Array.isArray(messages)
      ? messages.slice(0, 200).map((m) => ({
          role: m?.role,
          content: (m?.content || "").toString().trim().slice(0, 20000),
          tokens: Number.isFinite(m?.tokens) ? Math.max(0, Math.floor(m.tokens)) : 0,
        }))
      : [];
    const totalTokens = safeMessages.reduce((s, m) => s + (m.tokens || 0), 0);

    const doc = await Conversation.create({
      userId,
      title: (title || "New Conversation").toString().trim().slice(0, 160),
      messages: safeMessages,
      totalTokens,
      lastActivityAt: new Date(),
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error("[POST /conversations]", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// Get one: ensure it belongs to user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "invalid id" });

    const doc = await Conversation.findOne({ _id: id, userId: req.userId, isDeleted: false });
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (error) {
    console.error("[GET /conversations/:id]", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// Update: title/pin/messages — only own doc
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "invalid id" });

    const { title, isPinned, messages } = req.body || {};
    const update = {};

    if (title !== undefined) update.title = title.toString().trim().slice(0, 160);
    if (isPinned !== undefined) {
      update.isPinned = !!isPinned;
      update.pinnedAt = isPinned ? new Date() : null;
    }
    if (messages !== undefined) {
      const safe = Array.isArray(messages)
        ? messages.slice(0, 200).map((m) => ({
            role: m?.role,
            content: (m?.content || "").toString().trim().slice(0, 20000),
            tokens: Number.isFinite(m?.tokens) ? Math.max(0, Math.floor(m.tokens)) : 0,
          }))
        : [];
      update.messages = safe;
      update.totalTokens = safe.reduce((s, m) => s + (m.tokens || 0), 0);
      update.lastActivityAt = new Date();
    }

    const doc = await Conversation.findOneAndUpdate(
      { _id: id, userId: req.userId, isDeleted: false },
      update,
      { new: true, runValidators: true, context: "query" }
    );
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (error) {
    console.error("[PATCH /conversations/:id]", error);
    res.status(500).json({ error: "Failed to update conversation" });
  }
});

// Pin / Unpin (explicit)
router.post("/:id/pin", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "invalid id" });

    const doc = await Conversation.findOneAndUpdate(
      { _id: id, userId: req.userId, isDeleted: false },
      { $set: { isPinned: true, pinnedAt: new Date() } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (error) {
    console.error("[POST /conversations/:id/pin]", error);
    res.status(500).json({ error: "Failed to pin conversation" });
  }
});

router.post("/:id/unpin", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "invalid id" });

    const doc = await Conversation.findOneAndUpdate(
      { _id: id, userId: req.userId, isDeleted: false },
      { $set: { isPinned: false, pinnedAt: null } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (error) {
    console.error("[POST /conversations/:id/unpin]", error);
    res.status(500).json({ error: "Failed to unpin conversation" });
  }
});

// Soft delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "invalid id" });

    const doc = await Conversation.findOneAndUpdate(
      { _id: id, userId: req.userId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json({ message: "Conversation deleted (soft)", id: doc._id });
  } catch (error) {
    console.error("[DELETE /conversations/:id]", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

export default router;
