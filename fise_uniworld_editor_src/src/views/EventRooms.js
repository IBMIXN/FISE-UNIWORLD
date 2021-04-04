import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import AddIcon from "@material-ui/icons/Add";
import TableGrid from "../components/TableGrid";
import EventRoomService from "../services/EventRoomService";
import { Link as RouterLink } from "react-router-dom";
import { platformURL } from "../config";
import { useReducerState } from "../utils/customHooks";
import { findBackground, findScene, isBackgroundPreset } from "../utils/presets";
import { getFileNameFromBlobUrl } from "../utils/blobs";

const useStyles = makeStyles((theme) => ({
  mainSection: {
    paddingTop: theme.spacing(5),
  },
  eventInfoPanel: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
  },
  divider: {
    padding: theme.spacing(1),
  },
  centerTableGrid: {
    display: "flex",
    justifyContent: "center",
  },
  progressLoader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
  listItemCreate: {
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  },
  mt: {
    marginTop: theme.spacing(1),
  },
}));

const EventRooms = (props) => {
  const classes = useStyles();
  const [eventRooms, setEventRooms] = React.useState([]);
  const [currentEventRoom, setCurrentEventRoom] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [alert, setAlert] = useReducerState({
    open: false,
    message: "",
    type: "success",
  });

  const showAlert = (msg, type) => {
    setAlert({ open: true, message: msg, type: type });
  };

  const hideAlert = () => {
    setAlert({ open: false });
  };

  React.useEffect(() => {
    if (props.location.state && props.location.state.created) {
      showAlert("Successfully created event room.", "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);

  React.useEffect(() => {
    async function fetchEventRooms() {
      try {
        setLoading(true);
        const data = await EventRoomService.getAll();
        if (props.match.params.id) {
          for (let i = 0; i < data.length; i++) {
            if (data[i]._id === props.match.params.id) {
              setCurrentEventRoom(i);
              break;
            }
          }
        }
        setEventRooms(data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    fetchEventRooms();
  }, [props.match.params.id]);

  const handleClickEventRoom = (index) => {
    setCurrentEventRoom(index);
  };

  const handleClickRemove = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await EventRoomService.delete(id);
        setCurrentEventRoom(0);
        setEventRooms(eventRooms.filter((eventRoom) => eventRoom._id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClickEdit = (index) => {
    console.log(eventRooms[index]);
    props.history.push({
      pathname: "/edit",
      state: { eventRoom: eventRooms[index] },
    });
  };

  return (
    <Container className={classes.mainSection}>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={hideAlert} severity={alert.type}>
          {alert.message}
        </MuiAlert>
      </Snackbar>
      <Typography variant="h4">Event Rooms</Typography>
      {isLoading ? (
        <div className={classes.progressLoader}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <List component="nav" aria-label="event rooms">
              <ListItem
                button
                component={RouterLink}
                to="/create"
                className={classes.listItemCreate}
              >
                <ListItemIcon>
                  <AddIcon style={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Create event room"
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
              {eventRooms.length > 0 &&
                eventRooms.map((eventRoom, index) => (
                  <ListItem
                    id={`listItem${index}`}
                    key={eventRoom._id}
                    button
                    selected={currentEventRoom === index}
                    onClick={() => handleClickEventRoom(index)}
                  >
                    <ListItemIcon>
                      <DesktopWindowsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={eventRoom.title}
                      primaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItem>
                ))}
            </List>
          </Grid>
          <Grid item md={9} xs={12}>
            <Card className={classes.eventInfoPanel}>
              {eventRooms.length > 0 && !!eventRooms[currentEventRoom] ? (
                <React.Fragment>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {moment(eventRooms[currentEventRoom].eventDate).format(
                        "MMMM DD YYYY, h:mm a"
                      )}
                    </Typography>
                    <Typography id="currentEventRoomTitle" variant="h5" component="h2">
                      {eventRooms[currentEventRoom].title}
                    </Typography>
                    <div className={classes.divider} />
                    <Grid container>
                      <Grid item md={9} xs={12} className={classes.centerTableGrid}>
                        <TableGrid tables={eventRooms[currentEventRoom].meetingTables} />
                        <div className={classes.divider} />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <Typography variant="subtitle2">Scene: </Typography>
                        <Typography variant="body2">
                          {findScene(eventRooms[currentEventRoom].scene)}
                        </Typography>
                        <div className={classes.divider} />
                        <Typography variant="subtitle2">Background: </Typography>
                        <Typography variant="body2">
                          {isBackgroundPreset(eventRooms[currentEventRoom].background)
                            ? findBackground(eventRooms[currentEventRoom].background)
                            : getFileNameFromBlobUrl(eventRooms[currentEventRoom].background)}
                        </Typography>
                        <div className={classes.divider} />
                        <Typography variant="subtitle2">Event Room URL: </Typography>
                        <a
                          href={`${platformURL}?id=${eventRooms[currentEventRoom]._id}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <Typography variant="body2" noWrap>
                            {platformURL}?id={eventRooms[currentEventRoom]._id}
                          </Typography>
                        </a>
                        <Button
                          aria-label="copyUrl"
                          className={classes.mt}
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              platformURL + "?id=" + eventRooms[currentEventRoom]._id
                            );
                          }}
                        >
                          Copy URL
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button
                      aria-label="editEventRoomButton"
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        handleClickEdit(currentEventRoom);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      aria-label="removeEventRoomButton"
                      color="secondary"
                      variant="outlined"
                      onClick={() => {
                        handleClickRemove(eventRooms[currentEventRoom]._id);
                      }}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </React.Fragment>
              ) : (
                <Typography id="createEventRoomButton" color="textSecondary" gutterBottom>
                  Create an event room
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default EventRooms;
