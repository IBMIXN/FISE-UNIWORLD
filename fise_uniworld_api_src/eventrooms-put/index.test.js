const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Eventroom = require('../models/eventroom');
const {
  mockEventRoomUpdate,
  injectedMockEventRoomData,
} = require('../testing/mockData');

describe('eventrooms-put', () => {
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

  it('eventrooms-put should update an event room and return the updated event room', async () => {
    const request = {
      params: {
        id: injectedEventRoomId.toString(),
      },
      body: mockEventRoomUpdate,
    };
    await httpFunction(context, request);

    expect(context.res.body).toBeDefined();
    expect(context.res.body._id.toString()).toBe(
      injectedEventRoomId.toString()
    );
    expect(context.res.body.title).toBe(mockEventRoomUpdate.title);
    expect(context.res.body.eventDate.toString()).toBe(
      mockEventRoomUpdate.eventDate.toString()
    );
    expect(context.res.body.meetingTables).toBeDefined();
    expect(context.res.body.background).toBe(mockEventRoomUpdate.background);
    expect(context.res.body.scene).toBe(mockEventRoomUpdate.scene);
  });

  it('eventrooms-put should return a 500 response code if the data is invalid', async () => {
    const request = {
      params: {
        id: injectedEventRoomId.toString(),
      },
      body: { ...mockEventRoomUpdate, title: null },
    };
    await httpFunction(context, request);

    expect(context.res.status).toBe(500);
    expect(context.res.body).toBeDefined();
    expect(context.res.body.message).toBeDefined();
  });
});
