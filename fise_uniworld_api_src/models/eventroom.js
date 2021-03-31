const mongoose = require("mongoose");

const eventRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    default: Date.now,
  },
  meetingTables: [
    {
      title: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: "RoundMeetingTable",
      },
      logoUrl: {
        type: String,
        default: "https://via.placeholder.com/150",
      },
      zoomUrl: {
        type: String,
        default: "https://zoom.us/",
      },
      posX: {
        type: Number,
        default: 0,
      },
      posY: {
        type: Number,
        default: 0,
      },
    },
  ],
  background: {
    type: String,
    default: "Default",
  },
  scene: {
    type: String,
    default: "Default",
  },
});

module.exports = mongoose.model("EventRoom", eventRoomSchema);
