import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import EventRoomService from "../services/EventRoomService";
import { useReducerState } from "../utils/customHooks";
import { validateEventRoom } from "../utils/validate";
import EventRoomForm from "../components/EventRoomForm";

const useStyles = makeStyles((theme) => ({
  mainSection: {
    paddingTop: theme.spacing(5),
  },
}));

const EditEventRoom = (props) => {
  const classes = useStyles();
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

  const handleSubmit = async (data) => {
    const id = props.location.state.eventRoom._id;
    if (validateEventRoom(data)) {
      try {
        const updatedEventRoom = await EventRoomService.update(id, data);
        props.history.push({
          pathname: `/eventrooms/${updatedEventRoom._id}`,
          state: { created: true },
        });
      } catch (err) {
        showAlert("Failed to edit event room. Please try again later.", "error");
        console.log(err);
      }
    } else {
      showAlert("Please make sure you have entered all the fields", "warning");
    }
  };

  return (
    <Container className={classes.mainSection}>
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={hideAlert} severity={alert.type}>
          {alert.message}
        </MuiAlert>
      </Snackbar>
      <Typography variant="h4">Edit Event Room</Typography>
      <EventRoomForm
        onSubmit={handleSubmit}
        submitText="Save Event Room"
        updateEventRoom={props.location.state.eventRoom}
      />
    </Container>
  );
};

export default EditEventRoom;
