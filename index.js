const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");

const app = express();

// Connect DataBase
connectDB();

app
  // .use(express.static(path.join(__dirname, "public")))
  // .set("views", path.join(__dirname, "views"))
  // .set("view engine", "ejs")
  // .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// Init Middleware
app.use(express.json({ extended: false }));

// CORS headers
app.use("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Started");
});

// Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/project", require("./routes/api/project"));
app.use("/api/task", require("./routes/api/task"));

// module.exports = app;
