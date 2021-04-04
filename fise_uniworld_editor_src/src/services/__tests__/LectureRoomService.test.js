import { axiosConfig } from "../../config";
import { mockLectureRoom } from "../../mockData/lectureRoomMock";
import LectureRoomService from "../LectureRoomService";
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

describe("LectureRoomService test", () => {
  it("should successfully fetch all lecture rooms", async () => {
    const res = {
      data: [mockLectureRoom],
    };
    axiosConfig.get.mockImplementationOnce(() => Promise.resolve(res));
    await expect(LectureRoomService.get()).resolves.toEqual(res.data);
    expect(axiosConfig.get).toHaveBeenCalledWith("/lecturerooms");
  });

  it("should successfully post lecture room data", async () => {
    const res = {
      data: mockLectureRoom,
    };
    axiosConfig.post.mockImplementationOnce(() => Promise.resolve(res));
    await expect(LectureRoomService.create(res.data)).resolves.toEqual(res.data);
    expect(axiosConfig.post).toHaveBeenCalledWith("/lecturerooms", res.data);
  });

  it("should successfully update lecture room data", async () => {
    const res = {
      data: mockLectureRoom,
    };
    const mockId = 0;
    axiosConfig.put.mockImplementationOnce(() => Promise.resolve(res));
    await expect(LectureRoomService.update(mockId, res.data)).resolves.toEqual(res.data);
    expect(axiosConfig.put).toHaveBeenCalledWith(`/lecturerooms/${mockId}`, res.data);
  });

  it("should successfully delete an lecture room by id", async () => {
    const mockId = 0;
    axiosConfig.delete.mockImplementationOnce(() => Promise.resolve());
    await expect(LectureRoomService.delete(mockId)).resolves.not.toThrow();
    expect(axiosConfig.delete).toHaveBeenCalledWith(`/lecturerooms/${mockId}`);
  });
});
