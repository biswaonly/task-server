const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const auth = require("../../middleware/auth");
const Project = require("../../models/Project");

// @route 	GET api/project
// @desc 		Get Current User Project
// @access 	Private
router.get("/", auth, async (req, res) => {
  try {
    const project = await Project.find({ admin: req.user.id });

    if (!project) {
      return res.status(400).json({ msg: "There is no project for this User" });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route 	POST api/project
// @desc 		Create New Project
// @access 	Private
router.post(
  "/",
  [
    auth,
    [
      check("projectName", "projectName is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectName } = req.body;

    // Build Project Objects
    const projectFields = {};

    projectFields.admin = req.user.id;
    if (projectName) projectFields.projectName = projectName;

    try {
      // Create
      let project = await new Project(projectFields);

      await project.save();

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
