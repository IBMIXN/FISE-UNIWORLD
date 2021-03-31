const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Lectureroom = require('../models/lectureroom');
const {
  mockLectureRoomUpdate,
  injectedMockLectureRoomData,
} = require('../testing/mockData');

describe('lecturerooms-put', () => {
  let injectedLectureRoomId = null;
  // Load MongoDB Memory Database
  beforeAll(async () => {
    await loadDatabase();
    await Lectureroom.deleteMany();
  });

  // Inject mock lecture room data
  beforeEach(async () => {
    const lectureRoom = await new Lectureroom(
      injectedMockLectureRoomData
    ).save();
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

  it('lecturerooms-put should update an lecture room and return the updated lecture room', async () => {
    const request = {
      params: {
        id: injectedLectureRoomId.toString(),
      },
      body: mockLectureRoomUpdate,
    };
    await httpFunction(context, request);

    expect(context.res.body).toBeDefined();
    expect(context.res.body._id.toString()).toBe(
      injectedLectureRoomId.toString()
    );
    expect(context.res.body.title).toBe(mockLectureRoomUpdate.title);
    expect(context.res.body.module).toBe(mockLectureRoomUpdate.module);
    expect(context.res.body.lecturer).toBe(mockLectureRoomUpdate.lecturer);
    expect(context.res.body.startTime.toString()).toBe(
      mockLectureRoomUpdate.startTime.toString()
    );
    expect(context.res.body.endTime.toString()).toBe(
      mockLectureRoomUpdate.endTime.toString()
    );
    expect(context.res.body.firstSlideUrl).toBe(
      mockLectureRoomUpdate.firstSlideUrl
    );
    expect(context.res.body.numSlides).toBe(mockLectureRoomUpdate.numSlides);
  });

  it('lecturerooms-put should return a 500 response code if the data is invalid', async () => {
    const request = {
      params: {
        id: injectedLectureRoomId.toString(),
      },
      body: { ...mockLectureRoomUpdate, title: null },
    };
    await httpFunction(context, request);

    expect(context.res.status).toBe(500);
    expect(context.res.body).toBeDefined();
    expect(context.res.body.message).toBeDefined();
  });
});
