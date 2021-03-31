const { getBlobs, getFirstSlides } = require("../utils/blobstorage");

module.exports = async function (context, req) {
  let blobs;
  if (req.params.container === "slides") {
    blobs = await getFirstSlides();
  } else {
    blobs = await getBlobs(req.params.container);
  }
  context.res = {
    body: { blobs: blobs || [] },
  };
};
