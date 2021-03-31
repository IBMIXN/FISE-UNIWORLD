const { createLectureRoom } = require("../utils/lecturerooms");

module.exports = async function (context, req) {
  try {
    const lectureRoom = await createLectureRoom(req.body);
    context.res = {
      status: 201,
      body: lectureRoom,
    };
  } catch (err) {
    context.log(`Error code: ${err.code}, message: ${err.message}`);
    context.res = {
      status: 500,
      body: { message: "An error has occured. Please try again." },
    };
  }
};
