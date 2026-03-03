import mongoose from "mongoose";

const professorSchema = new mongoose.Schema({
  // ACTION: Added userId to link each professor to a specific user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes your User model is named 'User'
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String },
  university: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// ACTION: Added index to ensure an email is unique *per user*,
// not globally. One user cannot add the same email twice,
// but two different users can add the same professor.
professorSchema.index({ userId: 1, email: 1 }, { unique: true });

const Professor = mongoose.model("Professor", professorSchema);
export default Professor;