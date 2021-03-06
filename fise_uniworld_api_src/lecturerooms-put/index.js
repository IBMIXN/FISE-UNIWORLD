const { updateLectureRoom } = require("../utils/lecturerooms");

module.exports = async function (context, req) {
  try {
    const lectureRoom = await updateLectureRoom(req.params.id, req.body);
    context.res = {
      body: lectureRoom,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { message: "An error has occured. Please try again." },
    };
  }
};
