const { loadDatabase } = require('./database');
const EventRoom = require('../models/eventroom');

const getEventRooms = async (showDetails) => {
  await loadDatabase();
  if (showDetails) {
    return await EventRoom.find();
  } else {
    return await EventRoom.find({}, 'title eventDate');
  }
};

const getEventRoomById = async (id) => {
  await loadDatabase();
  return await EventRoom.findOne({ _id: id });
};

const createEventRoom = async (eventRoom) => {
  await loadDatabase();
  return await new EventRoom({ ...eventRoom }).save();
};

const updateEventRoom = async (id, eventRoom) => {
  await loadDatabase();
  const existingEventRoom = await getEventRoomById(id);
  for (var key in eventRoom) {
    if (eventRoom.hasOwnProperty(key)) {
      existingEventRoom[key] = eventRoom[key];
    }
  }
  return await existingEventRoom.save();
};

const deleteEventRoom = async (id) => {
  await loadDatabase();
  await EventRoom.remove({ _id: id });
};

module.exports = {
  getEventRooms,
  getEventRoomById,
  createEventRoom,
  updateEventRoom,
  deleteEventRoom,
};
