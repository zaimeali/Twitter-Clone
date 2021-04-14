require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");

// Schema
const Tweet = require("./models/tweet");

// Initialize App
const app = express();
const filter = new Filter();

// Database
mongoose
  .connect(process.env.DB_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(`Error in connection ${err.message}`));

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Validation Middleware
const isValid = (req, res, next) => {
  const data = req.body;
  req.valid = false;
  if (
    data.name &&
    data.content &&
    data.name.toString().trim() !== "" &&
    data.content.toString().trim() !== ""
  ) {
    req.valid = true;
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  Tweet.find().exec((err, tweet) => {
    if (err) {
      return res.status(401).json({
        message: "Error in retrieving data from Database",
      });
    }
    return res.status(200).json(tweet.reverse());
  });
});

// Middleware for create post
app.use(
  rateLimit({
    windowMs: 5 * 1000, // 5 seconds
    max: 1, // limit each ip to 100 requests per WindowMs
  })
);

app.post("/create", isValid, (req, res) => {
  if (req.valid) {
    const { name, content } = req.body;
    const tweet = {
      name: filter.clean(name),
      content: filter.clean(content),
    };
    const post = new Tweet(tweet);
    post.save();
    return res.status(200).json(post);
  } else {
    return res.status(401).json({
      message: "You forgot to enter something",
    });
  }
});

// Listen
const PORT = 8002;
app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
