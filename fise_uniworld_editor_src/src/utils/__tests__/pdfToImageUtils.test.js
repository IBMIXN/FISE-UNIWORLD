import FileReaderMock from "../../mockData/fileReaderMock";
import FormDataMock from "../../mockData/formDataMock";
import { convertPdfToImages, convertPreviewImage } from "../pdfToImageUtils";

const PDFJS = require("pdfjs-dist/webpack");
jest.mock("pdfjs-dist/webpack");

describe("pdfToImageUtils test", () => {
  const originalFileReader = FileReader;
  const originalFormData = FormData;
  const mockCanvas = {
    height: 0,
    width: 0,
    getContext: () => {},
    remove: () => {},
    toBlob: (f) => {
      f();
    },
    toDataURL: () => "mockUrl",
  };

  beforeEach(() => {
    window.FileReader = FileReaderMock;
    window.FormData = FormDataMock;
    jest.spyOn(document, "createElement").mockImplementation(() => mockCanvas);
  });

  afterEach(() => {
    window.FileReader = originalFileReader;
    window.FormData = originalFormData;
  });

  it("convertPdfToImages should work correctly", async () => {
    PDFJS.getDocument = jest.fn(() => ({
      promise: Promise.resolve({
        numPages: 0,
      }),
    }));
    const mockFile = { name: "mockFileName" };
    const { numSlides, formData } = await convertPdfToImages(mockFile);
    expect(numSlides).toEqual(0);
    expect(formData).toBeDefined();
  });

  it("convertPdfToImages should work correctly with numSlides > 0", async () => {
    PDFJS.getDocument = jest.fn(() => ({
      promise: Promise.resolve({
        numPages: 1,
        getPage: () =>
          Promise.resolve({
            getViewport: () => ({ width: 10, height: 10 }),
            render: () => ({ promise: Promise.resolve() }),
          }),
      }),
    }));
    const mockFile = { name: "mockFileName" };
    const { numSlides, formData } = await convertPdfToImages(mockFile);
    expect(numSlides).toEqual(1);
    expect(formData).toBeDefined();
  });

  it("convertPreviewImage should work correctly", async () => {
    PDFJS.getDocument = jest.fn(() => ({
      promise: Promise.resolve({
        getPage: () =>
          Promise.resolve({
            getViewport: () => ({ width: 10, height: 10 }),
            render: () => ({ promise: Promise.resolve() }),
          }),
      }),
    }));
    const mockFile = { name: "mockFileName" };
    const url = await convertPreviewImage(mockFile);
    expect(url).toEqual("mockUrl");
  });
});
