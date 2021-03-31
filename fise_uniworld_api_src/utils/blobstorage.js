const { v1: uuidv1 } = require("uuid");
const { BlobServiceClient } = require("@azure/storage-blob");
const multipart = require("parse-multipart");

const parseReqData = (req) => {
  const bodyBuffer = Buffer.from(req.body);
  const boundary = multipart.getBoundary(req.headers["content-type"]);
  return multipart.Parse(bodyBuffer, boundary);
};

const uploadBlobs = async (parsedData, container) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.BLOBSTORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(container);
  await containerClient.createIfNotExists({ access: "container" });
  const uuidPrefix = uuidv1() + "_";

  let url;
  for (let i = 0; i < parsedData.length; i++) {
    const blobName = uuidPrefix + parsedData[i].filename;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    try {
      await blockBlobClient.upload(parsedData[i].data, parsedData[i].data.length);
    } catch (err) {
      console.log(err);
      return null;
    }
    if (i === 0) {
      url = `${process.env.BLOBSTORAGE_BASE_URL}/${container}/${blobName}`;
    }
  }
  return url;
};

const getBlobs = async (container) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.BLOBSTORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(container);
  try {
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(`${process.env.BLOBSTORAGE_BASE_URL}/${container}/${blob.name}`);
    }
    return blobs;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const deleteBlob = async (fileName, container) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.BLOBSTORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(container);
  try {
    await containerClient.deleteBlob(fileName);
  } catch (err) {
    console.log(err);
  }
};

const deleteSlides = async (fileName, numSlides) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.BLOBSTORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient("slides");
  const prefix = fileName.substring(0, fileName.lastIndexOf("_") + 1);
  const ext = fileName.substring(fileName.lastIndexOf("."));
  try {
    for (let i = 0; i < numSlides; i++) {
      const slideName = prefix + i + ext;
      await containerClient.deleteBlob(slideName);
    }
  } catch (err) {
    console.log(err);
  }
};

const getFirstSlides = async () => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.BLOBSTORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient("slides");
  try {
    const slides = [];
    for await (const slide of containerClient.listBlobsFlat()) {
      const a = slide.name.lastIndexOf("_") + 1;
      const b = slide.name.indexOf(".", a);
      if (slide.name.substring(a, b) === "0") {
        slides.push(`${process.env.BLOBSTORAGE_BASE_URL}/slides/${slide.name}`);
      }
    }
    return slides;
  } catch (err) {
    console.log(err);
    return null;
  }
};
module.exports = { parseReqData, uploadBlobs, getBlobs, getFirstSlides, deleteBlob, deleteSlides };
