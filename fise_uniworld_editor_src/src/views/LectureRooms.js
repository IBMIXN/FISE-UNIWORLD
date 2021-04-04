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
import LectureRoomService from "../services/LectureRoomService";
import { Link as RouterLink } from "react-router-dom";
import { platformURL } from "../config";
import { useReducerState } from "../utils/customHooks";
import BlobService from "../services/BlobService";
import { getFileName } from "../utils/blobs";

const useStyles = makeStyles((theme) => ({
  mainSection: {
    paddingTop: theme.spacing(5),
  },
  lectureInfoPanel: {
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

const LectureRooms = (props) => {
  const classes = useStyles();
  const [lectureRooms, setLectureRooms] = React.useState([]);
  const [currentLectureRoom, setCurrentLectureRoom] = React.useState(0);
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
      showAlert("Successfully created lecture room.", "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);

  React.useEffect(() => {
    async function fetchLectureRooms() {
      try {
        setLoading(true);
        const data = await LectureRoomService.get();
        if (props.match.params.id) {
          for (let i = 0; i < data.length; i++) {
            if (data[i]._id === props.match.params.id) {
              setCurrentLectureRoom(i);
              break;
            }
          }
        }
        setLectureRooms(data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    fetchLectureRooms();
  }, [props]);

  const handleClickLectureRoom = (index) => {
    setCurrentLectureRoom(index);
  };

  const handleClickRemove = async (lectureRoomToDelete) => {
    if (window.confirm("Are you sure?")) {
      try {
        await BlobService.deleteSlides(
          getFileName(lectureRoomToDelete.firstSlideUrl),
          lectureRoomToDelete.numSlides
        );
        await LectureRoomService.delete(lectureRoomToDelete._id);
        setCurrentLectureRoom(0);
        setLectureRooms(
          lectureRooms.filter((lectureRoom) => lectureRoom._id !== lectureRoomToDelete._id)
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClickEdit = (index) => {
    console.log(lectureRooms[index]);
    props.history.push({
      pathname: "/editlectureroom",
      state: { lectureRoom: lectureRooms[index] },
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
      <Typography variant="h4">Lecture Rooms</Typography>
      {isLoading ? (
        <div className={classes.progressLoader}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <List component="nav" aria-label="lecture rooms">
              <ListItem
                button
                component={RouterLink}
                to="/createlectureroom"
                className={classes.listItemCreate}
              >
                <ListItemIcon>
                  <AddIcon style={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Create lecture room"
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
              {lectureRooms.length > 0 &&
                lectureRooms.map((lectureRoom, index) => (
                  <ListItem
                    id={`listItem${index}`}
                    key={lectureRoom._id}
                    button
                    selected={currentLectureRoom === index}
                    onClick={() => handleClickLectureRoom(index)}
                  >
                    <ListItemIcon>
                      <DesktopWindowsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={lectureRoom.title}
                      secondary={lectureRoom.module}
                      primaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItem>
                ))}
            </List>
          </Grid>
          <Grid item md={9} xs={12}>
            <Card className={classes.lectureInfoPanel}>
              {lectureRooms.length > 0 && !!lectureRooms[currentLectureRoom] ? (
                <React.Fragment>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {lectureRooms[currentLectureRoom].module}
                    </Typography>
                    <Typography id="currentLectureRoomTitle" variant="h5" component="h2">
                      {lectureRooms[currentLectureRoom].title}
                    </Typography>
                  </CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={8} xs={12}>
                      <img
                        width="100%"
                        alt="lecture preview"
                        src={lectureRooms[currentLectureRoom].firstSlideUrl}
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <Typography variant="subtitle2">Lecturer:</Typography>
                      <Typography variant="body2" gutterBottom>
                        {lectureRooms[currentLectureRoom].lecturer}
                      </Typography>
                      <div className={classes.divider} />
                      <Typography variant="subtitle2">Time:</Typography>
                      <Typography variant="body2" gutterBottom>
                        {moment(lectureRooms[currentLectureRoom].startTime).format("h:mm a")} -{" "}
                        {moment(lectureRooms[currentLectureRoom].endTime).format("h:mm a")}
                      </Typography>
                      <div className={classes.divider} />
                      <Typography variant="subtitle2">Date:</Typography>
                      <Typography variant="body2" gutterBottom>
                        {moment(lectureRooms[currentLectureRoom].startTime).format("MMMM DD YYYY")}
                      </Typography>
                      <div className={classes.divider} />
                      <Typography variant="subtitle2">Lecture Room URL: </Typography>
                      <a
                        href={`${platformURL}?lid=${lectureRooms[currentLectureRoom]._id}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <Typography variant="body2" noWrap>
                          {platformURL}?lid={lectureRooms[currentLectureRoom]._id}
                        </Typography>
                      </a>
                      <Button
                        aria-label="copyUrl"
                        className={classes.mt}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            platformURL + "?lid=" + lectureRooms[currentLectureRoom]._id
                          );
                        }}
                      >
                        Copy URL
                      </Button>
                    </Grid>
                  </Grid>
                  <CardActions>
                    <Button
                      aria-label="editLectureRoomButton"
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        handleClickEdit(currentLectureRoom);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      aria-label="removeLectureRoomButton"
                      color="secondary"
                      variant="outlined"
                      onClick={() => {
                        handleClickRemove(lectureRooms[currentLectureRoom]);
                      }}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </React.Fragment>
              ) : (
                <Typography id="createLectureRoomButton" color="textSecondary" gutterBottom>
                  Create lecture room
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default LectureRooms;
