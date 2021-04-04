import moment from "moment";

const validateEventRoom = (eventRoom) => {
  return (
    eventRoom.title &&
    eventRoom.scene &&
    eventRoom.background &&
    moment(eventRoom.eventDate).isValid() &&
    Array.isArray(eventRoom.meetingTables)
  );
};

const validateLectureRoom = (lectureRoom) => {
  return (
    lectureRoom.title &&
    lectureRoom.module &&
    lectureRoom.lecturer &&
    lectureRoom.firstSlideUrl &&
    Number.isInteger(lectureRoom.numSlides) &&
    moment(lectureRoom.startTime).isValid() &&
    moment(lectureRoom.endTime).isValid()
  );
};

export { validateEventRoom, validateLectureRoom };
