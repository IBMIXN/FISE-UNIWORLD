import { axiosConfig } from "../../config";
import { mockEventRoom } from "../../mockData/eventRoomMock";
import EventRoomService from "../EventRoomService";
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

describe("EventRoomService test", () => {
  it("should successfully fetch all event rooms", async () => {
    const res = {
      data: [mockEventRoom],
    };
    axiosConfig.get.mockImplementationOnce(() => Promise.resolve(res));
    await expect(EventRoomService.getAll()).resolves.toEqual(res.data);
    expect(axiosConfig.get).toHaveBeenCalledWith("/eventrooms?showDetails=true");
  });

  it("should successfully fetch an event room by id", async () => {
    const res = {
      data: mockEventRoom,
    };
    const mockId = 0;
    axiosConfig.get.mockImplementationOnce(() => Promise.resolve(res));
    await expect(EventRoomService.get(mockId)).resolves.toEqual(res.data);
    expect(axiosConfig.get).toHaveBeenCalledWith(`/eventrooms/${mockId}`);
  });

  it("should successfully post event room data", async () => {
    const res = {
      data: mockEventRoom,
    };
    axiosConfig.post.mockImplementationOnce(() => Promise.resolve(res));
    await expect(EventRoomService.create(res.data)).resolves.toEqual(res.data);
    expect(axiosConfig.post).toHaveBeenCalledWith("/eventrooms", res.data);
  });

  it("should successfully update event room data", async () => {
    const res = {
      data: mockEventRoom,
    };
    const mockId = 0;
    axiosConfig.put.mockImplementationOnce(() => Promise.resolve(res));
    await expect(EventRoomService.update(mockId, res.data)).resolves.toEqual(res.data);
    expect(axiosConfig.put).toHaveBeenCalledWith(`/eventrooms/${mockId}`, res.data);
  });

  it("should successfully delete an event room by id", async () => {
    const mockId = 0;
    axiosConfig.delete.mockImplementationOnce(() => Promise.resolve());
    await expect(EventRoomService.delete(mockId)).resolves.not.toThrow();
    expect(axiosConfig.delete).toHaveBeenCalledWith(`/eventrooms/${mockId}`);
  });
});
