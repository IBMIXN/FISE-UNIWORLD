const mongoose = require('mongoose');
const httpFunction = require('./index');
const context = require('../testing/defaultContext');
const { loadDatabase } = require('../utils/database');
const Eventroom = require('../models/eventroom');
const { injectedMockEventRoomData } = require('../testing/mockData');

describe('eventrooms-delete', () => {
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

  it('eventrooms-delete should delete an event room by id', async () => {
    const request = {
      params: {
        id: injectedEventRoomId.toString(),
      },
    };
    await httpFunction(context, request);

    expect(context.res.status).toBe(204);

    const eventRoom = await Eventroom.findById(injectedEventRoomId.toString());
    expect(eventRoom).toBe(null);
  });

  it('eventrooms-delete should return a 500 response code if the id is invalid', async () => {
    const request = {
      params: {
        id: 'invalidId',
      },
    };
    await httpFunction(context, request);

    expect(context.res.status).toBe(500);
    expect(context.res.body).toBeDefined();
    expect(context.res.body.message).toBeDefined();
  });
});
