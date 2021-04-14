const { Schema, model } = require("mongoose");

const tweetSchema = Schema(
  {
    name: String,
    content: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Tweet", tweetSchema);
