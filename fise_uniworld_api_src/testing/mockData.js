const mockEventRoomData = {
  title: 'mockTitle',
  eventDate: new Date(),
  meetingTables: [],
  background: 'mockBackground',
  scene: 'mockScene',
};

const mockEventRoomUpdate = {
  title: 'newMockTitle',
  eventDate: new Date(),
  meetingTables: [],
  background: 'newMockBackground',
  scene: 'newMockScene',
};

const injectedMockEventRoomData = {
  title: 'mockTitle2',
  eventDate: new Date(),
  meetingTables: [],
  background: 'mockBackground2',
  scene: 'mockScene2',
};

const mockLectureRoomData = {
  title: 'mockTitle',
  module: 'mockModule',
  lecturer: 'mockLecturer',
  startTime: new Date(),
  endTime: new Date(),
  firstSlideUrl: 'mockUrl',
  numSlides: 1,
};

const mockLectureRoomUpdate = {
  title: 'newMockTitle',
  module: 'newMockModule',
  lecturer: 'newMockLecturer',
  startTime: new Date(),
  endTime: new Date(),
  firstSlideUrl: 'newMockUrl',
  numSlides: 3,
};

const injectedMockLectureRoomData = {
  title: 'mockTitle2',
  module: 'mockModule2',
  lecturer: 'mockLecturer2',
  startTime: new Date(),
  endTime: new Date(),
  firstSlideUrl: 'mockUrl2',
  numSlides: 2,
};

module.exports = {
  mockEventRoomData,
  mockEventRoomUpdate,
  injectedMockEventRoomData,
  mockLectureRoomData,
  mockLectureRoomUpdate,
  injectedMockLectureRoomData,
};
