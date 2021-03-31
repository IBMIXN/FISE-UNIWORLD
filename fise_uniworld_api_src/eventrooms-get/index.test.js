const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Eventroom = require('../models/eventroom');
const { injectedMockEventRoomData } = require('../testing/mockData');

describe('eventrooms-get', () => {
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

  it('eventrooms-get should return list of events', async () => {
    const request = {
      query: {},
    };
    await httpFunction(context, request);

    expect(context.res.body.length).toEqual(1);
    expect(context.res.body[0]._id.toString()).toBe(
      injectedEventRoomId.toString()
    );
    expect(context.res.body[0].title).toBe(injectedMockEventRoomData.title);
    expect(context.res.body[0].eventDate.toString()).toBe(
      injectedMockEventRoomData.eventDate.toString()
    );
    expect(context.res.body[0].meetingTables).toBeUndefined();
    expect(context.res.body[0].background).toBeUndefined();
    expect(context.res.body[0].scene).toBeUndefined();
  });

  it('eventrooms-get with showDetails set to true should return list of events with full details', async () => {
    const request = {
      query: { showDetails: true },
    };

    await httpFunction(context, request);

    expect(context.res.body.length).toEqual(1);
    expect(context.res.body[0]._id.toString()).toBe(
      injectedEventRoomId.toString()
    );
    expect(context.res.body[0].title).toBe(injectedMockEventRoomData.title);
    expect(context.res.body[0].eventDate.toString()).toBe(
      injectedMockEventRoomData.eventDate.toString()
    );
    expect(context.res.body[0].meetingTables).toBeDefined();
    expect(context.res.body[0].background).toBe(
      injectedMockEventRoomData.background
    );
    expect(context.res.body[0].scene).toBe(injectedMockEventRoomData.scene);
  });
});
