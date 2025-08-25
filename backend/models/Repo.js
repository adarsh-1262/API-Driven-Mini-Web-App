const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema(
  {
    githubId: { type: Number, unique: true, index: true }, // GitHub repo ID
    name: String,
    fullName: String,
    htmlUrl: String,
    description: String,
    language: String,
    stars: Number,
    owner: String,

    // metadata for assignment
    keyword: { type: String, index: true },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Repo", repoSchema);
