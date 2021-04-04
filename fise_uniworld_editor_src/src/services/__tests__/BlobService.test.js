import { axiosConfig } from "../../config";
import BlobService from "../BlobService";
jest.mock("../../config", () => {
  return {
    ...jest.requireActual("../../config"),
    axiosConfig: {
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    },
  };
});

describe("BlobService test", () => {
  it("should successfully fetch blob data from a container", async () => {
    const res = {
      data: {
        blobs: ["mockUrl"],
      },
    };
    const container = "mockContainerName";
    axiosConfig.get.mockImplementationOnce(() => Promise.resolve(res));
    await expect(BlobService.get(container)).resolves.toEqual(res.data.blobs);
    expect(axiosConfig.get).toHaveBeenCalledWith(`/blobs/${container}`);
  });

  it("should successfully post blob data to a container", async () => {
    const res = {
      data: {
        url: "mockUrl",
      },
    };
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    const container = "mockContainerName";
    axiosConfig.post.mockImplementationOnce(() => Promise.resolve(res));
    await expect(BlobService.upload(res.data, container)).resolves.toEqual(res.data.url);
    expect(axiosConfig.post).toHaveBeenCalledWith(`/blobs/${container}`, res.data, config);
  });

  it("should successfully delete a blob from a container", async () => {
    const req = {
      data: {
        fileName: "mockFileName",
      },
    };
    const container = "mockContainerName";
    axiosConfig.delete.mockImplementationOnce(() => Promise.resolve());
    await expect(BlobService.delete(req.data.fileName, container)).resolves.not.toThrow();
    expect(axiosConfig.delete).toHaveBeenCalledWith(`/blobs/${container}`, req);
  });

  it("should successfully delete slides based on fileName and numSlides", async () => {
    const req = {
      data: {
        fileName: "mockFileName",
        numSlides: 2,
      },
    };
    axiosConfig.delete.mockImplementationOnce(() => Promise.resolve());
    await expect(
      BlobService.deleteSlides(req.data.fileName, req.data.numSlides)
    ).resolves.not.toThrow();
    expect(axiosConfig.delete).toHaveBeenCalledWith("/blobs/slides", req);
  });
});
