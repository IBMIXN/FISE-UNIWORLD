const { createEventRoom } = require("../utils/eventrooms");

module.exports = async function (context, req) {
  try {
    const eventRoom = await createEventRoom(req.body);
    context.res = {
      status: 201, // created
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
