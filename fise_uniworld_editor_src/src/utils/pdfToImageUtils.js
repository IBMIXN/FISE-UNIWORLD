const PDFJS = require("pdfjs-dist/webpack");

const getCanvasBlobAsync = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
};

const readFileData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // reader.onload = (e) => {
    //   resolve(e.target.result);
    // };
    reader.addEventListener("load", (e) => {
      resolve(e.target.result);
    });
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

const convertPdfToImages = async (file) => {
  const data = await readFileData(file);
  const pdf = await PDFJS.getDocument(data).promise;
  const formData = new FormData();
  const canvas = document.createElement("canvas");
  const numSlides = pdf.numPages;
  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const viewport = page.getViewport({ scale: 1 });
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
    const newFileName = fileNameWithoutExt + "_" + i + ".png";
    const slideImageBlob = await getCanvasBlobAsync(canvas);
    formData.append(`images[${i}]`, slideImageBlob, newFileName);
  }
  canvas.remove();

  return {
    numSlides,
    formData,
  };
};

const convertPreviewImage = async (file) => {
  const data = await readFileData(file);
  const pdf = await PDFJS.getDocument(data).promise;
  const canvas = document.createElement("canvas");
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext: context, viewport: viewport }).promise;
  canvas.remove();
  return canvas.toDataURL();
};
export { convertPdfToImages, convertPreviewImage };
