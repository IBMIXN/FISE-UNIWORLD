const mongoose = require("mongoose");

const lectureRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  lecturer: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: Date.now,
  },
  firstSlideUrl: {
    type: String,
    required: true,
  },
  numSlides: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("LectureRoom", lectureRoomSchema);
