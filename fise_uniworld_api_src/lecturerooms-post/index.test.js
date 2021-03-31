const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Lectureroom = require('../models/lectureroom');
const {
  mockLectureRoomData,
  injectedMockLectureRoomData,
} = require('../testing/mockData');

describe('lecturerooms-post', () => {
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

  it('lecturerooms-post should create an lecture room and return it', async () => {
    const request = {
      body: mockLectureRoomData,
    };
    await httpFunction(context, request);

    expect(context.res.body).toBeDefined();
    expect(context.res.body._id).toBeDefined();
    expect(context.res.body.title).toBe(mockLectureRoomData.title);
    expect(context.res.body.module).toBe(mockLectureRoomData.module);
    expect(context.res.body.lecturer).toBe(mockLectureRoomData.lecturer);
    expect(context.res.body.startTime.toString()).toBe(
      mockLectureRoomData.startTime.toString()
    );
    expect(context.res.body.endTime.toString()).toBe(
      mockLectureRoomData.endTime.toString()
    );
    expect(context.res.body.firstSlideUrl).toBe(
      mockLectureRoomData.firstSlideUrl
    );
    expect(context.res.body.numSlides).toBe(mockLectureRoomData.numSlides);

    const lectureRoom = await Lectureroom.findById(context.res.body._id);
    expect(lectureRoom).toBeDefined();
    expect(lectureRoom._id.toString()).toBe(context.res.body._id.toString());
  });

  it('lecturerooms-post should return a 500 response code if the data is invalid', async () => {
    const request = {
      body: { ...mockLectureRoomData, title: null },
    };
    await httpFunction(context, request);

    expect(context.res.status).toBe(500);
    expect(context.res.body).toBeDefined();
    expect(context.res.body.message).toBeDefined();
  });
});
