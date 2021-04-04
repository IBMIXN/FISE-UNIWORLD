const getFileNameFromBlobUrl = (url) => {
  //filters out the uuidv1 string before the filename
  return url.substring(url.lastIndexOf("/") + 38);
};

const getSlideNameFromBlobUrl = (url) => {
  //filters out the uuidv1 string before the filename
  return url.substring(url.lastIndexOf("/") + 38, url.lastIndexOf("_"));
};

const getFileName = (url) => {
  return url.substring(url.lastIndexOf("/") + 1);
};

export { getFileNameFromBlobUrl, getSlideNameFromBlobUrl, getFileName };
