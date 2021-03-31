const { loadDatabase } = require("./database");
const LectureRoom = require("../models/lectureroom");

const getLectureRooms = async () => {
  await loadDatabase();
  return await LectureRoom.find();
};

const getLectureRoomById = async (id) => {
  await loadDatabase();
  return await LectureRoom.findOne({ _id: id });
};

const createLectureRoom = async (lectureRoom) => {
  await loadDatabase();
  return await new LectureRoom({ ...lectureRoom }).save();
};

const updateLectureRoom = async (id, lectureRoom) => {
  await loadDatabase();
  return await LectureRoom.findByIdAndUpdate(id, lectureRoom, { new: true });
};

const deleteLectureRoom = async (id) => {
  await loadDatabase();
  await LectureRoom.remove({ _id: id });
};

module.exports = {
  getLectureRooms,
  getLectureRoomById,
  createLectureRoom,
  updateLectureRoom,
  deleteLectureRoom,
};
