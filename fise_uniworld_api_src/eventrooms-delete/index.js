const { deleteEventRoom } = require("../utils/eventrooms");

module.exports = async function (context, req) {
  try {
    await deleteEventRoom(req.params.id);
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
