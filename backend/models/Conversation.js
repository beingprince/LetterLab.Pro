import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'ai']
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links the conversation to a specific user
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  messages: [messageSchema]
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;