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
  const existingLectureRoom = await getLectureRoomById(id);
  for (var key in lectureRoom) {
    if (lectureRoom.hasOwnProperty(key)) {
      existingLectureRoom[key] = lectureRoom[key];
    }
  }
  return await existingLectureRoom.save();
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
