const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
      minLength: [2, "Too Short"],
      maxLenght: [32, "Too Long"],
    },
    slug: { type: String, unique: true, lowercase: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
