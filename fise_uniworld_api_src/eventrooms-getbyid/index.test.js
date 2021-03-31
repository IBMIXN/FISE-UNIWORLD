const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Eventroom = require('../models/eventroom');
const { injectedMockEventRoomData } = require('../testing/mockData');

describe('eventrooms-getbyid', () => {
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

  it('eventrooms-getbyid should return the correct eventroom by id', async () => {
    const request = {
      params: { id: injectedEventRoomId.toString() },
    };
    await httpFunction(context, request);

    expect(context.res.body).toBeDefined();
    expect(context.res.body._id.toString()).toBe(
      injectedEventRoomId.toString()
    );
    expect(context.res.body.title).toBe(injectedMockEventRoomData.title);
    expect(context.res.body.eventDate.toString()).toBe(
      injectedMockEventRoomData.eventDate.toString()
    );
    expect(context.res.body.meetingTables).toBeDefined();
    expect(context.res.body.background).toBe(
      injectedMockEventRoomData.background
    );
    expect(context.res.body.scene).toBe(injectedMockEventRoomData.scene);
  });

  it('eventrooms-getbyid should return a 500 response code if the id does not exist', async () => {
    const request = {
      params: { id: 'invalidId' },
    };
    await httpFunction(context, request);

    expect(context.res.status).toBe(500);
    expect(context.res.body).toBeDefined();
    expect(context.res.body.message).toBeDefined();
  });
});
