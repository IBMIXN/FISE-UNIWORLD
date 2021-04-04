import PropTypes from 'prop-types';

const LectureRoomPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  module: PropTypes.string.isRequired,
  lecturer: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  firstSlideUrl: PropTypes.string.isRequired,
  numSlides: PropTypes.number.isRequired,
});

const UpdateLectureRoomPropType = PropTypes.shape({
  title: PropTypes.string,
  module: PropTypes.string,
  lecturer: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
});

export { LectureRoomPropType, UpdateLectureRoomPropType };
