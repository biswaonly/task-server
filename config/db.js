const mongoose = require("mongoose");
const config = require("config");

// DB config
const db = config.get("mongoURI");

//Connect MongoDB
const connectDB = async () => {
  try {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    // Exit Process With Failure
    process.exit(1);
  }
};

module.exports = connectDB;
