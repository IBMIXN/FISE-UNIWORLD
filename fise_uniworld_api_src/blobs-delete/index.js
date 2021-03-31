const { deleteBlob, deleteSlides } = require("../utils/blobstorage");

module.exports = async function (context, req) {
  try {
    if (req.params.container === "slides") {
      await deleteSlides(req.body.fileName, req.body.numSlides);
    } else {
      await deleteBlob(req.body.fileName, req.params.container);
    }

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
