import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      marginRight: theme.spacing(2),
    },
  })
);

const Navbar = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          UniWorld Editor
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/eventrooms">
          Event Rooms
        </Button>
        <Button color="inherit" component={RouterLink} to="/lecturerooms">
          Lecture Rooms
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
