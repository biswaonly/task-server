const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
  admin: { type: Schema.Types.ObjectId, ref: "user" },
  userList: [{ user: { type: Schema.Types.ObjectId, ref: "user" } }],
  projectName: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now }
});

module.exports = Project = mongoose.model("project", ProjectSchema);
