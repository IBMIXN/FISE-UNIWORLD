import RoundTableImage from "../assets/img/roundtable.png";
import RectangularTableImage from "../assets/img/rectangulartable.png";

const getTableImage = (tableType) => {
  switch (tableType) {
    case "RoundMeetingTable":
      return RoundTableImage;
    case "RectangularMeetingTable":
      return RectangularTableImage;
    default:
      return RoundTableImage;
  }
};

const isEdge = (row, col) =>
  (row === 0 && col === 0) ||
  (row === 8 && col === 8) ||
  (row === 8 && col === 0) ||
  (row === 0 && col === 8) ||
  (row === 8 && col === 7) ||
  (row === 7 && col === 8) ||
  (row === 8 && col === 1) ||
  (row === 1 && col === 8) ||
  (row === 0 && col === 7) ||
  (row === 7 && col === 0) ||
  (row === 0 && col === 1) ||
  (row === 1 && col === 0);

// Returns -1 if table is not present in row,col for tables array
// Otherwise returns the table index of the table in row,col
const getTableIndex = (row, col, tables) => {
  for (let i = 0; i < tables.length; i++) {
    // convert (-4 to 4 range) coordinates into (0 to 8 range) coordinates
    const newX = Math.abs(tables[i].posX - 4);
    const newY = Math.abs(tables[i].posY - 4);
    if (newX === row && newY === col) {
      return i;
    }
  }
  return -1;
};

const toTablePos = (x) => (x - 4) * -1;

export { isEdge, getTableIndex, toTablePos, getTableImage };
