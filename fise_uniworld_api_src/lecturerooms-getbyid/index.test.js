const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Lectureroom = require('../models/lectureroom');
const { injectedMockLectureRoomData } = require('../testing/mockData');

describe('lecturerooms-getbyid', () => {
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

  it('lecturerooms-getbyid should return the correct lectureroom by id', async () => {
    const request = {
      params: { id: injectedLectureRoomId.toString() },
    };
    await httpFunction(context, request);

    expect(context.res.body).toBeDefined();
    expect(context.res.body._id.toString()).toBe(
      injectedLectureRoomId.toString()
    );
    expect(context.res.body.title).toBe(injectedMockLectureRoomData.title);
    expect(context.res.body.module).toBe(injectedMockLectureRoomData.module);
    expect(context.res.body.lecturer).toBe(
      injectedMockLectureRoomData.lecturer
    );
    expect(context.res.body.startTime.toString()).toBe(
      injectedMockLectureRoomData.startTime.toString()
    );
    expect(context.res.body.endTime.toString()).toBe(
      injectedMockLectureRoomData.endTime.toString()
    );
    expect(context.res.body.firstSlideUrl).toBe(
      injectedMockLectureRoomData.firstSlideUrl
    );
    expect(context.res.body.numSlides).toBe(
      injectedMockLectureRoomData.numSlides
    );
  });

  it('lecturerooms-getbyid should return a 500 response code if the id does not exist', async () => {
    const request = {
      params: { id: 'invalidId' },
    };
    await httpFunction(context, request);

    expect(context.res.status).toBe(500);
    expect(context.res.body).toBeDefined();
    expect(context.res.body.message).toBeDefined();
  });
});
