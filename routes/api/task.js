const express = require("express");
const { check, validationResult } = require("express-validator");
const moment = require("moment");

const router = express.Router();
const auth = require("../../middleware/auth");
const Task = require("../../models/Task");

// @route 	GET api/task/all
// @desc 		Get Current Project Tasks
// @access 	Private
router.post("/all", auth, async (req, res) => {
  try {
    const { selectedProject } = req.body;

    const task = await Task.find({ projectId: selectedProject._id });

    if (!task) {
      return res.status(400).json({ msg: "There is no task for this User" });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route 	POST api/task
// @desc 		Create or Update Project Task
// @access 	Private
router.post(
  "/",
  [
    auth,
    [
      check("taskName", "Task Name is required")
        .not()
        .isEmpty()
    ],
    [
      check("startTime", "Start Time is required")
        .not()
        .isEmpty()
    ],
    [
      check("endTime", "End Time is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskName, projectId, startTime, endTime } = req.body;

    // Build Task Objects
    const taskFields = {};

    taskFields.userId = req.user.id;
    taskFields.projectId = projectId;
    if (taskName) taskFields.taskName = taskName;
    if (startTime) taskFields.startTime = startTime;
    if (endTime) taskFields.endTime = endTime;

    try {
      // Create
      let task = await new Task(taskFields);

      await task.save();

      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route 	PUT api/task/start
// @desc 		Update Project Task
// @access 	Private
router.put(
  "/start",
  [
    auth,
    [
      check("activeTime", "Active Time is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId, activeTime } = req.body;

    // Build Task Objects
    const taskFields = {};

    taskFields.isActive = true;
    if (activeTime) taskFields.activeTime = activeTime;

    try {
      //Update
      let task = await Task.findOneAndUpdate(
        { _id: taskId },
        { $set: taskFields },
        { new: true }
      );

      return res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route 	PUT api/task/stop
// @desc 		Update Project Task
// @access 	Private
router.put(
  "/stop",
  [
    auth,
    [
      check("currentTime", "Current Time is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId, currentTime } = req.body;

    let task = await Task.findOne({ _id: taskId });

    // Build Task Objects
    const taskFields = {};

    let pt = moment(task.activeTime);

    let ct = moment(currentTime);

    let diff = pt.diff(ct);

    if (diff < 0) {
      diff = Math.abs(diff);
    }

    taskFields.isActive = false;
    if (task.workedTime) {
      taskFields.workedTime = +moment.utc(diff) + +task.workedTime;
    } else {
      taskFields.workedTime = moment.utc(diff);
    }
    if (currentTime) taskFields.activeTime = null;

    try {
      if (task) {
        //Update
        task = await Task.findOneAndUpdate(
          { _id: taskId },
          { $set: taskFields },
          { new: true }
        );
        return res.json(task);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
