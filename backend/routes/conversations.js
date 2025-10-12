import express from 'express';
import Conversation from '../models/Conversation.js';

const router = express.Router();

// Get all conversations for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const conversations = await Conversation.find({ userId })
      .sort({ isPinned: -1, updatedAt: -1 })
      .select('title isPinned createdAt updatedAt messages');

    res.json(conversations);
  } catch (error) {
    console.error('[GET /conversations]', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Create new conversation
router.post('/', async (req, res) => {
  try {
    const { userId, title, messages } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const conversation = new Conversation({
      userId,
      title: title || 'New Conversation',
      messages: messages || []
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error('[POST /conversations]', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Get single conversation
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('[GET /conversations/:id]', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Update conversation
router.patch('/:id', async (req, res) => {
  try {
    const { title, isPinned, messages } = req.body;
    const update = {};
    
    if (title !== undefined) update.title = title;
    if (isPinned !== undefined) update.isPinned = isPinned;
    if (messages !== undefined) update.messages = messages;

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('[PATCH /conversations/:id]', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Delete conversation
router.delete('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('[DELETE /conversations/:id]', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;