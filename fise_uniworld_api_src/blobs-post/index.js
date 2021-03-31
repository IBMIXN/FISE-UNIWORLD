const { parseReqData, uploadBlobs } = require("../utils/blobstorage");

module.exports = async function (context, req) {
  const parsedData = parseReqData(req);
  const url = await uploadBlobs(parsedData, req.params.container);
  context.res = {
    body: url ? { url } : { message: "An error has occured. Please try again." },
  };
};
