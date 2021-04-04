import PropTypes from 'prop-types';

const MeetingTablePropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  zoomUrl: PropTypes.string.isRequired,
  posX: PropTypes.number.isRequired,
  posY: PropTypes.number.isRequired,
});

const EventRoomPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  eventDate: PropTypes.string.isRequired,
  meetingTables: PropTypes.arrayOf(MeetingTablePropType.isRequired).isRequired,
  background: PropTypes.string.isRequired,
  scene: PropTypes.string.isRequired,
});

const UpdateEventRoomPropType = PropTypes.shape({
  title: PropTypes.string,
  eventDate: PropTypes.string,
  meetingTables: PropTypes.arrayOf(MeetingTablePropType),
  background: PropTypes.string,
  scene: PropTypes.string,
});

export { EventRoomPropType, UpdateEventRoomPropType, MeetingTablePropType };
