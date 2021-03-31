const mongoose = require('mongoose');
const {
  getEventRooms,
  getEventRoomById,
  createEventRoom,
  updateEventRoom,
  deleteEventRoom,
} = require('./eventrooms');
const Eventroom = require('../models/eventroom');
const { loadDatabase } = require('./database');
const {
  mockEventRoomData,
  mockEventRoomUpdate,
  injectedMockEventRoomData,
} = require('../testing/mockData');

describe('Eventroom', () => {
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

  it('create event room', async () => {
    const eventRoom = await createEventRoom(mockEventRoomData);
    expect(eventRoom._id).toBeDefined();
    expect(eventRoom.title).toBe(mockEventRoomData.title);
    expect(eventRoom.eventDate).toBe(mockEventRoomData.eventDate);
    expect(eventRoom.background).toBe(mockEventRoomData.background);
    expect(eventRoom.scene).toBe(mockEventRoomData.scene);
  });

  it('create event room with missing title should cause error', async () => {
    let err;
    try {
      await createEventRoom({
        ...mockEventRoomData,
        title: null,
      });
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
  });

  it('get event rooms', async () => {
    const eventRooms = await getEventRooms();
    expect(eventRooms.length).toBe(1);
    const eventRoom = eventRooms[0];
    expect(eventRoom._id).toBeDefined();
    expect(eventRoom.title).toBe(injectedMockEventRoomData.title);
    expect(eventRoom.eventDate.toString()).toBe(
      injectedMockEventRoomData.eventDate.toString()
    );
    expect(eventRoom.meetingTables).toBeUndefined();
    expect(eventRoom.background).toBeUndefined();
    expect(eventRoom.scene).toBeUndefined();
  });

  it('get event rooms with details', async () => {
    const eventRooms = await getEventRooms(true);
    expect(eventRooms.length).toBe(1);
    const eventRoom = eventRooms[0];
    expect(eventRoom._id).toBeDefined();
    expect(eventRoom.title).toBe(injectedMockEventRoomData.title);
    expect(eventRoom.eventDate.toString()).toBe(
      injectedMockEventRoomData.eventDate.toString()
    );
    expect(eventRoom.meetingTables).toBeDefined();
    expect(eventRoom.background).toBe(injectedMockEventRoomData.background);
    expect(eventRoom.scene).toBe(injectedMockEventRoomData.scene);
  });

  it('get event room by id', async () => {
    const eventRoom = await getEventRoomById(injectedEventRoomId);
    expect(eventRoom._id).toBeDefined();
    expect(eventRoom.title).toBe(injectedMockEventRoomData.title);
    expect(eventRoom.eventDate.toString()).toBe(
      injectedMockEventRoomData.eventDate.toString()
    );
    expect(eventRoom.meetingTables).toBeDefined();
    expect(eventRoom.background).toBe(injectedMockEventRoomData.background);
    expect(eventRoom.scene).toBe(injectedMockEventRoomData.scene);
  });

  it('update event room', async () => {
    const eventRoom = await updateEventRoom(
      injectedEventRoomId,
      mockEventRoomUpdate
    );
    expect(eventRoom._id).toBeDefined();
    expect(eventRoom.title).toBe(mockEventRoomUpdate.title);
    expect(eventRoom.eventDate.toString()).toBe(
      mockEventRoomUpdate.eventDate.toString()
    );
    expect(eventRoom.meetingTables).toBeDefined();
    expect(eventRoom.background).toBe(mockEventRoomUpdate.background);
    expect(eventRoom.scene).toBe(mockEventRoomUpdate.scene);
  });

  it('delete event room', async () => {
    let eventRoom = await getEventRoomById(injectedEventRoomId);
    expect(eventRoom._id).toBeDefined();
    await deleteEventRoom(injectedEventRoomId);
    eventRoom = await getEventRoomById(injectedEventRoomId);
    expect(eventRoom).toBe(null);
  });
});
