const { deleteLectureRoom } = require("../utils/lecturerooms");

module.exports = async function (context, req) {
  try {
    await deleteLectureRoom(req.params.id);
    context.res = {
      status: 204, // no content
    };
  } catch (err) {
    context.log(`Error code: ${err.code}, message: ${err.message}`);
    context.res = {
      status: 500,
      body: { message: "An error has occured. Please try again." },
    };
  }
};
