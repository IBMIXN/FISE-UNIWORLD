import PropTypes from "prop-types";
import { MeetingTablePropType } from "../propTypes/EventRoom";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Avatar } from "@material-ui/core";
import { isEdge, getTableIndex, toTablePos, getTableImage } from "../utils/tableUtils";
import TableDialog from "./TableDialog";
import { useReducerState } from "../utils/customHooks";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    display: "grid",
    gridGap: "5px",
    gridAutoFlow: "row",
    gridTemplateColumns: "repeat(9, 65px)",
    gridTemplateRows: "repeat(9, 65px)",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(9, 45px)",
      gridTemplateRows: "repeat(9, 45px)",
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "repeat(9, 36px)",
      gridTemplateRows: "repeat(9, 36px)",
    },
  },
  gridItem: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "36px",
  },
  gridItemFill: {
    background: "#ccc",
    "&:hover": {
      background: "#aaa",
    },
  },
}));

const TableGridEditor = ({ tables, updateMeetingTables }) => {
  const classes = useStyles();
  const dialogInitialState = {
    open: false,
    posX: 0,
    posY: 0,
  };
  const editDialogInitialState = {
    open: false,
    index: 0,
    table: undefined,
  };
  const [dialog, setDialog] = useReducerState(dialogInitialState);
  const [editDialog, setEditDialog] = useReducerState(editDialogInitialState);

  const submitDialog = (table) => {
    table = { ...table, posX: dialog.posX, posY: dialog.posY };
    setDialog(dialogInitialState);
    updateMeetingTables([...tables, table]);
  };

  const submitEditDialog = (table) => {
    const newTables = [...tables];
    newTables[editDialog.index] = table;
    setEditDialog(editDialogInitialState);
    updateMeetingTables(newTables);
  };

  const editTable = (index) => {
    setEditDialog({ open: true, index: index, table: tables[index] });
  };

  const addTable = (posX, posY) => {
    console.log(posX + "," + posY);
    setDialog({
      open: true,
      posX: posX,
      posY: posY,
    });
  };

  const generateGridItems = () => {
    const gridItems = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const tableIndex = getTableIndex(row, col, tables);
        if (isEdge(row, col)) {
          gridItems.push(<div className={classes.gridItem}> </div>);
        } else if (tableIndex !== -1) {
          gridItems.push(
            <Button
              id={`gridEditButton${row}-${col}`}
              className={`${classes.gridItem} ${classes.gridItemFill}`}
              onClick={() => editTable(tableIndex)}
            >
              <Avatar src={getTableImage(tables[tableIndex].type)} />
            </Button>
          );
        } else {
          gridItems.push(
            <Button
              id={`gridAddButton${row}-${col}`}
              className={`${classes.gridItem} ${classes.gridItemFill}`}
              onClick={() => addTable(toTablePos(row), toTablePos(col))}
            >
               
            </Button>
          );
        }
      }
    }
    return gridItems;
  };

  return (
    <React.Fragment>
      <TableDialog
        id="editDialog"
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false })}
        onSubmit={submitEditDialog}
        updateTable={editDialog.table}
      />
      <TableDialog
        id="tableDialog"
        open={dialog.open}
        onClose={() => setDialog({ open: false })}
        onSubmit={submitDialog}
      />
      <div className={classes.gridContainer}>
        {generateGridItems().map((gridItem, i) => (
          <React.Fragment key={i}>{gridItem}</React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
};

TableGridEditor.propTypes = {
  tables: PropTypes.arrayOf(MeetingTablePropType).isRequired,
  updateMeetingTables: PropTypes.func,
};

TableGridEditor.defaultProps = {
  updateMeetingTables: () => {},
};

export default TableGridEditor;
