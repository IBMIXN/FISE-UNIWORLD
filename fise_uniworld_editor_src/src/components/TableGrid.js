import PropTypes from 'prop-types';
import { MeetingTablePropType } from '../propTypes/EventRoom';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import { isEdge, getTableIndex, getTableImage } from '../utils/tableUtils';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    display: 'grid',
    gridGap: '5px',
    gridTemplateColumns: 'repeat(9, 50px)',
    gridTemplateRows: 'repeat(9, 50px)',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(9, 36px)',
      gridTemplateRows: 'repeat(9, 36px)',
    },
    gridAutoFlow: 'row',
  },
  gridItem: {
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemFill: {
    transition: 'background 0.3s ease',
    '&:hover': {
      background: '#aaa',
    },
    background: '#ccc',
  },
}));

const TableGrid = ({ tables }) => {
  const classes = useStyles();

  const generateGridItems = () => {
    const gridItems = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const tableIndex = getTableIndex(row, col, tables);
        if (isEdge(row, col)) {
          gridItems.push(<div className={classes.gridItem}> </div>);
        } else if (tableIndex !== -1) {
          gridItems.push(
            <div
              id={tableIndex}
              className={`${classes.gridItem} ${classes.gridItemFill}`}
            >
              <Avatar src={getTableImage(tables[tableIndex].type)} />
            </div>
          );
        } else {
          gridItems.push(
            <div className={`${classes.gridItem} ${classes.gridItemFill}`}>
               
            </div>
          );
        }
      }
    }
    return gridItems;
  };

  return (
    <React.Fragment>
      <div className={classes.gridContainer}>
        {generateGridItems().map((gridItem, i) => (
          <React.Fragment key={i}>{gridItem}</React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
};

TableGrid.propTypes = {
  tables: PropTypes.arrayOf(MeetingTablePropType).isRequired,
};

export default TableGrid;
