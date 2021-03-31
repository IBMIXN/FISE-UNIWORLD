const { getEventRoomById } = require("../utils/eventrooms");

module.exports = async function (context, req) {
  try {
    const eventRoom = await getEventRoomById(req.params.id);
    context.res = {
      body: eventRoom,
    };
  } catch (err) {
    context.log(`Error code: ${err.code}, message: ${err.message}`);
    context.res = {
      status: 500,
      body: { message: "An error has occured. Please try again." },
    };
  }
};
