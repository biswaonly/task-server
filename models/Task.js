const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
  taskName: { type: String, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  activeTime: { type: Date },
  workedTime: { type: String, default: "0" },
  isActive: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
});

module.exports = Task = mongoose.model("task", TaskSchema);
