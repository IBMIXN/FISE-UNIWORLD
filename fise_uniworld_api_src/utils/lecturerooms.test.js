const mongoose = require("mongoose");
const {
  getLectureRooms,
  getLectureRoomById,
  createLectureRoom,
  updateLectureRoom,
  deleteLectureRoom,
} = require("./lecturerooms");
const Lectureroom = require("../models/lectureroom");
const { loadDatabase } = require("./database");

const {
  mockLectureRoomData,
  mockLectureRoomUpdate,
  injectedMockLectureRoomData,
} = require("../testing/mockData");

describe("Lectureroom", () => {
  let injectedLectureRoomId = null;

  // Load MongoDB Memory Database
  beforeAll(async () => {
    await loadDatabase();
    await Lectureroom.deleteMany();
  });

  // Inject mock lecture room data
  beforeEach(async () => {
    const lectureRoom = await new Lectureroom(injectedMockLectureRoomData).save();
    injectedLectureRoomId = lectureRoom._id;
  });

  // Clear DB after each test
  afterEach(async () => {
    await Lectureroom.deleteMany();
    injectedLectureRoomId = null;
  });

  // Close MongoDB connection
  afterAll(() => {
    mongoose.connection.close();
  });

  it("create lecture room", async () => {
    const lectureRoom = await createLectureRoom(mockLectureRoomData);
    expect(lectureRoom._id).toBeDefined();
    expect(lectureRoom.title).toBe(mockLectureRoomData.title);
    expect(lectureRoom.module).toBe(mockLectureRoomData.module);
    expect(lectureRoom.lecturer).toBe(mockLectureRoomData.lecturer);
    expect(lectureRoom.startTime.toString()).toBe(mockLectureRoomData.startTime.toString());
    expect(lectureRoom.endTime.toString()).toBe(mockLectureRoomData.endTime.toString());
    expect(lectureRoom.firstSlideUrl).toBe(mockLectureRoomData.firstSlideUrl);
    expect(lectureRoom.numSlides).toBe(mockLectureRoomData.numSlides);
  });

  it("create lecture room with missing title should cause error", async () => {
    let err;
    try {
      await createLectureRoom({
        ...mockLectureRoomData,
        title: null,
      });
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
  });

  it("get lecture rooms", async () => {
    const lectureRooms = await getLectureRooms();
    expect(lectureRooms.length).toBe(1);
    const lectureRoom = lectureRooms[0];
    expect(lectureRoom.title).toBe(injectedMockLectureRoomData.title);
    expect(lectureRoom.module).toBe(injectedMockLectureRoomData.module);
    expect(lectureRoom.lecturer).toBe(injectedMockLectureRoomData.lecturer);
    expect(lectureRoom.startTime.toString()).toBe(injectedMockLectureRoomData.startTime.toString());
    expect(lectureRoom.endTime.toString()).toBe(injectedMockLectureRoomData.endTime.toString());
    expect(lectureRoom.firstSlideUrl).toBe(injectedMockLectureRoomData.firstSlideUrl);
    expect(lectureRoom.numSlides).toBe(injectedMockLectureRoomData.numSlides);
  });

  it("get lecture room by id", async () => {
    const lectureRoom = await getLectureRoomById(injectedLectureRoomId);
    expect(lectureRoom._id).toBeDefined();
    expect(lectureRoom.title).toBe(injectedMockLectureRoomData.title);
    expect(lectureRoom.module).toBe(injectedMockLectureRoomData.module);
    expect(lectureRoom.lecturer).toBe(injectedMockLectureRoomData.lecturer);
    expect(lectureRoom.startTime.toString()).toBe(injectedMockLectureRoomData.startTime.toString());
    expect(lectureRoom.endTime.toString()).toBe(injectedMockLectureRoomData.endTime.toString());
    expect(lectureRoom.firstSlideUrl).toBe(injectedMockLectureRoomData.firstSlideUrl);
    expect(lectureRoom.numSlides).toBe(injectedMockLectureRoomData.numSlides);
  });

  it("update lecture room", async () => {
    const lectureRoom = await updateLectureRoom(injectedLectureRoomId, mockLectureRoomUpdate);
    expect(lectureRoom.title).toBe(mockLectureRoomUpdate.title);
    expect(lectureRoom.module).toBe(mockLectureRoomUpdate.module);
    expect(lectureRoom.lecturer).toBe(mockLectureRoomUpdate.lecturer);
    expect(lectureRoom.startTime.toString()).toBe(mockLectureRoomUpdate.startTime.toString());
    expect(lectureRoom.endTime.toString()).toBe(mockLectureRoomUpdate.endTime.toString());
    expect(lectureRoom.firstSlideUrl).toBe(mockLectureRoomUpdate.firstSlideUrl);
    expect(lectureRoom.numSlides).toBe(mockLectureRoomUpdate.numSlides);
  });

  it("update lecture room should ignore invalid fields", async () => {
    const mockLectureRoomWithInvalidFields = {
      ...mockLectureRoomUpdate,
      invalidFieldA: 0,
      invalidFieldB: "test",
    };
    const lectureRoom = await updateLectureRoom(
      injectedLectureRoomId,
      mockLectureRoomWithInvalidFields
    );
    expect(lectureRoom._id).toBeDefined();
    expect(lectureRoom.title).toBe(mockLectureRoomUpdate.title);
    expect(lectureRoom.module).toBe(mockLectureRoomUpdate.module);
    expect(lectureRoom.lecturer).toBe(mockLectureRoomUpdate.lecturer);
    expect(lectureRoom.startTime.toString()).toBe(mockLectureRoomUpdate.startTime.toString());
    expect(lectureRoom.endTime.toString()).toBe(mockLectureRoomUpdate.endTime.toString());
    expect(lectureRoom.firstSlideUrl).toBe(mockLectureRoomUpdate.firstSlideUrl);
    expect(lectureRoom.numSlides).toBe(mockLectureRoomUpdate.numSlides);
    expect(lectureRoom.invalidFieldA).toBeUndefined();
    expect(lectureRoom.invalidFieldB).toBeUndefined();
  });

  it("delete lecture room", async () => {
    let lectureRoom = await getLectureRoomById(injectedLectureRoomId);
    expect(lectureRoom._id).toBeDefined();
    await deleteLectureRoom(injectedLectureRoomId);
    lectureRoom = await getLectureRoomById(injectedLectureRoomId);
    expect(lectureRoom).toBe(null);
  });
});
