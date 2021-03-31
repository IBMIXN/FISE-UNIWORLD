const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Eventroom = require('../models/eventroom');
const {
  mockEventRoomData,
  injectedMockEventRoomData,
} = require('../testing/mockData');

describe('eventrooms-post', () => {
  let injectedEventRoomId = null;
  // Load MongoDB Memory Database
  beforeAll(async () => {
    await loadDatabase();
    await Eventroom.deleteMany();
  });

  // Inject mock event room data
  beforeEach(async () => {
    const eventRoom = await new Eventroom(injectedMockEventRoomData).save();
    injectedEventRoomId = eventRoom._id;
  });

  // Clear DB after each test
  afterEach(async () => {
    await Eventroom.deleteMany();
    injectedEventRoomId = null;
  });

  // Close MongoDB connection
  afterAll(() => {
    mongoose.connection.close();
  });

  it('eventrooms-post should create an event room and return it', async () => {
    const request = {
      body: mockEventRoomData,
    };
    await httpFunction(context, request);

    expect(context.res.body).toBeDefined();
    expect(context.res.body._id).toBeDefined();
    expect(context.res.body.title).toBe(mockEventRoomData.title);
    expect(context.res.body.eventDate.toString()).toBe(
      mockEventRoomData.eventDate.toString()
    );
    expect(context.res.body.meetingTables).toBeDefined();
    expect(context.res.body.background).toBe(mockEventRoomData.background);
    expect(context.res.body.scene).toBe(mockEventRoomData.scene);

    const eventRoom = await Eventroom.findById(context.res.body._id);
    expect(eventRoom).toBeDefined();
    expect(eventRoom._id.toString()).toBe(context.res.body._id.toString());
  });

  it('eventrooms-post should return a 500 response code if the data is invalid', async () => {
    const request = {
      body: { ...mockEventRoomData, title: null },
    };
    await httpFunction(context, request);

    expect(context.res.status).toBe(500);
    expect(context.res.body).toBeDefined();
    expect(context.res.body.message).toBeDefined();
  });
});
