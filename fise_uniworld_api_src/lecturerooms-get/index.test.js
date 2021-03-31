const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Lectureroom = require('../models/lectureroom');
const { injectedMockLectureRoomData } = require('../testing/mockData');

describe('lecturerooms-get', () => {
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

  it('lecturerooms-get should return list of lectures', async () => {
    await httpFunction(context, { query: {} });

    expect(context.res.body.length).toEqual(1);
    expect(context.res.body[0].title).toBe(injectedMockLectureRoomData.title);
    expect(context.res.body[0].module).toBe(injectedMockLectureRoomData.module);
    expect(context.res.body[0].lecturer).toBe(
      injectedMockLectureRoomData.lecturer
    );
    expect(context.res.body[0].startTime.toString()).toBe(
      injectedMockLectureRoomData.startTime.toString()
    );
    expect(context.res.body[0].endTime.toString()).toBe(
      injectedMockLectureRoomData.endTime.toString()
    );
    expect(context.res.body[0].firstSlideUrl).toBe(
      injectedMockLectureRoomData.firstSlideUrl
    );
    expect(context.res.body[0].numSlides).toBe(
      injectedMockLectureRoomData.numSlides
    );
  });
});
